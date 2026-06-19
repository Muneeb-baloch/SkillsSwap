import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut, deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './SettingsScreen.styles';

const NOTIF_KEY = 'settings:notificationsEnabled';
const APP_VERSION = '1.0.0';

const SettingsScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = getStyles(theme);

  const [notifications, setNotifications] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(NOTIF_KEY)
      .then(val => {
        if (val !== null) setNotifications(val === 'true');
      })
      .catch(() => {});
  }, []);

  const handleToggleNotifications = async value => {
    setNotifications(value);
    try {
      await AsyncStorage.setItem(NOTIF_KEY, String(value));
    } catch (err) {
      console.error('Failed to save notification preference:', err);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          } catch (err) {
            console.error('Sign out error:', err);
            Alert.alert('Error', 'Could not sign out. Please try again.');
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This permanently deletes your account and profile. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;
            setDeleting(true);
            try {
              // Remove the profile document first, then the auth account.
              await deleteDoc(doc(db, 'users', currentUser.uid)).catch(() => {});
              await deleteUser(currentUser);
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (err) {
              console.error('Delete account error:', err);
              if (err.code === 'auth/requires-recent-login') {
                Alert.alert(
                  'Please sign in again',
                  'For your security, please sign out and sign back in, then delete your account.',
                );
              } else {
                Alert.alert('Error', 'Could not delete your account. Please try again.');
              }
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Preferences */}
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>Push notifications</Text>
              <Text style={styles.rowSubtitle}>Get notified about requests and messages</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: theme.inputBg, true: theme.purple }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>Dark mode</Text>
              <Text style={styles.rowSubtitle}>Switch between dark and light theme</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.inputBg, true: theme.purple }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* About */}
        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.rowTitle}>Version</Text>
            <Text style={styles.rowValue}>{APP_VERSION}</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.rowBetween}
            onPress={() => Alert.alert('Support', 'For support contact: support@skillsswap.app')}
            activeOpacity={0.7}
          >
            <Text style={styles.rowTitle}>Help & Support</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={styles.aboutTextWrap}>
            <Text style={styles.aboutText}>
              SkillsSwap is a skill bartering platform — swap what you know for what you want to learn,
              no money required.
            </Text>
          </View>
        </View>

        {/* Account */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.rowBetween} onPress={handleSignOut} activeOpacity={0.7}>
            <Text style={styles.rowTitle}>Sign out</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.rowBetween}
            onPress={handleDeleteAccount}
            disabled={deleting}
            activeOpacity={0.7}
          >
            <Text style={styles.dangerText}>Delete account</Text>
            {deleting ? <ActivityIndicator color={theme.error} size="small" /> : <Text style={styles.chevron}>›</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
