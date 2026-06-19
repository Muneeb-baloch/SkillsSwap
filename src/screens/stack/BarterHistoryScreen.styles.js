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
      paddingHorizontal: 12,
      paddingTop: 8,
      paddingBottom: 8,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    headerSpacer: {
      width: 40,
    },

    summaryRow: {
      flexDirection: 'row',
      marginHorizontal: 20,
      marginBottom: 14,
      gap: 8,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: theme.cardBg,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
    },
    summaryValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    summaryLabel: {
      fontSize: 11,
      color: theme.textMuted,
      marginTop: 2,
    },

    // Filter chips
    filterRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginBottom: 12,
      gap: 8,
    },
    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: theme.inputBg,
    },
    filterChipActive: {
      backgroundColor: theme.purple,
    },
    filterChipText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textMuted,
    },
    filterChipTextActive: {
      color: '#FFFFFF',
    },

    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },

    card: {
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    avatarWrapper: {
      marginRight: 10,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarImage: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.inputBg,
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: 'bold',
    },
    cardHeaderText: {
      flex: 1,
    },
    personName: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: 'bold',
    },
    dateText: {
      color: theme.textMuted,
      fontSize: 11,
      marginTop: 2,
    },

    badge: {
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 3,
      marginLeft: 8,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '700',
    },
    badge_completed: {
      backgroundColor: 'rgba(29,158,117,0.18)',
    },
    badgeText_completed: {
      color: theme.tealLight,
    },
    badge_disputed: {
      backgroundColor: 'rgba(226,75,74,0.15)',
    },
    badgeText_disputed: {
      color: theme.error,
    },
    badge_cancelled: {
      backgroundColor: 'rgba(136,135,128,0.15)',
    },
    badgeText_cancelled: {
      color: theme.textMuted,
    },

    swapRow: {
      marginBottom: 4,
    },
    swapText: {
      color: theme.textMuted,
      fontSize: 13,
      lineHeight: 19,
    },
    swapHighlight: {
      color: theme.textPrimary,
      fontWeight: '700',
    },
    swapHighlightAlt: {
      color: theme.purpleLight,
      fontWeight: '700',
    },

    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    reviewLink: {
      color: theme.teal,
      fontSize: 13,
      fontWeight: '700',
    },
    reviewedText: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '600',
    },
    supportLink: {
      color: theme.textMuted,
      fontSize: 12,
      textDecorationLine: 'underline',
    },

    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 60,
    },
    emptyTitle: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 6,
    },
    emptyText: {
      color: theme.textMuted,
      fontSize: 14,
      textAlign: 'center',
      paddingHorizontal: 32,
      lineHeight: 22,
    },
  });

export default getStyles;
