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
      backgroundColor: theme.background,
    },
    backButton: {
      width: 60,
      paddingVertical: 4,
    },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textPrimary,
      textAlign: 'center',
    },
    clearAllButton: {
      width: 60,
      alignItems: 'flex-end',
      paddingVertical: 4,
    },
    clearAllText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.error,
    },
    // Invisible right-side twin of backButton so the centered title stays
    // centered when "Clear all" is hidden.
    headerSpacer: {
      width: 60,
    },

    // ── List ──────────────────────────────────────────────────────────────────
    listContent: {
      paddingHorizontal: 20,
      paddingTop: 8,
    },

    // ── Listing Card (mirrors HomeScreen card design) ─────────────────────────
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
    avatarText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: 'bold',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: 'bold',
    },
    userCity: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    unsaveBtn: {
      padding: 4,
      marginLeft: 10,
    },
    divider: {
      height: 1,
      backgroundColor: theme.divider,
      marginBottom: 12,
    },
    skillRow: {
      marginBottom: 8,
    },
    skillLabel: {
      color: theme.textMuted,
      fontSize: 11,
      textTransform: 'uppercase',
      marginBottom: 2,
      letterSpacing: 0.4,
    },
    offerSkill: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: 'bold',
    },
    wantSkill: {
      color: theme.purpleLight,
      fontSize: 14,
    },
    cardBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    timeAgoText: {
      color: theme.textMuted,
      fontSize: 11,
    },
    requestSwapText: {
      color: theme.teal,
      fontSize: 13,
      fontWeight: 'bold',
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
    },
    emptyTitle: {
      color: theme.textPrimary,
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      textAlign: 'center',
    },
    emptySubtitle: {
      color: theme.textMuted,
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
      paddingHorizontal: 40,
      lineHeight: 22,
    },
    browseBtn: {
      marginTop: 28,
      backgroundColor: theme.purple,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 36,
    },
    browseBtnText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: 'bold',
    },
  });

export default getStyles;
