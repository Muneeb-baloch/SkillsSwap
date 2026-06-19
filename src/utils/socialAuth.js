import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleAuthProvider, OAuthProvider, signInWithCredential, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { GOOGLE_WEB_CLIENT_ID } from '../config/google';

export const SIGNIN_CANCELLED = 'SIGNIN_CANCELLED';

// @react-native-google-signin/google-signin accesses its native module at
// the top of its entry file (TurboModuleRegistry.getEnforcing), which throws
// immediately if the module isn't compiled in — e.g. in Expo Go, or a dev
// client built before this package was added. A static top-level import of
// it would crash the whole app on launch (this file is pulled in eagerly by
// Login/Register). Requiring it lazily, inside a try/catch, defers that
// throw until someone actually taps "Continue with Google", where it's
// caught and turned into a normal, displayable error instead.
let googleConfigured = false;
function getGoogleSignin() {
  let GoogleSignin;
  try {
    GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
  } catch {
    throw new Error(
      "Google Sign-In isn't available in this build (e.g. Expo Go). It needs a custom development build with the native Google Sign-In module compiled in.",
    );
  }
  if (!googleConfigured) {
    GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
    googleConfigured = true;
  }
  return GoogleSignin;
}

// Native Google account picker → Firebase credential exchange. Requires the
// Google provider to be enabled in the Firebase Console (see src/config/google.js)
// and a native rebuild, since @react-native-google-signin/google-signin is a
// native module — it cannot work from a plain JS reload.
export async function signInWithGoogle() {
  const GoogleSignin = getGoogleSignin();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  if (response.type !== 'success') {
    throw new Error(SIGNIN_CANCELLED);
  }
  const { idToken } = response.data;
  if (!idToken) {
    throw new Error('Google sign-in did not return an ID token.');
  }
  const credential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(auth, credential);
  return { userCredential, displayName: '' };
}

// Sign in with Apple. Requires a paid Apple Developer Program membership
// (the "Sign In with Apple" capability isn't available on a free/personal
// team) plus the expo-apple-authentication config plugin + a native rebuild
// once that capability is added — see CLAUDE.md.
export async function signInWithApple() {
  if (Platform.OS !== 'ios') {
    throw new Error('Sign in with Apple is only available on iOS.');
  }
  const isAvailable = await AppleAuthentication.isAvailableAsync();
  if (!isAvailable) {
    throw new Error(
      "Sign in with Apple isn't available in this build (e.g. Expo Go, or before the Apple Developer capability + native rebuild are done).",
    );
  }

  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  const { identityToken, fullName } = appleCredential;
  if (!identityToken) {
    throw new Error('Apple sign-in did not return an identity token.');
  }

  const provider = new OAuthProvider('apple.com');
  const firebaseCredential = provider.credential({ idToken: identityToken });
  const userCredential = await signInWithCredential(auth, firebaseCredential);

  // Apple only ever sends the name on the first authorization — Firebase
  // won't have a displayName otherwise, so capture it here.
  const displayName =
    fullName && (fullName.givenName || fullName.familyName)
      ? [fullName.givenName, fullName.familyName].filter(Boolean).join(' ')
      : '';

  return { userCredential, displayName };
}

// Google/Apple emails are already verified by the provider, so social
// sign-ins skip the email-OTP flow entirely — create the Firestore profile
// (first time only) straight in the verified state.
export async function ensureUserDocument(userCredential, fallbackName = '') {
  const user = userCredential.user;
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;

  const name = user.displayName || fallbackName || 'User';
  if (fallbackName && !user.displayName) {
    await updateProfile(user, { displayName: fallbackName }).catch(() => {});
  }

  await setDoc(ref, {
    name,
    city: '',
    email: user.email || '',
    skills: [],
    wants: [],
    photoURL: user.photoURL || '',
    rating: 0,
    reviewCount: 0,
    emailVerified: true,
    createdAt: serverTimestamp(),
  });
}
