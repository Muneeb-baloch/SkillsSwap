import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './UserProfileScreen.styles';

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function formatMemberSince(createdAt) {
  if (!createdAt) return '';
  const d = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  return `Member since ${d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const BackIcon = ({ color }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M19 12H5M12 5l-7 7 7 7" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

const PinIcon = ({ color, size = 13 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
    />
    <Path d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" fill={color} stroke="none" />
  </Svg>
);

const ChatIcon = ({ color, size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ChevronRightIcon = ({ color, size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M9 18l6-6-6-6" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── Main screen ───────────────────────────────────────────────────────────────

const UserProfileScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);

  const userId = route.params?.userId;
  const isOwnProfile = !!userId && auth.currentUser?.uid === userId;

  const [userData, setUserData] = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [swapsCount, setSwapsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const [userResult, listingsResult, reviewsResult, swapsResult] = await Promise.allSettled([
      getDoc(doc(db, 'users', userId)),
      getDocs(
        query(
          collection(db, 'listings'),
          where('userId', '==', userId),
          where('active', '==', true),
          orderBy('createdAt', 'desc'),
          limit(5),
        ),
      ),
      getDocs(
        query(
          collection(db, 'reviews'),
          where('toUserId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(5),
        ),
      ),
      getDocs(
        query(
          collection(db, 'barterRequests'),
          where('toUserId', '==', userId),
          where('status', '==', 'completed'),
        ),
      ),
    ]);

    if (userResult.status === 'fulfilled') {
      setUserData(userResult.value.exists() ? userResult.value.data() : null);
    } else {
      console.error('UserProfile fetch error (user doc):', userResult.reason);
      setUserData(null);
    }

    setListings(listingsResult.status === 'fulfilled' ? listingsResult.value.docs.map(d => ({ id: d.id, ...d.data() })) : []);
    setReviews(reviewsResult.status === 'fulfilled' ? reviewsResult.value.docs.map(d => ({ id: d.id, ...d.data() })) : []);
    setSwapsCount(swapsResult.status === 'fulfilled' ? swapsResult.value.size : 0);

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleMoreOptions = () => {
    Alert.alert('Profile options', undefined, [
      { text: 'Report user', onPress: () => Alert.alert('Reported', 'Thank you for keeping SkillsSwap safe') },
      { text: 'Block user', onPress: () => Alert.alert('Coming soon') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleMessage = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    try {
      const q = query(collection(db, 'chats'), where('participants', 'array-contains', currentUser.uid));
      const snap = await getDocs(q);
      const existingChat = snap.docs.find(d => (d.data().participants || []).includes(userId));
      if (existingChat) {
        navigation.navigate('ChatRoom', { chatId: existingChat.id });
      } else {
        Alert.alert('Send a swap request first to start chatting');
      }
    } catch (err) {
      console.error('Chat check error:', err);
      Alert.alert('Send a swap request first to start chatting');
    }
  };

  const handleRequestSwap = () => {
    if (listings.length > 0) {
      navigation.navigate('ListingDetail', { listing: listings[0] });
    } else {
      Alert.alert('No active listings', `${userData?.name || 'This user'} has no active listings to swap with right now.`);
    }
  };

  const hasSkills = (userData?.skills?.length || 0) > 0 || (userData?.wants?.length || 0) > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <BackIcon color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleMoreOptions} activeOpacity={0.7}>
          <Text style={styles.moreButtonText}>⋮</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.purple} />
        </View>
      ) : !userData ? (
        <View style={styles.missingWrap}>
          <Text style={styles.missingText}>This user could not be found.</Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* ── Hero ──────────────────────────────────────────────────── */}
            <View style={styles.heroSection}>
              {userData.photoURL ? (
                <Image source={{ uri: userData.photoURL }} style={styles.avatarImage} resizeMode="cover" />
              ) : (
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitials}>{getInitials(userData.name)}</Text>
                </View>
              )}

              <Text style={styles.nameText}>{userData.name || 'User'}</Text>

              <View style={styles.locationRow}>
                <PinIcon color={theme.textMuted} />
                <Text style={styles.locationText}>
                  {[userData.city, userData.country].filter(Boolean).join(', ') || 'Location not set'}
                </Text>
              </View>

              {!!userData.bio && (
                <Text style={styles.bioText} numberOfLines={3}>
                  {userData.bio}
                </Text>
              )}

              {userData.reviewCount > 0 ? (
                <View style={styles.ratingRow}>
                  <Text style={styles.stars}>
                    {'★'.repeat(Math.floor(userData.rating || 0))}
                    {'☆'.repeat(5 - Math.floor(userData.rating || 0))}
                  </Text>
                  <Text style={styles.ratingText}>{(userData.rating || 0).toFixed(1)}</Text>
                  <Text style={styles.reviewCount}>({userData.reviewCount} reviews)</Text>
                </View>
              ) : (
                <Text style={styles.noRatingText}>No reviews yet</Text>
              )}

              {!!userData.createdAt && (
                <Text style={styles.memberSinceText}>{formatMemberSince(userData.createdAt)}</Text>
              )}
            </View>

            <View style={styles.heroDivider} />

            {/* ── Stats row ─────────────────────────────────────────────── */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{listings.length}</Text>
                <Text style={styles.statLabel}>Active Listings</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{swapsCount}</Text>
                <Text style={styles.statLabel}>Swaps Done</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{reviews.length}</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
            </View>

            {/* ── Skills ────────────────────────────────────────────────── */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Skills</Text>

              <Text style={styles.skillsSubLabel}>OFFERING</Text>
              {userData.skills?.length > 0 ? (
                <View style={styles.chipsRow}>
                  {userData.skills.map((skill, i) => (
                    <View key={i} style={styles.offerChip}>
                      <Text style={styles.offerChipText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptySkillText}>Nothing listed yet</Text>
              )}

              <View style={styles.skillsDivider} />

              <Text style={styles.skillsSubLabel}>WANTING</Text>
              {userData.wants?.length > 0 ? (
                <View style={styles.chipsRow}>
                  {userData.wants.map((skill, i) => (
                    <View key={i} style={styles.wantChip}>
                      <Text style={styles.wantChipText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptySkillText}>Nothing listed yet</Text>
              )}
            </View>

            {/* ── Active listings ───────────────────────────────────────── */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Skills Offered</Text>

              {listings.length > 0 ? (
                listings.map((item, i) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.listingRow, i < listings.length - 1 && styles.listingRowBorder]}
                    onPress={() => navigation.navigate('ListingDetail', { listing: item })}
                    activeOpacity={0.7}
                  >
                    <View style={styles.listingLeftCol}>
                      <Text style={styles.listingOfferSkill} numberOfLines={1}>
                        {item.offerSkill}
                      </Text>
                      <Text style={styles.listingWantSkill} numberOfLines={1}>
                        ↔ {item.wantSkill}
                      </Text>
                    </View>
                    <ChevronRightIcon color={theme.textMuted} />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyListingState}>
                  <Text style={styles.emptyStateTitle}>No active listings</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    {userData.name?.split(' ')[0] || 'This user'} hasn't posted any skills yet
                  </Text>
                </View>
              )}
            </View>

            {/* ── Reviews ───────────────────────────────────────────────── */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Reviews</Text>

              {reviews.length > 0 ? (
                reviews.map((review, i) => {
                  const filledStars = Math.floor(review.rating || 0);
                  return (
                    <View
                      key={review.id}
                      style={[styles.reviewRow, i < reviews.length - 1 && styles.listingRowBorder]}
                    >
                      <View style={styles.reviewAvatar}>
                        <Text style={styles.reviewAvatarText}>
                          {review.fromUserName?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                      </View>

                      <View style={styles.reviewBody}>
                        <View style={styles.reviewTopRow}>
                          <Text style={styles.reviewerName} numberOfLines={1}>
                            {review.fromUserName || 'User'}
                          </Text>
                          <Text style={styles.reviewStars}>
                            {'★'.repeat(filledStars)}
                            {'☆'.repeat(5 - filledStars)}
                          </Text>
                        </View>

                        {!!review.comment && (
                          <Text style={styles.reviewComment} numberOfLines={2}>
                            {review.comment}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={styles.emptyListingState}>
                  <Text style={styles.emptyStateTitle}>No reviews yet</Text>
                  <Text style={styles.emptyStateSubtitle}>Reviews appear after completing swaps</Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* ── Bottom CTA bar ────────────────────────────────────────────── */}
          <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
            {isOwnProfile ? (
              <View style={styles.ownProfileBar}>
                <Text style={styles.ownProfileText}>You're viewing your own profile</Text>
                <TouchableOpacity
                  style={styles.editProfileBtn}
                  onPress={() => navigation.navigate('EditProfile')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.editProfileBtnText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.ctaRow}>
                <TouchableOpacity style={styles.messageButton} onPress={handleMessage} activeOpacity={0.8}>
                  <ChatIcon color={theme.purple} />
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.requestSwapButton} onPress={handleRequestSwap} activeOpacity={0.8}>
                  <Text style={styles.requestSwapButtonText}>Request Swap</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default UserProfileScreen;
