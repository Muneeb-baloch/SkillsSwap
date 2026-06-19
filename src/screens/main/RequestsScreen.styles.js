import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 2,
    },
    subtitle: {
      fontSize: 13,
      color: theme.textMuted,
    },

    // Tabs
    tabBar: {
      flexDirection: 'row',
      marginHorizontal: 20,
      marginBottom: 12,
      backgroundColor: theme.inputBg,
      borderRadius: 12,
      padding: 4,
    },
    tab: {
      flex: 1,
      height: 38,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabActive: {
      backgroundColor: theme.purple,
    },
    tabText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textMuted,
    },
    tabTextActive: {
      color: '#FFFFFF',
    },

    // List
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 110,
    },

    // Card
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
    timeAgo: {
      color: theme.textMuted,
      fontSize: 11,
      marginTop: 2,
    },

    // Status badge
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
    badge_pending: {
      backgroundColor: 'rgba(175,169,236,0.18)',
    },
    badgeText_pending: {
      color: theme.purpleLight,
    },
    badge_accepted: {
      backgroundColor: 'rgba(29,158,117,0.18)',
    },
    badgeText_accepted: {
      color: theme.tealLight,
    },
    badge_declined: {
      backgroundColor: 'rgba(226,75,74,0.18)',
    },
    badgeText_declined: {
      color: theme.error,
    },
    badge_completed: {
      backgroundColor: 'rgba(29,158,117,0.25)',
    },
    badgeText_completed: {
      color: theme.teal,
    },
    badge_completion_requested: {
      backgroundColor: 'rgba(245,197,24,0.15)',
    },
    badgeText_completion_requested: {
      color: '#F5C518',
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

    // Swap summary
    swapRow: {
      marginBottom: 8,
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
    message: {
      color: theme.textPrimary,
      fontSize: 13,
      fontStyle: 'italic',
      lineHeight: 19,
      marginBottom: 12,
    },

    // Actions
    actionRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 4,
    },
    actionBtn: {
      flex: 1,
      height: 42,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    declineBtn: {
      backgroundColor: theme.inputBg,
    },
    declineBtnText: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '700',
    },
    acceptBtn: {
      backgroundColor: theme.teal,
    },
    acceptBtnText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
    disputeBtnText: {
      color: theme.error,
      fontSize: 14,
      fontWeight: '700',
    },
    chatBtn: {
      marginTop: 4,
      height: 42,
      borderRadius: 10,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chatBtnText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },

    // Completion / review / dispute links
    waitingNote: {
      color: '#F5C518',
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 8,
    },
    linkRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    linkMuted: {
      color: theme.textMuted,
      fontSize: 13,
      fontWeight: '600',
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

    // States
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 60,
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
