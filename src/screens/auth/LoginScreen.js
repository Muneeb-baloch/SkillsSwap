import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import Logo from '../../components/Logo';
import { useTheme } from '../../theme/ThemeContext';
import { signInWithGoogle, signInWithApple, ensureUserDocument, SIGNIN_CANCELLED } from '../../utils/socialAuth';
import getStyles from './LoginScreen.styles';

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused]   = useState(false);

  const validate = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      const credential = await signInWithEmailAndPassword(auth, trimmedEmail, password);

      // Email/password accounts must finish the 6-digit code flow before
      // getting into the app — Google/Apple accounts skip this entirely.
      const snap = await getDoc(doc(db, 'users', credential.user.uid));
      if (snap.exists() && snap.data().emailVerified === false) {
        navigation.replace('VerifyEmail', { email: trimmedEmail });
        return;
      }
      navigation.replace('Main');
    } catch (e) {
      setError(e.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const { userCredential } = await signInWithGoogle();
      await ensureUserDocument(userCredential);
      navigation.replace('Main');
    } catch (e) {
      if (e.message !== SIGNIN_CANCELLED) {
        setError(e.message || 'Google sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApple = async () => {
    setError('');
    setLoading(true);
    try {
      const { userCredential, displayName } = await signInWithApple();
      await ensureUserDocument(userCredential, displayName);
      navigation.replace('Main');
    } catch (e) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        setError(e.message || 'Apple sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>

          {/* Logo */}
          <View style={styles.logoWrapper}>
            <View style={styles.logoIconRow}>
              <Logo variant="icon" size={48} />
            </View>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.subtext}>Sign in to continue swapping skills</Text>
          </View>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer, emailFocused && styles.inputContainerFocused]}>
              <Ionicons name="mail-outline" size={18} color={emailFocused ? theme.purple : theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={theme.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer, passFocused && styles.inputContainerFocused]}>
              <Ionicons name="lock-closed-outline" size={18} color={passFocused ? theme.purple : theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(p => !p)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#FFFFFF" />
              : <Text style={styles.primaryButtonText}>Sign in</Text>
            }
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogle} disabled={loading}>
            <View style={styles.googleIconCircle}>
              <FontAwesome name="google" size={15} color={theme.purple} />
            </View>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.appleButton} onPress={handleApple} disabled={loading}>
              <Ionicons name="logo-apple" size={18} color="#FFFFFF" />
              <Text style={styles.appleButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          )}

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>{"Don't have an account?  "}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.bottomLink}>Sign up</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
