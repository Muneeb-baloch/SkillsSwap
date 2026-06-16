import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './HomeScreen.styles';

const CATEGORIES = [
  'All', 'Teaching', 'Cooking', 'Tech', 'Art',
  'Music', 'Fitness', 'Languages', 'Business', 'Crafts',
];

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

// ── Local components ─────────────────────────────────────────────────────────

const SkeletonCard = ({ styles }) => (
  <View style={styles.skeletonCard}>
    <View style={styles.skeletonRow}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonTextBlock}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
      </View>
    </View>
    <View style={styles.skeletonDivider} />
    <View style={[styles.skeletonLine, styles.skeletonLineMed]} />
    <View style={styles.skeletonLine} />
    <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
  </View>
);

const ListingCard = ({ item, navigation, styles, theme }) => {
  // Listings posted before the registration displayName fix have the literal
  // string 'Anonymous' saved, so a falsy check alone won't catch those.
  const displayName = item.userName && item.userName !== 'Anonymous' ? item.userName : 'User';
  const initials = getInitials(displayName);
  const ago = timeAgo(item.createdAt);
  const [imageLoading, setImageLoading] = useState(false);

  const goToProfile = () =>
    navigation.navigate('UserProfile', { userId: item.userId });

  const goToDetail = () =>
    navigation.navigate('ListingDetail', { listing: item });

  return (
    <View style={styles.card}>
      {/* Top row: avatar + name/city + distance */}
      <View style={styles.cardTopRow}>
        <TouchableOpacity style={styles.avatarWrapper} onPress={goToProfile} activeOpacity={0.7}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.userInfo} onPress={goToProfile} activeOpacity={0.7}>
          <Text style={styles.userName} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.userCity} numberOfLines={1}>
            {item.city || ''}
          </Text>
        </TouchableOpacity>

        <Text style={styles.distance}>~2 km</Text>
      </View>

      <View style={styles.divider} />

      {/* Listing photo */}
      {item.photoURL ? (
        <View style={styles.listingImageWrap}>
          <Image
            source={{ uri: item.photoURL }}
            style={styles.listingImage}
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
          {imageLoading && (
            <View style={styles.imageLoader}>
              <ActivityIndicator color={theme.purple} />
            </View>
          )}
        </View>
      ) : null}

      {/* Offer */}
      <View style={styles.skillRow}>
        <Text style={styles.skillLabel}>Offering</Text>
        <Text style={styles.offerSkill} numberOfLines={1}>
          {item.offerSkill}
        </Text>
      </View>

      {/* Want */}
      <View style={styles.skillRow}>
        <Text style={styles.skillLabel}>Wants</Text>
        <Text style={styles.wantSkill} numberOfLines={1}>
          {item.wantSkill}
        </Text>
      </View>

      {/* Bottom row: time + CTA */}
      <View style={styles.cardBottomRow}>
        <Text style={styles.timeAgoText}>{ago}</Text>
        <TouchableOpacity onPress={goToDetail} activeOpacity={0.7}>
          <Text style={styles.requestSwapText}>Request swap →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ── Main screen ───────────────────────────────────────────────────────────────

const HomeScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState(null);

  // 400 ms debounce for search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText), 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, 'listings'),
        where('active', '==', true),
        orderBy('createdAt', 'desc'),
        limit(10),
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setListings(docs);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] ?? null);
      setHasMore(snapshot.docs.length === 10);
    } catch {
      // Likely the `active` + `createdAt` composite index hasn't finished
      // building yet. Fall back to a query that needs no index, sort
      // client-side, and surface a soft (non-blocking) warning instead.
      console.warn(`
  ⚠️  FIRESTORE INDEX NEEDED
  Go to Firebase Console → Firestore → Indexes → Composite
  Add index:
    Collection: listings
    Fields: active (Ascending), createdAt (Descending)
  Takes 2-5 min to build. Error will auto-resolve after.
`);
      try {
        const fallbackQ = query(
          collection(db, 'listings'),
          where('active', '==', true),
          limit(20),
        );
        const snapshot = await getDocs(fallbackQ);
        const fetched = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            const aT = a.createdAt?.toDate?.() || new Date(0);
            const bT = b.createdAt?.toDate?.() || new Date(0);
            return bT - aT;
          });
        setListings(fetched);
        setLastDoc(null);
        setHasMore(false);
        setError('Index building...');
      } catch {
        setError('Failed to load listings. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || !lastDoc) return;
    setLoadingMore(true);
    try {
      const q = query(
        collection(db, 'listings'),
        where('active', '==', true),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(10),
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setListings(prev => [...prev, ...docs]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] ?? null);
      setHasMore(snapshot.docs.length === 10);
    } catch {
      // silently ignore load-more errors; user can scroll again
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, lastDoc]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Client-side filter
  const filteredListings = listings.filter(item => {
    const needle = debouncedSearch.toLowerCase();
    const matchesSearch =
      !needle ||
      item.offerSkill?.toLowerCase().includes(needle) ||
      item.wantSkill?.toLowerCase().includes(needle);
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderCard = ({ item }) => (
    <ListingCard item={item} navigation={navigation} styles={styles} theme={theme} />
  );

  const ListFooter = () =>
    loadingMore ? (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={theme.purple} />
      </View>
    ) : null;

  // Shown inside the FlatList when listings exist but none match the
  // current search/category filter (distinct from the "no listings at
  // all" empty state below, which has its own call-to-action).
  const ListEmpty = () => (
    <View style={styles.centerState}>
      <Text style={styles.noMatchText}>No skills found</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Browse Skills</Text>
          <Text style={styles.headerSubtitle}>What do you want to learn today?</Text>
        </View>
        <TouchableOpacity style={styles.searchIconButton} activeOpacity={0.7}>
          <Text style={styles.searchIconButtonText}>⌕</Text>
        </TouchableOpacity>
      </View>

      {/* ── Search Bar ─────────────────────────────────────────────────────── */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchPrefixIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search skills e.g. English, Cooking..."
          placeholderTextColor={theme.textMuted}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {/* ── Category Chips ─────────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, selectedCategory === cat && styles.chipActive]}
            onPress={() => setSelectedCategory(cat)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Feed states — mutually exclusive: loading, hard error, empty, or list ── */}
      {loading ? (
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={item => String(item)}
          renderItem={() => <SkeletonCard styles={styles} />}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      ) : error && !error.includes('Index building') ? (
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchListings} activeOpacity={0.8}>
            <Text style={styles.retryBtnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : listings.length === 0 ? (
        <View style={styles.centerState}>
          <Text style={styles.emptyTitle}>No skills posted yet</Text>
          <Text style={styles.emptySubtitle}>Be the first to post a skill!</Text>
          <TouchableOpacity
            style={styles.postBtn}
            onPress={() => navigation.navigate('PostListing')}
            activeOpacity={0.8}
          >
            <Text style={styles.postBtnText}>Post a skill</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredListings}
          keyExtractor={item => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={ListEmpty}
          ListFooterComponent={ListFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ── FAB ────────────────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PostListing')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
