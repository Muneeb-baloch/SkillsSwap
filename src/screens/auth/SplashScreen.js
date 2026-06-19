import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import Logo from '../../components/Logo';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './SplashScreen.styles';

const MIN_SPLASH_MS = 2200;

const SplashScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    const minimumSplash = new Promise(resolve => setTimeout(resolve, MIN_SPLASH_MS));

    // onAuthStateChanged only fires once Firebase has finished reading
    // the persisted session from AsyncStorage, so `user` here reflects
    // the real logged-in state instead of the momentarily-null currentUser.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      minimumSplash.then(async () => {
        if (!user) {
          navigation.replace('Login');
          return;
        }
        // A returning user who never finished the email-OTP step (e.g.
        // closed the app mid-verification) should land back on that
        // screen, not get full access. Defaults to Main on any fetch
        // error so a transient Firestore blip can't lock someone out.
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists() && snap.data().emailVerified === false) {
            navigation.replace('VerifyEmail', { email: user.email });
            return;
          }
        } catch {
          // fall through to Main
        }
        navigation.replace('Main');
      });
    });

    return () => unsubscribe();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Logo variant="icon" size={100} />
      <Text style={styles.appName}>SkillsSwap</Text>
      <Text style={styles.tagline}>Trade skills. Grow together.</Text>
    </View>
  );
};

export default SplashScreen;
