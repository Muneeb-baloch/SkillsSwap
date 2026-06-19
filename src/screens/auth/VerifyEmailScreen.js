import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { signOut } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import {
  generateOtpCode,
  sendOtpEmail,
  OTP_EXPIRY_MINUTES,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_SECONDS,
} from '../../utils/emailVerification';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './VerifyEmailScreen.styles';

const CODE_LENGTH = 6;

const VerifyEmailScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const email = route?.params?.email || auth.currentUser?.email || '';

  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (fullCode) => {
    const uid = auth.currentUser?.uid;
    const codeToCheck = fullCode || code;
    if (!uid) return;
    if (codeToCheck.length !== CODE_LENGTH) {
      setError(`Enter the ${CODE_LENGTH}-digit code.`);
      return;
    }
    setError('');
    setVerifying(true);
    try {
      const ref = doc(db, 'emailVerifications', uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setError('No verification code found for this account. Tap resend.');
        return;
      }
      const data = snap.data();
      const expiresAtMs = data.expiresAt?.toMillis?.() || 0;
      const attempts = data.attempts || 0;

      if (Date.now() > expiresAtMs) {
        setError('This code has expired. Tap resend to get a new one.');
        return;
      }
      if (attempts >= OTP_MAX_ATTEMPTS) {
        setError('Too many incorrect attempts. Tap resend to get a new code.');
        return;
      }
      if (data.code !== codeToCheck) {
        await updateDoc(ref, { attempts: increment(1) });
        const remaining = OTP_MAX_ATTEMPTS - (attempts + 1);
        setError(
          remaining > 0
            ? `Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} left.`
            : 'Too many incorrect attempts. Tap resend to get a new code.',
        );
        setCode('');
        return;
      }

      await updateDoc(doc(db, 'users', uid), { emailVerified: true });
      await deleteDoc(ref).catch(() => {});
      navigation.replace('Main');
    } catch (e) {
      console.error('Verify email error:', e);
      setError('Something went wrong. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleChangeCode = text => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH);
    setCode(digits);
    setError('');
    if (digits.length === CODE_LENGTH) {
      handleVerify(digits);
    }
  };

  const handleResend = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || cooldown > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      const newCode = generateOtpCode();
      await setDoc(doc(db, 'emailVerifications', uid), {
        code: newCode,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
        attempts: 0,
        createdAt: serverTimestamp(),
      });
      await sendOtpEmail(email, newCode);
      setCode('');
      setCooldown(OTP_RESEND_COOLDOWN_SECONDS);
      Alert.alert('Code sent', `We've sent a new code to ${email}`);
    } catch (e) {
      console.error('Resend OTP error:', e);
      setError('Could not resend the code. Please check your connection and try again.');
    } finally {
      setResending(false);
    }
  };

  const handleWrongEmail = () => {
    Alert.alert('Start over?', "You'll need to sign up again with the correct email.", [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Start over',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
          } catch {
            // Non-fatal — navigate away regardless.
          }
          navigation.replace('Register');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>Verify your email</Text>
        <Text style={styles.subtext}>
          We sent a {CODE_LENGTH}-digit code to{'\n'}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        <View style={styles.codeRow}>
          {Array.from({ length: CODE_LENGTH }, (_, i) => (
            <View
              key={i}
              style={[
                styles.codeBox,
                code.length === i && styles.codeBoxActive,
                !!error && styles.codeBoxError,
              ]}
            >
              <Text style={styles.codeDigit}>{code[i] || ''}</Text>
            </View>
          ))}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleChangeCode}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            style={styles.hiddenInput}
            autoFocus
            editable={!verifying}
          />
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.primaryButton, (verifying || code.length !== CODE_LENGTH) && styles.primaryButtonDisabled]}
          onPress={() => handleVerify()}
          disabled={verifying || code.length !== CODE_LENGTH}
        >
          {verifying ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Verify</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't get a code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={cooldown > 0 || resending}>
            {resending ? (
              <ActivityIndicator color={theme.purpleLight} size="small" />
            ) : (
              <Text style={[styles.resendLink, cooldown > 0 && styles.resendLinkDisabled]}>
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.wrongEmailButton} onPress={handleWrongEmail}>
          <Text style={styles.wrongEmailText}>Wrong email? Start over</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VerifyEmailScreen;
