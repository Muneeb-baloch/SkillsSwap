import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    flex: {
      flex: 1,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backText: {
      color: theme.textPrimary,
      fontSize: 24,
    },
    headerTitle: {
      color: theme.textPrimary,
      fontSize: 17,
      fontWeight: '700',
    },

    content: {
      padding: 24,
      alignItems: 'center',
    },

    // Early-review info banner
    infoBanner: {
      width: '100%',
      flexDirection: 'row',
      backgroundColor: 'rgba(245,197,24,0.08)',
      borderWidth: 1,
      borderColor: 'rgba(245,197,24,0.3)',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
    },
    infoIcon: {
      color: '#F5C518',
      fontSize: 16,
      marginRight: 10,
      marginTop: 1,
    },
    infoTextWrap: {
      flex: 1,
    },
    infoTitle: {
      color: '#F5C518',
      fontSize: 13,
      fontWeight: '600',
    },
    infoBody: {
      color: theme.textMuted,
      fontSize: 12,
      lineHeight: 17,
      marginTop: 2,
    },

    // Confirmed-swap success banner
    successBanner: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(29,158,117,0.08)',
      borderWidth: 1,
      borderColor: 'rgba(29,158,117,0.3)',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
    },
    successIcon: {
      color: theme.teal,
      fontSize: 16,
      marginRight: 10,
      fontWeight: '700',
    },
    successText: {
      flex: 1,
      color: theme.teal,
      fontSize: 13,
      fontWeight: '600',
      lineHeight: 18,
    },

    prompt: {
      color: theme.textMuted,
      fontSize: 15,
      marginTop: 12,
    },
    revieweeName: {
      color: theme.textPrimary,
      fontSize: 22,
      fontWeight: '700',
      marginTop: 2,
      marginBottom: 24,
      textAlign: 'center',
    },

    starsRow: {
      flexDirection: 'row',
    },
    starButton: {
      paddingHorizontal: 6,
    },
    star: {
      fontSize: 44,
    },
    starFilled: {
      color: '#F5B731',
    },
    starEmpty: {
      color: theme.textMuted,
      opacity: 0.4,
    },
    ratingHint: {
      color: theme.purpleLight,
      fontSize: 14,
      fontWeight: '600',
      marginTop: 12,
      marginBottom: 28,
    },

    label: {
      alignSelf: 'flex-start',
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    input: {
      width: '100%',
      minHeight: 120,
      backgroundColor: theme.inputBg,
      borderRadius: 12,
      padding: 14,
      color: theme.textPrimary,
      fontSize: 15,
      textAlignVertical: 'top',
      marginBottom: 28,
    },

    submitButton: {
      width: '100%',
      height: 52,
      borderRadius: 12,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
  });

export default getStyles;
