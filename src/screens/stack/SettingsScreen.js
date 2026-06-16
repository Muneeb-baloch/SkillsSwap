import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const getStyles = theme =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    back: { padding: 16 },
    backText: { color: theme.purple, fontSize: 16 },
    inner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { color: theme.textPrimary, fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    sub: { color: theme.textMuted, fontSize: 14 },
  });

const SettingsScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.inner}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.sub}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
