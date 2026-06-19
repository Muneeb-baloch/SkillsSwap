import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
      padding: 16,
      paddingBottom: 40,
    },

    sectionLabel: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.5,
      marginLeft: 4,
      marginTop: 18,
      marginBottom: 8,
    },
    card: {
      backgroundColor: theme.cardBg,
      borderRadius: 14,
      paddingHorizontal: 16,
    },
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
    },
    rowTextWrap: {
      flex: 1,
      marginRight: 12,
    },
    rowTitle: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    rowSubtitle: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    rowValue: {
      color: theme.textMuted,
      fontSize: 14,
    },
    chevron: {
      color: theme.textMuted,
      fontSize: 22,
    },
    divider: {
      height: 1,
      backgroundColor: theme.divider,
    },
    aboutTextWrap: {
      paddingVertical: 14,
    },
    aboutText: {
      color: theme.textMuted,
      fontSize: 13,
      lineHeight: 19,
    },
    dangerText: {
      color: theme.error,
      fontSize: 15,
      fontWeight: '600',
    },
  });

export default getStyles;
