import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './ChatRoomScreen.styles';

function getInitials(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatTime(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// How many whole hours have elapsed since a Firestore timestamp.
const hoursSince = timestamp => {
  if (!timestamp) return 0;
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = Date.now() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60));
};

// A completion request auto-unlocks (reviewer no longer needs the other party
// to confirm) once 48 hours have passed with no response.
const isAutoUnlocked = requestData => {
  if (!requestData?.completionRequestedAt) return false;
  return hoursSince(requestData.completionRequestedAt) >= 48;
};

const ChatRoomScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);
  const { chatId } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [request, setRequest] = useState(null);
  const [otherProfile, setOtherProfile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [completing, setCompleting] = useState(false);

  const currentUser = auth.currentUser;
  const otherIdRef = useRef(null);

  // Load the chat doc (participants + requestId) and the other user's profile.
  useEffect(() => {
    if (!chatId || !currentUser) return;
    let active = true;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'chats', chatId));
        if (!active || !snap.exists()) return;
        const data = { id: snap.id, ...snap.data() };
        setChat(data);
        const otherId = (data.participants || []).find(p => p !== currentUser.uid);
        otherIdRef.current = otherId;
        if (otherId) {
          const uSnap = await getDoc(doc(db, 'users', otherId));
          if (active && uSnap.exists()) setOtherProfile({ id: otherId, ...uSnap.data() });
        }
      } catch (err) {
        console.error('Chat load error:', err);
      }
    })();
    return () => {
      active = false;
    };
  }, [chatId, currentUser]);

  // Live-listen to the originating swap request so completion / dispute status
  // updates reflect immediately for both parties.
  useEffect(() => {
    const rid = chat?.requestId;
    if (!rid) return;
    const unsub = onSnapshot(
      doc(db, 'barterRequests', rid),
      snap => {
        if (snap.exists()) setRequest({ id: snap.id, ...snap.data() });
      },
      err => console.error('Request listener error:', err),
    );
    return unsub;
  }, [chat?.requestId]);

  // Real-time messages (newest first for an inverted list — no composite index needed).
  useEffect(() => {
    if (!chatId) return;
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('sentAt', 'desc'),
    );
    const unsub = onSnapshot(
      q,
      snap => {
        setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      err => {
        console.error('Messages listener error:', err);
        setLoading(false);
      },
    );
    return unsub;
  }, [chatId]);

  const handleSend = useCallback(async () => {
    const body = text.trim();
    if (!body || !chatId || !currentUser || sending) return;
    setSending(true);
    setText('');
    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: currentUser.uid,
        text: body,
        sentAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: body,
        lastMessageAt: serverTimestamp(),
        lastMessageSenderId: currentUser.uid,
      });
    } catch (err) {
      console.error('Send error:', err);
      Alert.alert('Error', 'Message failed to send. Please try again.');
      setText(body);
    } finally {
      setSending(false);
    }
  }, [text, chatId, currentUser, sending]);

  // ── Derived state ──────────────────────────────────────────────────────────
  const otherName =
    otherProfile?.name && otherProfile.name !== 'Anonymous' ? otherProfile.name : 'User';
  const requestId = request?.id || chat?.requestId;
  const status = request?.status || 'accepted';
  const iRequestedCompletion = !!request && request.completionRequestedBy === currentUser?.uid;
  const autoUnlocked = isAutoUnlocked(request);
  const alreadyReviewed = !!(request && currentUser && request[`reviewLeft_${currentUser.uid}`]);

  const goToReview = canEarly =>
    navigation.navigate('LeaveReview', {
      requestId,
      chatId,
      toUserId: otherIdRef.current,
      toUserName: otherName,
      canReviewWithoutConfirmation: canEarly,
    });

  // Step 1: a user marks the swap complete → status becomes completion_requested.
  const handleRequestCompletion = useCallback(() => {
    if (!requestId) {
      Alert.alert('Not available', "This swap can't be completed yet.");
      return;
    }
    Alert.alert(
      'Mark swap complete',
      `${otherName} will be asked to confirm. Once they confirm (or after 48 hours), the swap is finalized.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark complete',
          onPress: async () => {
            setCompleting(true);
            try {
              await updateDoc(doc(db, 'barterRequests', requestId), {
                status: 'completion_requested',
                completionRequestedBy: currentUser.uid,
                completionRequestedAt: serverTimestamp(),
              });
              await addDoc(collection(db, 'chats', chatId, 'messages'), {
                senderId: 'system',
                text: `${currentUser.displayName || 'A user'} marked this swap as complete. ${otherName}, please confirm to finalize it.`,
                type: 'system',
                sentAt: serverTimestamp(),
              });
            } catch (err) {
              console.error('Request completion error:', err);
              Alert.alert('Error', 'Could not mark complete. Please try again.');
            } finally {
              setCompleting(false);
            }
          },
        },
      ],
    );
  }, [requestId, chatId, currentUser, otherName]);

  // Step 2a: the other user confirms → status becomes completed (both can review).
  const handleConfirmComplete = useCallback(async () => {
    if (!requestId) return;
    try {
      setCompleting(true);
      await updateDoc(doc(db, 'barterRequests', requestId), {
        status: 'completed',
        completedAt: serverTimestamp(),
        completionConfirmedBy: arrayUnion(currentUser.uid),
      });
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: 'system',
        text: `🎉 ${currentUser.displayName || 'A user'} confirmed the swap is complete! Both users can now leave reviews.`,
        type: 'system',
        sentAt: serverTimestamp(),
      });
      goToReview(false);
    } catch (err) {
      console.error('Confirm complete error:', err);
      Alert.alert('Error', 'Failed to confirm');
    } finally {
      setCompleting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, chatId, currentUser, otherName]);

  // Step 2b: the other user disagrees → status becomes disputed.
  const handleDisputeComplete = useCallback(() => {
    if (!requestId) return;
    Alert.alert(
      'Report incomplete swap?',
      'This will flag the swap as disputed. Please only do this if the swap genuinely did not happen.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report dispute',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'barterRequests', requestId), {
                status: 'disputed',
                disputedBy: currentUser.uid,
                disputedAt: serverTimestamp(),
              });
              await addDoc(collection(db, 'chats', chatId, 'messages'), {
                senderId: 'system',
                text: `${currentUser.displayName || 'A user'} has reported this swap as incomplete. Please resolve this by messaging each other.`,
                type: 'system',
                sentAt: serverTimestamp(),
              });
            } catch (err) {
              console.error('Dispute error:', err);
              Alert.alert('Error', 'Failed to report dispute');
            }
          },
        },
      ],
    );
  }, [requestId, chatId, currentUser]);

  const contactSupport = () =>
    Alert.alert('Support', 'Email us at support@skillsswap.app with your swap details.');

  // Header ✓ button: visible only while the swap is still actionable by me.
  const showHeaderComplete =
    status === 'accepted' || (status === 'completion_requested' && iRequestedCompletion && autoUnlocked);

  const onHeaderComplete = () => {
    if (status === 'accepted') handleRequestCompletion();
    else goToReview(true); // auto-unlocked requester → early review
  };

  // ── Renderers ──────────────────────────────────────────────────────────────
  const renderMessage = ({ item }) => {
    if (item.senderId === 'system' || item.type === 'system') {
      return (
        <View style={styles.systemRow}>
          <View style={styles.systemBubble}>
            <Text style={styles.systemText}>{item.text}</Text>
          </View>
        </View>
      );
    }
    const mine = item.senderId === currentUser?.uid;
    return (
      <View style={[styles.bubbleRow, mine ? styles.bubbleRowMine : styles.bubbleRowTheirs]}>
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.bubbleText, mine ? styles.bubbleTextMine : styles.bubbleTextTheirs]}>
            {item.text}
          </Text>
          <Text style={[styles.bubbleTime, mine ? styles.bubbleTimeMine : styles.bubbleTimeTheirs]}>
            {formatTime(item.sentAt)}
          </Text>
        </View>
      </View>
    );
  };

  const renderStatusBanner = () => {
    if (!request) return null;

    if (status === 'completion_requested') {
      if (iRequestedCompletion) {
        const hoursLeft = 48 - hoursSince(request.completionRequestedAt);
        return (
          <View style={[styles.statusBanner, styles.bannerWaiting]}>
            <View style={styles.bannerRow}>
              <Text style={styles.bannerIcon}>⏳</Text>
              <Text style={[styles.bannerText, styles.bannerTextGold]}>
                You marked this complete · waiting for {otherName} to confirm
              </Text>
            </View>
            <View style={styles.bannerSubRow}>
              <Text style={styles.bannerSubText}>You can leave a review now if you're done</Text>
              <TouchableOpacity onPress={() => goToReview(true)} activeOpacity={0.7}>
                <Text style={styles.reviewLink}>Leave review →</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.autoText}>
              {hoursLeft > 0
                ? `Auto-completes in ${hoursLeft}h if no response`
                : `Auto-completed · ${otherName} did not respond`}
            </Text>
          </View>
        );
      }
      return (
        <View style={[styles.statusBanner, styles.bannerConfirm]}>
          <View style={styles.bannerRow}>
            <View style={styles.purpleDot} />
            <Text style={[styles.bannerText, styles.bannerTextPurple]}>
              {otherName} marked this swap complete
            </Text>
          </View>
          <View style={styles.bannerActions}>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirmComplete}
              disabled={completing}
              activeOpacity={0.85}
            >
              {completing ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.confirmBtnText}>Confirm complete</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.disputeBtn}
              onPress={handleDisputeComplete}
              activeOpacity={0.85}
            >
              <Text style={styles.disputeBtnText}>Didn't happen</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (status === 'completed') {
      return (
        <View style={[styles.statusBanner, styles.bannerCompleted]}>
          <View style={styles.bannerRow}>
            <Text style={styles.bannerIcon}>✓</Text>
            <Text style={[styles.bannerText, styles.bannerTextTeal]}>Swap completed!</Text>
          </View>
          {alreadyReviewed ? (
            <Text style={styles.bannerSubMuted}>✓ You left a review</Text>
          ) : (
            <TouchableOpacity onPress={() => goToReview(false)} activeOpacity={0.7}>
              <Text style={styles.reviewLink}>Leave a review →</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (status === 'disputed') {
      return (
        <View style={[styles.statusBanner, styles.bannerDisputed]}>
          <View style={styles.bannerRow}>
            <Text style={styles.bannerIcon}>⚠️</Text>
            <Text style={[styles.bannerText, styles.bannerTextError]}>
              Swap disputed ·{' '}
              {request.disputedBy === currentUser?.uid
                ? 'You raised a dispute'
                : `${otherName} raised a dispute`}
            </Text>
          </View>
          <TouchableOpacity onPress={contactSupport} activeOpacity={0.7}>
            <Text style={styles.supportLink}>Contact support</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (status === 'cancelled') {
      return (
        <View style={[styles.statusBanner, styles.bannerCancelled]}>
          <Text style={styles.cancelledText}>This swap was cancelled</Text>
        </View>
      );
    }

    // accepted (swap in progress)
    return (
      <View style={[styles.statusBanner, styles.bannerAccepted]}>
        <View style={styles.bannerRow}>
          <Text style={styles.bannerIcon}>🔄</Text>
          <Text style={[styles.bannerText, styles.bannerTextPurple]}>
            Swap in progress — tap ✓ Done when you've completed it
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerCenter}
          activeOpacity={0.7}
          onPress={() =>
            otherIdRef.current && navigation.navigate('UserProfile', { userId: otherIdRef.current })
          }
        >
          {otherProfile?.photoURL ? (
            <Image source={{ uri: otherProfile.photoURL }} style={styles.headerAvatarImage} />
          ) : (
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>{getInitials(otherName)}</Text>
            </View>
          )}
          <Text style={styles.headerName} numberOfLines={1}>{otherName}</Text>
        </TouchableOpacity>

        {showHeaderComplete ? (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={onHeaderComplete}
            disabled={completing}
            activeOpacity={0.7}
          >
            {completing ? (
              <ActivityIndicator color={theme.teal} size="small" />
            ) : (
              <Text style={styles.completeText}>
                {status === 'accepted' ? '✓ Done' : 'Review'}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.completeButtonPlaceholder} />
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Swap status banner (completion / dispute / etc.) */}
        {renderStatusBanner()}

        {/* Context: why this chat started (the original swap request) */}
        {request ? (
          <View style={styles.contextCard}>
            <Text style={styles.contextTitle}>📩 SWAP REQUEST</Text>
            <Text style={styles.contextLine}>
              <Text style={styles.contextName}>
                {request.fromUserId === currentUser?.uid ? 'You' : otherName}
              </Text>
              {request.fromUserId === currentUser?.uid ? ' want to learn ' : ' wants to learn '}
              <Text style={styles.contextHighlight}>
                {capitalize(request.offerSkill) || 'a skill'}
              </Text>
              {request.fromUserSkill ? (
                <>
                  {'  ·  offers '}
                  <Text style={styles.contextHighlightAlt}>
                    {capitalize(request.fromUserSkill)}
                  </Text>
                </>
              ) : null}
            </Text>
            {request.message ? (
              <Text style={styles.contextMessage}>“{request.message}”</Text>
            ) : null}
          </View>
        ) : null}

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.purple} />
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            inverted
            contentContainerStyle={styles.messagesContent}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>No messages yet.{'\n'}Say hello to start your swap!</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={theme.textMuted}
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, (!text.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!text.trim() || sending}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatRoomScreen;
