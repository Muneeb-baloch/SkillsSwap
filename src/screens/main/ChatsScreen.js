import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
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
  onSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './ChatsScreen.styles';

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

function timeAgo(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString();
}

const ChatsScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);

  const [chats, setChats] = useState([]);
  const [profiles, setProfiles] = useState({}); // uid -> { name, photoURL }
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(new Set());

  const currentUser = auth.currentUser;

  // Fetch (and cache) the other participant's profile for display, once per uid.
  const ensureProfile = useCallback(async uid => {
    if (!uid || fetchedRef.current.has(uid)) return;
    fetchedRef.current.add(uid);
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const d = snap.data();
        setProfiles(prev => ({ ...prev, [uid]: { name: d.name, photoURL: d.photoURL } }));
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
    );
    const unsub = onSnapshot(
      q,
      snap => {
        const data = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            const aT = a.lastMessageAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
            const bT = b.lastMessageAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
            return bT - aT;
          });
        setChats(data);
        // Make sure we have a profile cached for each conversation partner.
        data.forEach(c => {
          const otherId = (c.participants || []).find(p => p !== currentUser.uid);
          if (otherId) ensureProfile(otherId);
        });
        setLoading(false);
      },
      err => {
        console.error('Chats listener error:', err);
        setLoading(false);
      },
    );
    return unsub;
  }, [currentUser, ensureProfile]);

  const renderItem = ({ item }) => {
    const otherId = (item.participants || []).find(p => p !== currentUser?.uid);
    const profile = profiles[otherId] || {};
    const name = profile.name && profile.name !== 'Anonymous' ? profile.name : 'User';
    const unread = !!item.lastMessageSenderId && item.lastMessageSenderId !== currentUser?.uid;

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('ChatRoom', { chatId: item.id })}
        activeOpacity={0.7}
      >
        {profile.photoURL ? (
          <Image source={{ uri: profile.photoURL }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(name)}</Text>
          </View>
        )}

        <View style={styles.rowBody}>
          <View style={styles.rowTop}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            <Text style={styles.time}>{timeAgo(item.lastMessageAt)}</Text>
          </View>
          <View style={styles.rowBottom}>
            <Text
              style={[styles.preview, unread && styles.previewUnread]}
              numberOfLines={1}
            >
              {item.lastMessage || 'Say hi 👋'}
            </Text>
            {unread && <View style={styles.unreadDot} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
        <Text style={styles.subtitle}>Your skill swap conversations</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.purple} />
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, chats.length === 0 && styles.centered]}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No conversations yet.{'\n'}Accept a swap request to start chatting!
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatsScreen;
