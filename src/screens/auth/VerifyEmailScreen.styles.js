import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 28,
    },
    heading: {
      fontSize: 26,
      fontWeight: '700',
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: 10,
    },
    subtext: {
      fontSize: 14,
      color: theme.textMuted,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 32,
    },
    emailText: {
      color: theme.textPrimary,
      fontWeight: '700',
    },

    codeRow: {
      position: 'relative',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    codeBox: {
      width: 46,
      height: 56,
      borderRadius: 12,
      backgroundColor: theme.inputBg,
      borderWidth: 1.5,
      borderColor: 'rgba(83,74,183,0.3)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    codeBoxActive: {
      borderColor: theme.purple,
    },
    codeBoxError: {
      borderColor: theme.error,
    },
    codeDigit: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    hiddenInput: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
    },

    errorText: {
      fontSize: 13,
      color: theme.error,
      textAlign: 'center',
      marginBottom: 16,
    },

    primaryButton: {
      backgroundColor: theme.purple,
      height: 54,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    primaryButtonDisabled: {
      opacity: 0.5,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.3,
    },

    resendRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 28,
    },
    resendText: {
      fontSize: 14,
      color: theme.textMuted,
    },
    resendLink: {
      fontSize: 14,
      color: theme.teal,
      fontWeight: '700',
    },
    resendLinkDisabled: {
      color: theme.textMuted,
      fontWeight: '600',
    },

    wrongEmailButton: {
      alignSelf: 'center',
    },
    wrongEmailText: {
      fontSize: 13,
      color: theme.textMuted,
      textDecorationLine: 'underline',
    },
  });

export default getStyles;
