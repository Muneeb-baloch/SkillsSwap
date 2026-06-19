import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  getDocs,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './RequestsScreen.styles';

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

function timeAgo(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

const sortByCreatedDesc = (a, b) => {
  const aT = a.createdAt?.toDate?.() || new Date(0);
  const bT = b.createdAt?.toDate?.() || new Date(0);
  return bT - aT;
};

const STATUS_META = {
  pending:               { label: 'Pending',          key: 'pending' },
  accepted:              { label: 'Accepted',         key: 'accepted' },
  declined:              { label: 'Declined',         key: 'declined' },
  completion_requested:  { label: 'Awaiting confirm', key: 'completion_requested' },
  completed:             { label: 'Completed',        key: 'completed' },
  disputed:              { label: 'Disputed',         key: 'disputed' },
  cancelled:             { label: 'Cancelled',        key: 'cancelled' },
};

const RequestsScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);

  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'sent'
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const currentUser = auth.currentUser;

  // Real-time listeners for incoming + sent requests.
  // We query by a single field and sort client-side so no composite index is needed.
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    let firstIn = true;
    let firstSent = true;

    const incomingQ = query(
      collection(db, 'barterRequests'),
      where('toUserId', '==', currentUser.uid),
    );
    const sentQ = query(
      collection(db, 'barterRequests'),
      where('fromUserId', '==', currentUser.uid),
    );

    const unsubIn = onSnapshot(
      incomingQ,
      snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort(sortByCreatedDesc);
        setIncoming(data);
        if (firstIn) {
          firstIn = false;
          setLoading(false);
        }
      },
      err => {
        console.error('Incoming requests listener error:', err);
        setLoading(false);
      },
    );

    const unsubSent = onSnapshot(
      sentQ,
      snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort(sortByCreatedDesc);
        setSent(data);
        if (firstSent) {
          firstSent = false;
          setLoading(false);
        }
      },
      err => console.error('Sent requests listener error:', err),
    );

    return () => {
      unsubIn();
      unsubSent();
    };
  }, [currentUser]);

  // Accept → set status, then create a chat doc (if one doesn't already exist).
  const handleAccept = useCallback(
    async request => {
      if (!currentUser) return;
      setActingId(request.id);
      try {
        await updateDoc(doc(db, 'barterRequests', request.id), { status: 'accepted' });

        // Avoid creating a duplicate chat for the same request.
        const existingQ = query(
          collection(db, 'chats'),
          where('requestId', '==', request.id),
        );
        const existing = await getDocs(existingQ);
        if (existing.empty) {
          await addDoc(collection(db, 'chats'), {
            participants: [request.fromUserId, request.toUserId],
            requestId: request.id,
            listingId: request.listingId || '',
            lastMessage: '',
            lastMessageAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          });
        }
        Alert.alert('Request accepted', 'A chat has been opened. Head to Chats to start talking!');
      } catch (err) {
        console.error('Accept error:', err);
        Alert.alert('Error', 'Could not accept the request. Please try again.');
      } finally {
        setActingId(null);
      }
    },
    [currentUser],
  );

  const handleDecline = useCallback(request => {
    Alert.alert('Decline request', 'Are you sure you want to decline this request?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: async () => {
          setActingId(request.id);
          try {
            await updateDoc(doc(db, 'barterRequests', request.id), { status: 'declined' });
          } catch (err) {
            console.error('Decline error:', err);
            Alert.alert('Error', 'Could not decline the request. Please try again.');
          } finally {
            setActingId(null);
          }
        },
      },
    ]);
  }, []);

  const openChat = useCallback(
    async request => {
      if (!currentUser) return;
      try {
        // 1. Preferred: the chat linked to this exact request.
        const byRequest = await getDocs(
          query(collection(db, 'chats'), where('requestId', '==', request.id)),
        );
        if (!byRequest.empty) {
          navigation.navigate('ChatRoom', { chatId: byRequest.docs[0].id });
          return;
        }

        // 2. Fallback: an existing chat between these two people (covers
        //    requests accepted before chats were linked by requestId).
        const otherId =
          request.fromUserId === currentUser.uid ? request.toUserId : request.fromUserId;
        const mine = await getDocs(
          query(collection(db, 'chats'), where('participants', 'array-contains', currentUser.uid)),
        );
        const match = mine.docs.find(d => (d.data().participants || []).includes(otherId));
        if (match) {
          navigation.navigate('ChatRoom', { chatId: match.id });
          return;
        }

        // 3. None exists yet — create it now.
        const ref = await addDoc(collection(db, 'chats'), {
          participants: [request.fromUserId, request.toUserId],
          requestId: request.id,
          listingId: request.listingId || '',
          lastMessage: '',
          lastMessageAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
        navigation.navigate('ChatRoom', { chatId: ref.id });
      } catch (err) {
        console.error('Open chat error:', err);
        Alert.alert('Error', 'Could not open the chat. Please try again.');
      }
    },
    [navigation, currentUser],
  );

  // Find the chat linked to a request (for posting system messages).
  const findChatId = async reqId => {
    try {
      const snap = await getDocs(query(collection(db, 'chats'), where('requestId', '==', reqId)));
      return snap.empty ? '' : snap.docs[0].id;
    } catch {
      return '';
    }
  };

  // Confirm a completion request → status 'completed', then go straight to review.
  const handleConfirmFromRequests = useCallback(
    async (request, otherId, otherName) => {
      if (!currentUser) return;
      setActingId(request.id);
      try {
        await updateDoc(doc(db, 'barterRequests', request.id), {
          status: 'completed',
          completedAt: serverTimestamp(),
          completionConfirmedBy: arrayUnion(currentUser.uid),
        });
        const cid = await findChatId(request.id);
        if (cid) {
          await addDoc(collection(db, 'chats', cid, 'messages'), {
            senderId: 'system',
            text: `🎉 ${currentUser.displayName || 'A user'} confirmed the swap is complete! Both users can now leave reviews.`,
            type: 'system',
            sentAt: serverTimestamp(),
          });
        }
        navigation.navigate('LeaveReview', {
          requestId: request.id,
          chatId: cid,
          toUserId: otherId,
          toUserName: otherName,
          canReviewWithoutConfirmation: false,
        });
      } catch (err) {
        console.error('Confirm error:', err);
        Alert.alert('Error', 'Could not confirm. Please try again.');
      } finally {
        setActingId(null);
      }
    },
    [currentUser, navigation],
  );

  const handleDisputeFromRequests = useCallback(
    request => {
      Alert.alert(
        'Report incomplete swap?',
        'This will flag the swap as disputed. Please only do this if the swap genuinely did not happen.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Report dispute',
            style: 'destructive',
            onPress: async () => {
              if (!currentUser) return;
              setActingId(request.id);
              try {
                await updateDoc(doc(db, 'barterRequests', request.id), {
                  status: 'disputed',
                  disputedBy: currentUser.uid,
                  disputedAt: serverTimestamp(),
                });
                const cid = await findChatId(request.id);
                if (cid) {
                  await addDoc(collection(db, 'chats', cid, 'messages'), {
                    senderId: 'system',
                    text: `${currentUser.displayName || 'A user'} has reported this swap as incomplete. Please resolve this by messaging each other.`,
                    type: 'system',
                    sentAt: serverTimestamp(),
                  });
                }
              } catch (err) {
                console.error('Dispute error:', err);
                Alert.alert('Error', 'Failed to report dispute');
              } finally {
                setActingId(null);
              }
            },
          },
        ],
      );
    },
    [currentUser],
  );

  const contactSupport = () =>
    Alert.alert('Support', 'Email us at support@skillsswap.app with your swap details.');

  const renderStatusBadge = status => {
    const meta = STATUS_META[status] || STATUS_META.pending;
    return (
      <View style={[styles.badge, styles[`badge_${meta.key}`]]}>
        <Text style={[styles.badgeText, styles[`badgeText_${meta.key}`]]}>{meta.label}</Text>
      </View>
    );
  };

  const renderCard = ({ item }) => {
    const isIncoming = activeTab === 'incoming';
    const personName = isIncoming
      ? item.fromUserName && item.fromUserName !== 'Anonymous'
        ? item.fromUserName
        : 'User'
      : item.toUserName && item.toUserName !== 'Anonymous'
      ? item.toUserName
      : 'User';
    const personPhoto = isIncoming ? item.fromUserPhoto : item.toUserPhoto;
    const personId = isIncoming ? item.fromUserId : item.toUserId;
    const busy = actingId === item.id;
    const iRequestedCompletion = item.completionRequestedBy === currentUser?.uid;
    const alreadyReviewed = !!(currentUser && item[`reviewLeft_${currentUser.uid}`]);

    const goToReview = canEarly =>
      navigation.navigate('LeaveReview', {
        requestId: item.id,
        toUserId: personId,
        toUserName: personName,
        canReviewWithoutConfirmation: canEarly,
      });

    return (
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={() => navigation.navigate('UserProfile', { userId: personId })}
            activeOpacity={0.7}
          >
            {personPhoto ? (
              <Image source={{ uri: personPhoto }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(personName)}</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.cardHeaderText}>
            <Text style={styles.personName} numberOfLines={1}>{personName}</Text>
            <Text style={styles.timeAgo}>{timeAgo(item.createdAt)}</Text>
          </View>

          {renderStatusBadge(item.status)}
        </View>

        <View style={styles.swapRow}>
          <Text style={styles.swapText} numberOfLines={2}>
            {isIncoming ? 'Wants to learn ' : 'You want to learn '}
            <Text style={styles.swapHighlight}>{capitalize(item.offerSkill) || 'a skill'}</Text>
            {item.fromUserSkill ? (
              <>
                {'  ·  offers '}
                <Text style={styles.swapHighlightAlt}>{capitalize(item.fromUserSkill)}</Text>
              </>
            ) : null}
          </Text>
        </View>

        {item.message ? <Text style={styles.message} numberOfLines={3}>“{item.message}”</Text> : null}

        {/* Actions — vary by status */}
        {isIncoming && item.status === 'pending' ? (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.declineBtn]}
              onPress={() => handleDecline(item)}
              disabled={busy}
              activeOpacity={0.8}
            >
              <Text style={styles.declineBtnText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.acceptBtn]}
              onPress={() => handleAccept(item)}
              disabled={busy}
              activeOpacity={0.8}
            >
              {busy ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.acceptBtnText}>Accept</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : item.status === 'accepted' ? (
          <TouchableOpacity style={styles.chatBtn} onPress={() => openChat(item)} activeOpacity={0.8}>
            <Text style={styles.chatBtnText}>Open chat →</Text>
          </TouchableOpacity>
        ) : item.status === 'completion_requested' ? (
          iRequestedCompletion ? (
            // I requested completion → waiting on the other person.
            <>
              <Text style={styles.waitingNote}>Waiting for {personName} to confirm</Text>
              <View style={styles.linkRow}>
                <TouchableOpacity onPress={() => openChat(item)} activeOpacity={0.7}>
                  <Text style={styles.linkMuted}>Open chat →</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => goToReview(true)} activeOpacity={0.7}>
                  <Text style={styles.reviewLink}>Leave review →</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // I need to confirm.
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.declineBtn]}
                onPress={() => handleDisputeFromRequests(item)}
                disabled={busy}
                activeOpacity={0.8}
              >
                <Text style={styles.disputeBtnText}>Dispute</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.acceptBtn]}
                onPress={() => handleConfirmFromRequests(item, personId, personName)}
                disabled={busy}
                activeOpacity={0.8}
              >
                {busy ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.acceptBtnText}>Confirm complete</Text>
                )}
              </TouchableOpacity>
            </View>
          )
        ) : item.status === 'completed' ? (
          alreadyReviewed ? (
            <Text style={styles.reviewedText}>✓ Reviewed</Text>
          ) : (
            <TouchableOpacity onPress={() => goToReview(false)} activeOpacity={0.7}>
              <Text style={styles.reviewLink}>Leave review →</Text>
            </TouchableOpacity>
          )
        ) : item.status === 'disputed' ? (
          <TouchableOpacity onPress={contactSupport} activeOpacity={0.7}>
            <Text style={styles.supportLink}>Contact support</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const data = activeTab === 'incoming' ? incoming : sent;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Requests</Text>
        <Text style={styles.subtitle}>Manage your skill swap requests</Text>
      </View>

      {/* Tab switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'incoming' && styles.tabActive]}
          onPress={() => setActiveTab('incoming')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'incoming' && styles.tabTextActive]}>
            Incoming{incoming.length ? ` (${incoming.length})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sent' && styles.tabActive]}
          onPress={() => setActiveTab('sent')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'sent' && styles.tabTextActive]}>
            Sent{sent.length ? ` (${sent.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.purple} />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderCard}
          contentContainerStyle={[styles.listContent, data.length === 0 && styles.centered]}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {activeTab === 'incoming'
                ? 'No incoming requests yet.\nWhen someone wants to swap with you, it shows here.'
                : "You haven't sent any requests yet.\nBrowse skills and request a swap!"}
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default RequestsScreen;
