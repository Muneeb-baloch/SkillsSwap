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
      paddingVertical: 32,
    },
    logoWrapper: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logoIconRow: {
      width: 72,
      height: 72,
      borderRadius: 20,
      backgroundColor: theme.cardBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    heading: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 6,
      textAlign: 'center',
    },
    subtext: {
      fontSize: 14,
      color: theme.textMuted,
      marginBottom: 32,
      textAlign: 'center',
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
    forgotPassword: {
      alignSelf: 'flex-end',
      marginTop: 2,
      marginBottom: 24,
    },
    forgotPasswordText: {
      fontSize: 13,
      color: theme.purpleLight,
    },
    errorText: {
      fontSize: 13,
      color: theme.error,
      marginBottom: 12,
      textAlign: 'center',
    },
    primaryButton: {
      backgroundColor: theme.purple,
      height: 54,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 18,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: 'rgba(136,135,128,0.25)',
    },
    dividerText: {
      fontSize: 13,
      color: theme.textMuted,
      marginHorizontal: 14,
    },
    // Google's button is brand-locked to a white pill with dark text/icon —
    // stays fixed regardless of app theme.
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      height: 54,
      borderRadius: 14,
      marginBottom: 12,
      gap: 10,
    },
    googleIconCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: '#1a1a2e',
      alignItems: 'center',
      justifyContent: 'center',
    },
    googleIconText: {
      color: theme.purple,
      fontWeight: '800',
      fontSize: 15,
    },
    googleButtonText: {
      color: '#1a1a2e',
      fontSize: 15,
      fontWeight: '600',
    },
    // Apple's HIG requires the black pill / white logo+text combo.
    appleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000000',
      height: 54,
      borderRadius: 14,
      marginBottom: 36,
      gap: 8,
    },
    appleButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '600',
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
