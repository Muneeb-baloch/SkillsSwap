import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    appName: {
      fontSize: 32,
      fontWeight: '700',
      color: theme.purpleLight,
      marginTop: 20,
      letterSpacing: -0.5,
    },
    tagline: {
      fontSize: 14,
      color: theme.textMuted,
      marginTop: 8,
      letterSpacing: 0.3,
    },
  });

export default getStyles;
