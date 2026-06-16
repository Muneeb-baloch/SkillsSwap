import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const getStyles = theme =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    inner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { color: theme.textPrimary, fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    sub: { color: theme.textMuted, fontSize: 14 },
  });

const RequestsScreen = () => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={styles.inner}>
        <Text style={styles.title}>Requests</Text>
        <Text style={styles.sub}>Swap requests will appear here</Text>
      </View>
    </SafeAreaView>
  );
};

export default RequestsScreen;
