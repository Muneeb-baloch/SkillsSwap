import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './AllReviewsScreen.styles';

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

function starString(rating) {
  const full = Math.round(rating || 0);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

const BackIcon = ({ theme }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path
      d="M19 12H5M12 5l-7 7 7 7"
      fill="none"
      stroke={theme.textPrimary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AllReviewsScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);
  const insets = useSafeAreaInsets();
  const { userId, userName } = route.params || {};

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = userId === auth.currentUser?.uid;

  const fetchReviews = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // No orderBy — combining it with the toUserId filter needs a composite
      // index (same reason as ProfileScreen). Sort client-side instead.
      const snap = await getDocs(
        query(collection(db, 'reviews'), where('toUserId', '==', userId)),
      );
      const fetched = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        // Pending-confirmation reviews are only the owner's business —
        // other people just see published ones (matches the aggregate
        // rating, which is also computed from published only).
        .filter(r => isOwnProfile || r.status !== 'pending_confirmation')
        .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setReviews(fetched);
    } catch (err) {
      console.error('Fetch reviews error:', err);
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  }, [userId, isOwnProfile]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const published = reviews.filter(r => r.status !== 'pending_confirmation');
  const avgRating = published.length
    ? Math.round((published.reduce((sum, r) => sum + (r.rating || 0), 0) / published.length) * 10) / 10
    : 0;

  const renderSummary = () =>
    reviews.length > 0 ? (
      <View style={styles.summaryCard}>
        <Text style={styles.summaryRating}>{avgRating}</Text>
        <View style={styles.summaryDetails}>
          <Text style={styles.summaryStars}>{starString(avgRating)}</Text>
          <Text style={styles.summaryOutOf}>out of 5</Text>
          <Text style={styles.summaryCount}>
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} total
          </Text>
        </View>
      </View>
    ) : null;

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewTopRow}>
        {item.fromUserPhoto ? (
          <Image source={{ uri: item.fromUserPhoto }} style={styles.reviewAvatarImage} />
        ) : (
          <View style={styles.reviewAvatar}>
            <Text style={styles.reviewAvatarText}>{getInitials(item.fromUserName)}</Text>
          </View>
        )}
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName} numberOfLines={1}>
            {item.fromUserName || 'User'}
          </Text>
          <Text style={styles.reviewTime}>{timeAgo(item.createdAt)}</Text>
        </View>
        <Text style={styles.reviewStars}>{starString(item.rating)}</Text>
      </View>

      {item.comment ? <Text style={styles.reviewComment}>{item.comment}</Text> : null}

      {item.status === 'pending_confirmation' && (
        <View style={styles.pendingBadge}>
          <Text style={styles.pendingBadgeText}>Pending swap confirmation</Text>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyTitle}>No reviews yet</Text>
      <Text style={styles.emptySubtitle}>Reviews appear after completing skill swaps</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <BackIcon theme={theme} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {isOwnProfile ? 'My Reviews' : `${userName || 'User'}'s Reviews`}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.purple} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchReviews} activeOpacity={0.8}>
            <Text style={styles.retryBtnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={item => item.id}
          renderItem={renderReview}
          ListHeaderComponent={renderSummary}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default AllReviewsScreen;
