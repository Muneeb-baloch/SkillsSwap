import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './MyListingsScreen.styles';

function formatDate(timestamp) {
  if (!timestamp) return '—';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// ── Management card ─────────────────────────────────────────────────────────

const ListingManageCard = ({ item, navigation, onToggleActive, onDelete, styles, theme }) => {
  const isActive = item.active;

  const handleMenuPress = () => {
    Alert.alert(
      'Listing options',
      item.offerSkill,
      [
        {
          text: isActive ? 'Pause listing' : 'Reactivate',
          onPress: () => onToggleActive(item),
        },
        {
          text: 'Edit listing',
          onPress: () => navigation.navigate('PostListing', { editMode: true, listing: item }),
        },
        {
          text: 'Delete listing',
          style: 'destructive',
          onPress: () => onDelete(item),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={[styles.statusBadge, isActive ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
          <View style={[styles.statusDot, isActive ? styles.statusDotActive : styles.statusDotInactive]} />
          <Text style={[styles.statusBadgeText, isActive ? styles.statusTextActive : styles.statusTextInactive]}>
            {isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress} activeOpacity={0.7}>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.offerSkill} numberOfLines={1}>{item.offerSkill}</Text>
      <View style={styles.wantRow}>
        <Ionicons name="swap-horizontal-outline" size={14} color={theme.textMuted} />
        <Text style={styles.wantSkill} numberOfLines={1}>{item.wantSkill}</Text>
      </View>

      {item.photoURL ? (
        <Image source={{ uri: item.photoURL }} style={styles.cardImage} resizeMode="cover" />
      ) : null}

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.statTopRow}>
            <Ionicons name="eye-outline" size={13} color={theme.textMuted} />
            <Text style={styles.statValue}>{item.views || 0}</Text>
          </View>
          <Text style={styles.statLabel}>views</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.statTopRow}>
            <Ionicons name="mail-outline" size={13} color={theme.textMuted} />
            <Text style={styles.statValue}>{item.requests || 0}</Text>
          </View>
          <Text style={styles.statLabel}>requests</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.statTopRow}>
            <Ionicons name="calendar-outline" size={13} color={theme.textMuted} />
            <Text style={styles.statValue}>{formatDate(item.createdAt)}</Text>
          </View>
          <Text style={styles.statLabel}>posted</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.toggleButton, isActive ? styles.pauseButton : styles.reactivateButton]}
          onPress={() => onToggleActive(item)}
          activeOpacity={0.7}
        >
          <Text style={isActive ? styles.pauseButtonText : styles.reactivateButtonText}>
            {isActive ? 'Pause listing' : 'Reactivate'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item)} activeOpacity={0.7}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ── Main screen ───────────────────────────────────────────────────────────────

const MyListingsScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }

    let fallbackUnsubscribe = null;

    const q = query(
      collection(db, 'listings'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        setListings(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => {
        // Likely the `userId` + `createdAt` composite index hasn't finished
        // building yet. Fall back to a query that needs no index, sort
        // client-side, same pattern as HomeScreen's feed query.
        console.warn(`
  ⚠️  FIRESTORE INDEX NEEDED
  Go to Firebase Console → Firestore → Indexes → Composite
  Add index:
    Collection: listings
    Fields: userId (Ascending), createdAt (Descending)
  Takes 2-5 min to build. Error will auto-resolve after.
`);
        const fallbackQ = query(collection(db, 'listings'), where('userId', '==', uid));
        fallbackUnsubscribe = onSnapshot(fallbackQ, snapshot => {
          const docs = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => {
              const aT = a.createdAt?.toDate?.() || new Date(0);
              const bT = b.createdAt?.toDate?.() || new Date(0);
              return bT - aT;
            });
          setListings(docs);
          setLoading(false);
        });
      },
    );

    return () => {
      unsubscribe();
      if (fallbackUnsubscribe) fallbackUnsubscribe();
    };
  }, []);

  const handleToggleActive = async item => {
    try {
      await updateDoc(doc(db, 'listings', item.id), {
        active: !item.active,
        updatedAt: serverTimestamp(),
      });
    } catch {
      Alert.alert('Error', 'Failed to update listing');
    }
  };

  const handleDelete = item => {
    Alert.alert(
      'Delete listing',
      'Are you sure? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'listings', item.id));
            } catch {
              Alert.alert('Error', 'Failed to delete listing');
            }
          },
        },
      ],
    );
  };

  const activeCount = listings.filter(l => l.active).length;
  const inactiveCount = listings.length - activeCount;
  const filteredListings = listings.filter(l =>
    activeTab === 'active' ? l.active === true : l.active === false,
  );
  const count = activeTab === 'active' ? activeCount : inactiveCount;

  const renderCard = ({ item }) => (
    <ListingManageCard
      item={item}
      navigation={navigation}
      onToggleActive={handleToggleActive}
      onDelete={handleDelete}
      styles={styles}
      theme={theme}
    />
  );

  const ListEmpty = () => (
    <View style={styles.centerState}>
      {activeTab === 'active' ? (
        <>
          <Text style={styles.emptyTitle}>No active listings</Text>
          <Text style={styles.emptySubtitle}>Tap + to post your first skill</Text>
          <TouchableOpacity
            style={styles.postBtn}
            onPress={() => navigation.navigate('PostListing')}
            activeOpacity={0.8}
          >
            <Text style={styles.postBtnText}>Post a skill</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.emptyTitle}>No paused listings</Text>
          <Text style={styles.emptySubtitle}>All your listings are currently active</Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Listings</Text>
        <TouchableOpacity
          style={styles.postButton}
          onPress={() => navigation.navigate('PostListing')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── Tab switcher ───────────────────────────────────────────────────── */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'active' && styles.tabButtonActive]}
          onPress={() => setActiveTab('active')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabButtonText, activeTab === 'active' && styles.tabButtonTextActive]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'inactive' && styles.tabButtonActive]}
          onPress={() => setActiveTab('inactive')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabButtonText, activeTab === 'inactive' && styles.tabButtonTextActive]}>
            Inactive
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.countText}>
        {count} {activeTab} listing{count === 1 ? '' : 's'}
      </Text>

      {/* ── List ───────────────────────────────────────────────────────────── */}
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={theme.purple} />
        </View>
      ) : (
        <FlatList
          data={filteredListings}
          keyExtractor={item => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={ListEmpty}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default MyListingsScreen;
