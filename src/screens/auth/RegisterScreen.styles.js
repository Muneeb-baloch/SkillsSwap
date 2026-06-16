import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scroll: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    container: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 48,
    },
    backButton: {
      alignSelf: 'flex-start',
      padding: 4,
      marginBottom: 24,
    },
    heading: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    subtext: {
      fontSize: 14,
      color: theme.textMuted,
      marginBottom: 28,
    },
    inputWrapper: {
      marginBottom: 14,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBg,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: 'rgba(83,74,183,0.3)',
      height: 52,
      paddingHorizontal: 14,
      gap: 10,
    },
    inputContainerFocused: {
      borderColor: theme.purple,
    },
    input: {
      flex: 1,
      color: theme.textPrimary,
      fontSize: 14,
    },
    eyeButton: {
      padding: 4,
    },
    errorText: {
      fontSize: 13,
      color: theme.error,
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 4,
    },
    primaryButton: {
      backgroundColor: theme.purple,
      height: 54,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 24,
      marginBottom: 16,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomText: {
      fontSize: 14,
      color: theme.textMuted,
    },
    bottomLink: {
      fontSize: 14,
      color: theme.teal,
      fontWeight: '700',
    },
  });

export default getStyles;
