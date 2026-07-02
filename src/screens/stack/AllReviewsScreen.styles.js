import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    // ── Header ────────────────────────────────────────────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 12,
      paddingBottom: 12,
      paddingHorizontal: 20,
    },
    backButton: {
      width: 44,
      paddingVertical: 4,
    },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textPrimary,
      textAlign: 'center',
    },
    headerSpacer: {
      width: 44,
    },

    // ── Summary card ──────────────────────────────────────────────────────────
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginTop: 16,
      marginBottom: 8,
    },
    summaryRating: {
      color: theme.textPrimary,
      fontSize: 48,
      fontWeight: 'bold',
      marginRight: 18,
    },
    summaryDetails: {
      flex: 1,
    },
    summaryStars: {
      color: '#F5C518',
      fontSize: 16,
      letterSpacing: 2,
    },
    summaryOutOf: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 4,
    },
    summaryCount: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 2,
    },

    // ── Review list ───────────────────────────────────────────────────────────
    listContent: {
      paddingTop: 8,
    },
    reviewCard: {
      backgroundColor: theme.cardBg,
      borderRadius: 14,
      padding: 16,
      marginHorizontal: 20,
      marginBottom: 10,
    },
    reviewTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    reviewAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    reviewAvatarImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
      backgroundColor: theme.inputBg,
    },
    reviewAvatarText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
    reviewerInfo: {
      flex: 1,
    },
    reviewerName: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: 'bold',
    },
    reviewTime: {
      color: theme.textMuted,
      fontSize: 11,
      marginTop: 2,
    },
    reviewStars: {
      color: '#F5C518',
      fontSize: 14,
      letterSpacing: 1,
    },
    reviewComment: {
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 22,
      marginTop: 8,
    },
    pendingBadge: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(245,197,24,0.12)',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginTop: 8,
    },
    pendingBadgeText: {
      color: '#F5C518',
      fontSize: 11,
      fontWeight: '600',
    },

    // ── Loading / error / empty states ────────────────────────────────────────
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorText: {
      color: theme.error,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 16,
      paddingHorizontal: 32,
    },
    retryBtn: {
      height: 40,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
    },
    retryBtnText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
    emptyWrap: {
      alignItems: 'center',
      paddingTop: 80,
      paddingHorizontal: 40,
    },
    emptyTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    emptySubtitle: {
      color: theme.textMuted,
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
      lineHeight: 22,
    },
  });

export default getStyles;
