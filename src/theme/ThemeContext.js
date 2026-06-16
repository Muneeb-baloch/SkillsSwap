import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = 'theme_preference';

const DARK = {
  // Backgrounds
  background: '#1a1a2e',
  cardBg: '#12122a',
  inputBg: '#242442',
  divider: '#2E2B50',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#AFA9EC',
  textMuted: '#888780',

  // Brand (same in both themes)
  purple: '#534AB7',
  purpleLight: '#AFA9EC',
  teal: '#1D9E75',
  tealLight: '#9FE1CB',
  error: '#E24B4A',

  // Tab bar
  tabBg: '#1E1B3A',
  tabBorder: '#2E2B50',

  isDark: true,
};

const LIGHT = {
  // Backgrounds
  background: '#F2F2F7',
  cardBg: '#FFFFFF',
  inputBg: '#F0EFF5',
  divider: '#E5E5EA',

  // Text
  textPrimary: '#1a1a2e',
  textSecondary: '#534AB7',
  textMuted: '#888780',

  // Brand (same in both themes)
  purple: '#534AB7',
  purpleLight: '#534AB7',
  teal: '#1D9E75',
  tealLight: '#0F8060',
  error: '#E24B4A',

  // Tab bar
  tabBg: '#FFFFFF',
  tabBorder: '#E5E5EA',

  isDark: false,
};

const ThemeContext = createContext({
  theme: DARK,
  isDark: true,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  // Load saved preference on app start
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then(saved => {
        if (saved !== null) {
          setIsDark(saved === 'dark');
        }
      })
      .catch(() => {});
  }, []);

  const toggleTheme = async () => {
    const newVal = !isDark;
    setIsDark(newVal);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newVal ? 'dark' : 'light');
    } catch {
      // Non-fatal — preference just won't persist across restarts
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: isDark ? DARK : LIGHT, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export { DARK, LIGHT };
