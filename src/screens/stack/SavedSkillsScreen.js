import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './SavedSkillsScreen.styles';

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

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
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

const BookmarkIcon = ({ theme, size = 20, filled = true }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"
      fill={filled ? theme.purple : 'none'}
      stroke={filled ? theme.purple : theme.textMuted}
      strokeWidth={filled ? 2 : 1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Same card design as HomeScreen's ListingCard, but the bookmark is always
// filled (everything on this screen is saved) and tapping it unsaves.
const SavedCard = ({ item, navigation, styles, theme, onUnsave }) => {
  const hasName = item.userName && item.userName !== 'Anonymous';
  const [resolvedName, setResolvedName] = useState(hasName ? item.userName : '');

  useEffect(() => {
    if (hasName || !item.userId) return;
    let active = true;
    getDoc(doc(db, 'users', item.userId))
      .then(snap => {
        if (active && snap.exists() && snap.data().name) setResolvedName(snap.data().name);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [hasName, item.userId]);

  const displayName = resolvedName || 'User';

  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={() => navigation.navigate('UserProfile', { userId: item.userId })}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>{displayName}</Text>
          <Text style={styles.userCity} numberOfLines={1}>{item.city || ''}</Text>
        </View>

        <TouchableOpacity
          style={styles.unsaveBtn}
          onPress={() => onUnsave(item.id)}
          activeOpacity={0.7}
        >
          <BookmarkIcon theme={theme} />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.skillRow}>
        <Text style={styles.skillLabel}>Offering</Text>
        <Text style={styles.offerSkill} numberOfLines={1}>{capitalize(item.offerSkill)}</Text>
      </View>

      <View style={styles.skillRow}>
        <Text style={styles.skillLabel}>Wants</Text>
        <Text style={styles.wantSkill} numberOfLines={1}>{capitalize(item.wantSkill)}</Text>
      </View>

      <View style={styles.cardBottomRow}>
        <Text style={styles.timeAgoText}>{timeAgo(item.createdAt)}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('ListingDetail', { listing: item })}
          activeOpacity={0.7}
        >
          <Text style={styles.requestSwapText}>Request swap →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SavedSkillsScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);
  const insets = useSafeAreaInsets();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSavedListings = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const userSnap = await getDoc(doc(db, 'users', currentUser.uid));
      const savedIds = userSnap.exists() ? userSnap.data().savedListings || [] : [];
      if (savedIds.length === 0) {
        setListings([]);
        return;
      }

      const listingDocs = await Promise.all(
        savedIds.map(id => getDoc(doc(db, 'listings', id))),
      );

      setListings(
        listingDocs
          .filter(d => d.exists() && d.data().active === true)
          .map(d => ({ id: d.id, ...d.data() })),
      );

      // Listings deleted since they were saved leave dangling ids behind —
      // silently prune them so they don't get re-fetched forever.
      const staleIds = savedIds.filter(
        id => !listingDocs.find(d => d.id === id && d.exists()),
      );
      if (staleIds.length > 0) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          savedListings: arrayRemove(...staleIds),
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Fetch saved error:', err);
      setError('Failed to load saved skills.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedListings();
  }, [fetchSavedListings]);

  const handleUnsave = async listingId => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    // Remove from the UI immediately; re-fetch to restore truth on failure.
    setListings(prev => prev.filter(l => l.id !== listingId));
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        savedListings: arrayRemove(listingId),
      });
    } catch (err) {
      console.error('Unsave error:', err);
      fetchSavedListings();
    }
  };

  const handleClearAll = () => {
    Alert.alert('Clear all saved skills?', 'This will remove all your saved listings.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear all',
        style: 'destructive',
        onPress: async () => {
          const currentUser = auth.currentUser;
          if (!currentUser) return;
          try {
            await updateDoc(doc(db, 'users', currentUser.uid), { savedListings: [] });
            setListings([]);
          } catch {
            Alert.alert('Error', 'Failed to clear. Try again.');
          }
        },
      },
    ]);
  };

  const renderEmpty = () => (
    <View style={styles.emptyWrap}>
      <BookmarkIcon theme={theme} size={64} filled={false} />
      <Text style={styles.emptyTitle}>No saved skills yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the bookmark icon on any listing to save it here for later
      </Text>
      <TouchableOpacity
        style={styles.browseBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={styles.browseBtnText}>Browse Skills</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <BackIcon theme={theme} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Skills</Text>
        {listings.length > 0 ? (
          <TouchableOpacity style={styles.clearAllButton} onPress={handleClearAll} activeOpacity={0.7}>
            <Text style={styles.clearAllText}>Clear all</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.purple} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchSavedListings} activeOpacity={0.8}>
            <Text style={styles.retryBtnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SavedCard
              item={item}
              navigation={navigation}
              styles={styles}
              theme={theme}
              onUnsave={handleUnsave}
            />
          )}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default SavedSkillsScreen;
