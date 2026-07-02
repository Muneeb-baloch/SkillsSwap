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
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import {
  signInWithGoogle,
  signInWithApple,
  ensureUserDocument,
  SIGNIN_CANCELLED,
} from '../../utils/socialAuth';
import Logo from '../../components/Logo';
import GoogleIcon from '../../components/GoogleIcon';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './LoginScreen.styles';

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
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

  // Shared by Google/Apple: the provider already verified the email, so
  // social sign-ins skip the OTP step and go straight to Main.
  const handleSocialSignIn = async (provider, signInFn) => {
    setError('');
    setSocialLoading(provider);
    try {
      const { userCredential, displayName } = await signInFn();
      await ensureUserDocument(userCredential, displayName);
      navigation.replace('Main');
    } catch (e) {
      if (e.message === SIGNIN_CANCELLED || e.code === 'ERR_REQUEST_CANCELED') return;
      setError(e.message || 'Sign in failed. Please try again.');
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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

          {/* Social sign-in */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => handleSocialSignIn('google', signInWithGoogle)}
            disabled={socialLoading !== null}
          >
            {socialLoading === 'google'
              ? <ActivityIndicator color="#1a1a2e" />
              : (
                <>
                  <GoogleIcon size={20} />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )
            }
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.appleButton}
              onPress={() => handleSocialSignIn('apple', signInWithApple)}
              disabled={socialLoading !== null}
            >
              {socialLoading === 'apple'
                ? <ActivityIndicator color="#FFFFFF" />
                : (
                  <>
                    <Ionicons name="logo-apple" size={22} color="#FFFFFF" />
                    <Text style={styles.appleButtonText}>Continue with Apple</Text>
                  </>
                )
              }
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
