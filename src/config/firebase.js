import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey:            'AIzaSyBpZtsxD1Uy4fEWu5raE6isiS7YgcA3MUo',
  authDomain:        'skillsswap-6e9c0.firebaseapp.com',
  projectId:         'skillsswap-6e9c0',
  storageBucket:     'skillsswap-6e9c0.firebasestorage.app',
  messagingSenderId: '556600852472',
  appId:             '1:556600852472:web:b5d0a08da82beb4823200d',
  measurementId:     'G-1WYRHLJMNV',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// initializeAuth throws if called twice on the same app (e.g. Fast Refresh),
// so fall back to the already-initialized instance in that case.
let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  authInstance = getAuth(app);
}
export const auth = authInstance;
export const db      = getFirestore(app);
export const storage = getStorage(app);
