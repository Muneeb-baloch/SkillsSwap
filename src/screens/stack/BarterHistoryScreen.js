import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './BarterHistoryScreen.styles';

const CLOSED_STATUSES = ['completed', 'disputed', 'cancelled'];

const STATUS_META = {
  completed: { label: 'Completed', key: 'completed' },
  disputed: { label: 'Disputed', key: 'disputed' },
  cancelled: { label: 'Cancelled', key: 'cancelled' },
};

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

function formatDate(timestamp) {
  if (!timestamp) return '';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

const sortClosedDesc = (a, b) => {
  const aT = (a.completedAt || a.disputedAt || a.createdAt)?.toDate?.() || new Date(0);
  const bT = (b.completedAt || b.disputedAt || b.createdAt)?.toDate?.() || new Date(0);
  return bT - aT;
};

const BarterHistoryScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);
  const currentUser = auth.currentUser;

  const [asRequester, setAsRequester] = useState([]);
  const [asOwner, setAsOwner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'completed' | 'disputed' | 'cancelled'

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    let firstA = true;
    let firstB = true;

    const requesterQ = query(
      collection(db, 'barterRequests'),
      where('fromUserId', '==', currentUser.uid),
    );
    const ownerQ = query(
      collection(db, 'barterRequests'),
      where('toUserId', '==', currentUser.uid),
    );

    const unsubA = onSnapshot(
      requesterQ,
      snap => {
        setAsRequester(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        if (firstA) {
          firstA = false;
          setLoading(false);
        }
      },
      err => {
        console.error('Barter history (requester) listener error:', err);
        setLoading(false);
      },
    );

    const unsubB = onSnapshot(
      ownerQ,
      snap => {
        setAsOwner(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        if (firstB) {
          firstB = false;
          setLoading(false);
        }
      },
      err => console.error('Barter history (owner) listener error:', err),
    );

    return () => {
      unsubA();
      unsubB();
    };
  }, [currentUser]);

  const allClosed = [...asRequester, ...asOwner]
    .filter(item => CLOSED_STATUSES.includes(item.status))
    .sort(sortClosedDesc);

  const completedCount = allClosed.filter(i => i.status === 'completed').length;
  const disputedCount = allClosed.filter(i => i.status === 'disputed').length;

  const data = filter === 'all' ? allClosed : allClosed.filter(i => i.status === filter);

  const openChat = useCallback(
    async request => {
      if (!currentUser) return;
      try {
        const byRequest = await getDocs(
          query(collection(db, 'chats'), where('requestId', '==', request.id)),
        );
        if (!byRequest.empty) {
          navigation.navigate('ChatRoom', { chatId: byRequest.docs[0].id });
          return;
        }
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
        Alert.alert('No chat found', 'The chat for this swap is no longer available.');
      } catch (err) {
        console.error('Open chat error:', err);
        Alert.alert('Error', 'Could not open the chat. Please try again.');
      }
    },
    [navigation, currentUser],
  );

  const contactSupport = () =>
    Alert.alert('Support', 'Email us at support@skillsswap.app with your swap details.');

  const renderStatusBadge = status => {
    const meta = STATUS_META[status] || STATUS_META.cancelled;
    return (
      <View style={[styles.badge, styles[`badge_${meta.key}`]]}>
        <Text style={[styles.badgeText, styles[`badgeText_${meta.key}`]]}>{meta.label}</Text>
      </View>
    );
  };

  const renderCard = ({ item }) => {
    const isRequester = item.fromUserId === currentUser?.uid;
    const personName = isRequester
      ? item.toUserName && item.toUserName !== 'Anonymous'
        ? item.toUserName
        : 'User'
      : item.fromUserName && item.fromUserName !== 'Anonymous'
      ? item.fromUserName
      : 'User';
    const personPhoto = isRequester ? item.toUserPhoto : item.fromUserPhoto;
    const personId = isRequester ? item.toUserId : item.fromUserId;
    const alreadyReviewed = !!(currentUser && item[`reviewLeft_${currentUser.uid}`]);
    const dateLabel = formatDate(item.completedAt || item.disputedAt || item.createdAt);

    const goToReview = () =>
      navigation.navigate('LeaveReview', {
        requestId: item.id,
        toUserId: personId,
        toUserName: personName,
        canReviewWithoutConfirmation: false,
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
            <Text style={styles.dateText}>{dateLabel}</Text>
          </View>

          {renderStatusBadge(item.status)}
        </View>

        <View style={styles.swapRow}>
          <Text style={styles.swapText} numberOfLines={2}>
            {isRequester ? 'You learned ' : 'You taught '}
            <Text style={styles.swapHighlight}>{capitalize(item.offerSkill) || 'a skill'}</Text>
            {item.fromUserSkill ? (
              <>
                {isRequester ? '  ·  taught ' : '  ·  learned '}
                <Text style={styles.swapHighlightAlt}>{capitalize(item.fromUserSkill)}</Text>
              </>
            ) : null}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity onPress={() => openChat(item)} activeOpacity={0.7}>
            <Text style={styles.reviewedText}>View chat →</Text>
          </TouchableOpacity>

          {item.status === 'completed' &&
            (alreadyReviewed ? (
              <Text style={styles.reviewedText}>✓ Reviewed</Text>
            ) : (
              <TouchableOpacity onPress={goToReview} activeOpacity={0.7}>
                <Text style={styles.reviewLink}>Leave review →</Text>
              </TouchableOpacity>
            ))}

          {item.status === 'disputed' && (
            <TouchableOpacity onPress={contactSupport} activeOpacity={0.7}>
              <Text style={styles.supportLink}>Contact support</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'completed', label: 'Completed' },
    { key: 'disputed', label: 'Disputed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Barter History</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{completedCount}</Text>
          <Text style={styles.summaryLabel}>Completed</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{disputedCount}</Text>
          <Text style={styles.summaryLabel}>Disputed</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterChipText, filter === f.key && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
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
            <>
              <Text style={styles.emptyTitle}>No past swaps yet</Text>
              <Text style={styles.emptyText}>
                Completed, disputed, and cancelled swaps will show up here once a barter has run its
                course.
              </Text>
            </>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default BarterHistoryScreen;
