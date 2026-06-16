import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Svg, Path } from 'react-native-svg';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { db, auth } from '../config/firebase';
import { useTheme } from '../theme/ThemeContext';
import HomeScreen     from '../screens/main/HomeScreen';
import NearMeScreen   from '../screens/main/NearMeScreen';
import ChatsScreen    from '../screens/main/ChatsScreen';
import RequestsScreen from '../screens/main/RequestsScreen';
import ProfileScreen  from '../screens/main/ProfileScreen';

// ── SVG path data ─────────────────────────────────────────────────────────────

const HOUSE_PATHS = [
  { d: 'M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z' },
  { d: 'M9 21V13h6v8' },
];

const PIN_PATHS = [
  { d: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z' },
  { d: 'M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z' },
];

const CHAT_PATHS = [
  { d: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
];

const SWAP_PATHS = [
  { d: 'M7 16V4m0 0L3 8m4-4l4 4' },
  { d: 'M17 8v12m0 0l4-4m-4 4l-4-4' },
];

const PROFILE_PATHS = [
  { d: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' },
  { d: 'M12 11a4 4 0 100-8 4 4 0 000 8z' },
];

// ── Tab config — maps each route name to its label + icon paths ───────────────

const TABS = [
  { name: 'Home',     label: 'Home',     paths: HOUSE_PATHS },
  { name: 'NearMe',   label: 'Near Me',  paths: PIN_PATHS },
  { name: 'Chats',    label: 'Chats',    paths: CHAT_PATHS },
  { name: 'Requests', label: 'Requests', paths: SWAP_PATHS },
  { name: 'Profile',  label: 'Profile',  paths: PROFILE_PATHS },
];

// ── Floating pill tab bar ───────────────────────────────────────────────────────

const FloatingTabBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, 'barterRequests'),
      where('toUserId', '==', uid),
      where('status', '==', 'pending'),
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      setPendingCount(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={[styles.barWrapper, { bottom: Math.max(insets.bottom, 24) }]}>
      <View style={[styles.bar, { backgroundColor: theme.tabBg, borderColor: theme.tabBorder }]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tab = TABS.find(t => t.name === route.name) || TABS[0];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              style={[styles.tabItem, isFocused && { backgroundColor: theme.purple, paddingHorizontal: 14 }]}
            >
              <View style={styles.iconWrapper}>
                <Svg width={20} height={20} viewBox="0 0 24 24">
                  {tab.paths.map((p, i) => (
                    <Path
                      key={i}
                      d={p.d}
                      fill={p.fill || 'none'}
                      stroke={isFocused ? '#FFFFFF' : theme.textMuted}
                      strokeWidth={isFocused ? 2.4 : 2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                </Svg>

                {route.name === 'Requests' && pendingCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: theme.error }]}>
                    <Text style={styles.badgeText}>
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </Text>
                  </View>
                )}
              </View>

              {isFocused && <Text style={styles.tabLabel}>{tab.label}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    borderRadius: 28,
    borderWidth: 1,
    height: 64,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 6,
    minWidth: 44,
  },
  iconWrapper: {
    position: 'relative',
  },
  tabLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});

// ── Navigator ─────────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    tabBar={props => <FloatingTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Browse' }} />
    <Tab.Screen name="NearMe" component={NearMeScreen} options={{ title: 'Near Me' }} />
    <Tab.Screen name="Chats" component={ChatsScreen} options={{ title: 'Chats' }} />
    <Tab.Screen name="Requests" component={RequestsScreen} options={{ title: 'Requests' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
  </Tab.Navigator>
);

export default TabNavigator;
