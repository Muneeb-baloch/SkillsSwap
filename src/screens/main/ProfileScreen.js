import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  updateDoc,
} from 'firebase/firestore';
import { signOut, updateProfile } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } from '../../config/cloudinary';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './ProfileScreen.styles';

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

function timeAgo(timestamp) {
  if (!timestamp) return '';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function formatMemberSince(createdAt) {
  if (!createdAt) return '';
  const d = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  return `Member since ${d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const GearIcon = ({ color, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
      stroke={color}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BellIcon = ({ color, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CameraIcon = ({ color, size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 17a4 4 0 100-8 4 4 0 000 8z" stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PinIcon = ({ color, size = 13 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SunIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 17a5 5 0 100-10 5 5 0 000 10z" stroke="#F5C518" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke="#F5C518"
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MoonIcon = ({ color, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ListIcon = ({ color, size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ClockIcon = ({ color, size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BookmarkIcon = ({ color, size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HelpCircleIcon = ({ color, size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SignOutIcon = ({ color, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── Small components ────────────────────────────────────────────────────────

const StarRating = ({ rating, starsStyle, filledStyle, emptyStyle }) => {
  const filled = Math.floor(rating || 0);
  return (
    <Text style={starsStyle}>
      {Array.from({ length: 5 }, (_, i) => (
        <Text key={i} style={i < filled ? filledStyle : emptyStyle}>
          {i < filled ? '★' : '☆'}
        </Text>
      ))}
    </Text>
  );
};

const PulsingSkeleton = ({ style }) => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.8, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return <Animated.View style={[style, { opacity: pulseAnim }]} />;
};

// ── Main screen ───────────────────────────────────────────────────────────────

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = getStyles(theme);

  const [userData, setUserData] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [swapsCount, setSwapsCount] = useState(0);
  const [activeListingsCount, setActiveListingsCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const toggleAnim = useRef(new Animated.Value(isDark ? 0 : 1)).current;

  useEffect(() => {
    Animated.spring(toggleAnim, {
      toValue: isDark ? 0 : 1,
      useNativeDriver: false,
      tension: 80,
      friction: 10,
    }).start();
  }, [isDark, toggleAnim]);

  const trackColor = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#242442', '#534AB7'],
  });
  const thumbPosition = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  // Each query fetched independently — a missing composite index on one
  // (myListings / myReviews need one; the others only use equality filters,
  // which Firestore can serve without one) shouldn't blank the whole screen.
  const fetchProfileData = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const [
      userResult,
      listingsResult,
      reviewsResult,
      swapsAsRequesterResult,
      swapsAsOwnerResult,
      activeListingsResult,
    ] = await Promise.allSettled([
      getDoc(doc(db, 'users', currentUser.uid)),
      getDocs(
        query(
          collection(db, 'listings'),
          where('userId', '==', currentUser.uid),
          where('active', '==', true),
          orderBy('createdAt', 'desc'),
          limit(2),
        ),
      ),
      // No orderBy here on purpose — combining it with the toUserId filter
      // would need a composite index. Sort client-side instead.
      getDocs(query(collection(db, 'reviews'), where('toUserId', '==', currentUser.uid))),
      // A completed swap may have either ended this user's request or one
      // sent to them, so both directions need to be counted.
      getDocs(
        query(
          collection(db, 'barterRequests'),
          where('fromUserId', '==', currentUser.uid),
          where('status', '==', 'completed'),
        ),
      ),
      getDocs(
        query(
          collection(db, 'barterRequests'),
          where('toUserId', '==', currentUser.uid),
          where('status', '==', 'completed'),
        ),
      ),
      getDocs(
        query(
          collection(db, 'listings'),
          where('userId', '==', currentUser.uid),
          where('active', '==', true),
        ),
      ),
    ]);

    if (userResult.status === 'fulfilled') {
      setUserData(userResult.value.exists() ? userResult.value.data() : null);
    } else {
      console.error('Profile fetch error (user doc):', userResult.reason);
    }

    if (listingsResult.status === 'fulfilled') {
      setMyListings(listingsResult.value.docs.map(d => ({ id: d.id, ...d.data() })));
    } else {
      console.warn(`
  ⚠️  FIRESTORE INDEX NEEDED
  Go to Firebase Console → Firestore → Indexes → Composite
  Add index:
    Collection: listings
    Fields: userId (Ascending), active (Ascending), createdAt (Descending)
`);
      setMyListings([]);
    }

    if (reviewsResult.status === 'fulfilled') {
      const allReviews = reviewsResult.value.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setMyReviews(allReviews.slice(0, 2));
      setReviewsCount(allReviews.length);
    } else {
      console.warn('Profile fetch error (reviews):', reviewsResult.reason);
      setMyReviews([]);
      setReviewsCount(0);
    }

    const swapsAsRequester =
      swapsAsRequesterResult.status === 'fulfilled' ? swapsAsRequesterResult.value.size : 0;
    const swapsAsOwner =
      swapsAsOwnerResult.status === 'fulfilled' ? swapsAsOwnerResult.value.size : 0;
    setSwapsCount(swapsAsRequester + swapsAsOwner);
    setActiveListingsCount(
      activeListingsResult.status === 'fulfilled' ? activeListingsResult.value.size : 0,
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfileData();
    const unsubscribe = navigation.addListener('focus', fetchProfileData);
    return unsubscribe;
  }, [navigation, fetchProfileData]);

  const handleChangePhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Photo library access is required to change your photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled) return;

      setUploadingPhoto(true);
      const uri = result.assets[0].uri;

      const formData = new FormData();
      // Expo SDK 56's fetch only accepts a real Blob/File, not RN's old
      // {uri, type, name} shorthand (throws "Unsupported FormDataPart implementation").
      formData.append('file', new File(uri));
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'skillsswap/profiles');

      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();

      if (!data.secure_url) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      await updateProfile(auth.currentUser, { photoURL: data.secure_url });
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { photoURL: data.secure_url });

      setUserData(prev => ({ ...(prev || {}), photoURL: data.secure_url }));
    } catch (err) {
      console.error('Photo upload error:', err);
      Alert.alert('Error', 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
            // This app has no auth-state listener driving navigation (unlike a
            // typical RootNavigator setup) — Login/Register/Main are plain
            // sibling routes reached only by explicit navigate/replace calls
            // elsewhere, so we have to send the user back to Login ourselves.
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          } catch {
            Alert.alert('Error', 'Failed to sign out');
          }
        },
      },
    ]);
  };

  const displayName = userData?.name || auth.currentUser?.displayName || 'Your Name';
  const city = userData?.city || '';
  const country = userData?.country || '';
  const hasSkills = (userData?.skills?.length || 0) > 0 || (userData?.wants?.length || 0) > 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <PulsingSkeleton style={styles.skeletonAvatar} />
        <PulsingSkeleton style={styles.skeletonNameBar} />
        <PulsingSkeleton style={styles.skeletonCityBar} />
        <View style={styles.skeletonStatsRow}>
          <PulsingSkeleton style={styles.skeletonStatCard} />
          <PulsingSkeleton style={styles.skeletonStatCard} />
          <PulsingSkeleton style={styles.skeletonStatCard} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Section 1: Header ────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Settings')}
              activeOpacity={0.7}
            >
              <GearIcon color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => Alert.alert('Coming soon')}
              activeOpacity={0.7}
            >
              <BellIcon color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Section 2: Profile hero ──────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <View style={styles.avatarContainer}>
            {userData?.photoURL ? (
              <Image source={{ uri: userData.photoURL }} style={styles.avatarImage} resizeMode="cover" />
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>{getInitials(displayName)}</Text>
              </View>
            )}

            {uploadingPhoto && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator color={theme.purple} />
              </View>
            )}

            <TouchableOpacity style={styles.editOverlay} onPress={handleChangePhoto} activeOpacity={0.8}>
              <CameraIcon color={theme.purple} />
            </TouchableOpacity>
          </View>

          <Text style={styles.nameText}>{displayName}</Text>

          {!!city && (
            <View style={styles.cityRow}>
              <PinIcon color={theme.textMuted} />
              <Text style={styles.cityText}>{country ? `${city}, ${country}` : city}</Text>
            </View>
          )}

          {!!userData?.createdAt && (
            <Text style={styles.memberSinceText}>{formatMemberSince(userData.createdAt)}</Text>
          )}

          <View style={styles.ratingRow}>
            <StarRating
              rating={userData?.rating}
              starsStyle={styles.starsText}
              filledStyle={styles.starFilled}
              emptyStyle={styles.starEmpty}
            />
            <Text style={styles.reviewCountText}>
              ({reviewsCount} review{reviewsCount === 1 ? '' : 's'})
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.7}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── Section 3: Stats row ─────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{activeListingsCount}</Text>
            <Text style={styles.statLabel}>Active Listings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{swapsCount}</Text>
            <Text style={styles.statLabel}>Swaps Done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{reviewsCount}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* ── Section 4: Skills ────────────────────────────────────────────── */}
        <View style={styles.skillsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>My Skills</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} activeOpacity={0.7}>
              <Text style={styles.sectionLink}>Edit →</Text>
            </TouchableOpacity>
          </View>

          {hasSkills ? (
            <>
              <View style={styles.skillsGroupOffer}>
                <Text style={styles.skillsLabel}>OFFERING</Text>
                <View style={styles.chipRow}>
                  {(userData?.skills || []).map((skill, i) => (
                    <View key={i} style={styles.chipOffer}>
                      <Text style={styles.chipOfferText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.skillsGroupWant}>
                <Text style={styles.skillsLabel}>WANTING</Text>
                <View style={styles.chipRow}>
                  {(userData?.wants || []).map((skill, i) => (
                    <View key={i} style={styles.chipWant}>
                      <Text style={styles.chipWantText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} activeOpacity={0.7}>
              <Text style={styles.noSkillsText}>Add skills to your profile →</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Section 5: Appearance ────────────────────────────────────────── */}
        <View style={styles.appearanceCard}>
          <View style={styles.appearanceHeader}>
            <Text style={styles.sectionTitleSm}>Appearance</Text>
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.themeIconLabelRow}>
              {isDark ? <MoonIcon color={theme.purpleLight} /> : <SunIcon />}
              <View style={styles.themeLabelCol}>
                <Text style={styles.themeLabelTitle}>Theme</Text>
                <Text style={styles.themeLabelSub}>{isDark ? 'Dark mode' : 'Light mode'}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={toggleTheme} activeOpacity={0.8}>
              <Animated.View style={[styles.toggleTrackBase, { backgroundColor: trackColor }]}>
                <Animated.View style={[styles.toggleThumb, { transform: [{ translateX: thumbPosition }] }]} />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Section 6: My Listings preview ───────────────────────────────── */}
        <View style={styles.listingsCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitleSm}>My Listings</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MyListings')} activeOpacity={0.7}>
              <Text style={styles.sectionLink}>See all →</Text>
            </TouchableOpacity>
          </View>

          {myListings.length === 0 ? (
            <View style={styles.emptyCardWrap}>
              <Text style={styles.emptyCardText}>No listings yet</Text>
              <TouchableOpacity onPress={() => navigation.navigate('PostListing')} activeOpacity={0.7}>
                <Text style={styles.emptyCardLink}>Post a Skill →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            myListings.map(listing => (
              <View key={listing.id} style={styles.miniListingRow}>
                <View style={styles.miniListingLeft}>
                  <Text style={styles.miniListingOffer} numberOfLines={1}>
                    {listing.offerSkill}
                  </Text>
                  <Text style={styles.miniListingWant} numberOfLines={1}>
                    ↔ {listing.wantSkill}
                  </Text>
                </View>
                <View style={styles.miniBadgeRow}>
                  <View style={[styles.miniDot, listing.active ? styles.miniDotActive : styles.miniDotInactive]} />
                  <Text style={listing.active ? styles.miniBadgeTextActive : styles.miniBadgeTextInactive}>
                    {listing.active ? 'Active' : 'Paused'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* ── Section 7: Recent reviews ────────────────────────────────────── */}
        <View style={styles.reviewsCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitleSm}>Reviews</Text>
            <TouchableOpacity onPress={() => Alert.alert('Coming soon')} activeOpacity={0.7}>
              <Text style={styles.sectionLink}>See all →</Text>
            </TouchableOpacity>
          </View>

          {myReviews.length === 0 ? (
            <Text style={styles.emptyReviewsText}>No reviews yet</Text>
          ) : (
            myReviews.map(review => (
              <View key={review.id} style={styles.reviewRow}>
                <View style={styles.reviewTopRow}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{getInitials(review.fromUserName)}</Text>
                  </View>
                  <View style={styles.reviewNameStarsCol}>
                    <Text style={styles.reviewName} numberOfLines={1}>
                      {review.fromUserName || 'User'}
                    </Text>
                    <StarRating
                      rating={review.rating}
                      starsStyle={{ fontSize: 11 }}
                      filledStyle={styles.reviewStars}
                      emptyStyle={[styles.reviewStars, { color: theme.textMuted }]}
                    />
                  </View>
                  <Text style={styles.reviewTime}>{timeAgo(review.createdAt)}</Text>
                </View>
                {review.status === 'pending_confirmation' && (
                  <Text style={styles.pendingReviewText}>
                    Pending — visible publicly once the swap is confirmed
                  </Text>
                )}
                {!!review.comment && (
                  <Text style={styles.reviewComment} numberOfLines={2} ellipsizeMode="tail">
                    {review.comment}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>

        {/* ── Section 8: Quick actions ─────────────────────────────────────── */}
        <View style={styles.quickActionsCard}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('MyListings')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(83,74,183,0.15)' }]}>
              <ListIcon color={theme.purple} />
            </View>
            <Text style={styles.actionLabel}>My Listings</Text>
            <View style={styles.actionRight}>
              <View style={styles.actionCountBadge}>
                <Text style={styles.actionCountText}>{activeListingsCount}</Text>
              </View>
              <Text style={styles.actionChevron}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('BarterHistory')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(29,158,117,0.15)' }]}>
              <ClockIcon color={theme.teal} />
            </View>
            <Text style={styles.actionLabel}>Barter History</Text>
            <View style={styles.actionRight}>
              <View style={styles.actionCountBadge}>
                <Text style={styles.actionCountText}>{swapsCount}</Text>
              </View>
              <Text style={styles.actionChevron}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => Alert.alert('Coming soon')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(245,197,24,0.15)' }]}>
              <BookmarkIcon color="#F5C518" />
            </View>
            <Text style={styles.actionLabel}>Saved Skills</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRow, styles.actionRowLast]}
            onPress={() => Alert.alert('Help & Support', 'For support contact: support@skillsswap.app')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(136,135,128,0.15)' }]}>
              <HelpCircleIcon color={theme.textMuted} />
            </View>
            <Text style={styles.actionLabel}>Help & Support</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ── Section 9: Sign out ──────────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.signOutButton, { marginBottom: 32 + insets.bottom }]}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <SignOutIcon color={theme.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>SkillsSwap v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
