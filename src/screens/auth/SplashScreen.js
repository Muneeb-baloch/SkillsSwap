import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase';
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
      minimumSplash.then(() => {
        navigation.replace(user ? 'Main' : 'Login');
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
