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
import CityPicker from '../../components/CityPicker';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useTheme } from '../../theme/ThemeContext';
import { signInWithGoogle, signInWithApple, ensureUserDocument, SIGNIN_CANCELLED } from '../../utils/socialAuth';
import { generateOtpCode, sendOtpEmail, OTP_EXPIRY_MINUTES } from '../../utils/emailVerification';
import getStyles from './RegisterScreen.styles';

const RegisterScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [name, setName]                               = useState('');
  const [city, setCity]                               = useState('');
  const [email, setEmail]                             = useState('');
  const [password, setPassword]                       = useState('');
  const [confirmPassword, setConfirmPassword]         = useState('');
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading]                         = useState(false);
  const [error, setError]                             = useState('');

  const [nameFocused, setNameFocused]       = useState(false);
  const [emailFocused, setEmailFocused]     = useState(false);
  const [passFocused, setPassFocused]       = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const validate = () => {
    if (!name.trim())                   { setError('Full name is required.');                  return false; }
    if (!city.trim())                   { setError('City is required.');                        return false; }
    if (!email || !email.includes('@')) { setError('Enter a valid email address.');            return false; }
    if (password.length < 6)           { setError('Password must be at least 6 characters.'); return false; }
    if (password !== confirmPassword)  { setError('Passwords do not match.');                 return false; }
    return true;
  };

  const handleRegister = async () => {
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      const credential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      await updateProfile(credential.user, { displayName: name.trim() });
      await setDoc(doc(db, 'users', credential.user.uid), {
        name:          name.trim(),
        city:          city.trim(),
        email:         trimmedEmail,
        skills:        [],
        wants:         [],
        photoURL:      '',
        rating:        0,
        reviewCount:   0,
        emailVerified: false,
        createdAt:     new Date(),
      });

      // Email/password accounts must confirm ownership of the email via a
      // 6-digit code before they get full app access (Google/Apple sign-ins
      // skip this since the provider already verified the email).
      const code = generateOtpCode();
      await setDoc(doc(db, 'emailVerifications', credential.user.uid), {
        code,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
        attempts: 0,
        createdAt: new Date(),
      });
      await sendOtpEmail(trimmedEmail, code);

      navigation.replace('VerifyEmail', { email: trimmedEmail });
    } catch (e) {
      setError(e.message || 'Registration failed. Please try again.');
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

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.heading}>Create account</Text>
          <Text style={styles.subtext}>Start swapping skills today</Text>

          {/* Full name */}
          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer, nameFocused && styles.inputContainerFocused]}>
              <Ionicons name="person-outline" size={18} color={nameFocused ? theme.purple : theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </View>
          </View>

          {/* City */}
          <View style={styles.inputWrapper}>
            <CityPicker value={city} onChange={setCity} />
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
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm password */}
          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer, confirmFocused && styles.inputContainerFocused]}>
              <Ionicons name="shield-checkmark-outline" size={18} color={confirmFocused ? theme.purple : theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor={theme.textMuted}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(p => !p)}>
                <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#FFFFFF" />
              : <Text style={styles.primaryButtonText}>Create account</Text>
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
            <Text style={styles.bottomText}>{'Already have an account?  '}</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.bottomLink}>Sign in</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
