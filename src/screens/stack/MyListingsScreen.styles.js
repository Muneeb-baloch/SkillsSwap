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
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    postButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ── Tab switcher ──────────────────────────────────────────────────────────
    tabSwitcher: {
      flexDirection: 'row',
      backgroundColor: theme.inputBg,
      borderRadius: 12,
      padding: 4,
      marginHorizontal: 20,
      marginBottom: 12,
    },
    tabButton: {
      flex: 1,
      height: 36,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabButtonActive: {
      backgroundColor: theme.purple,
    },
    tabButtonText: {
      color: theme.textMuted,
      fontSize: 13,
      fontWeight: '600',
    },
    tabButtonTextActive: {
      color: '#FFFFFF',
    },

    // ── Count ─────────────────────────────────────────────────────────────────
    countText: {
      color: theme.tealLight,
      fontSize: 13,
      marginHorizontal: 20,
      marginBottom: 12,
    },

    // ── List ──────────────────────────────────────────────────────────────────
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },

    // ── Management card ──────────────────────────────────────────────────────
    card: {
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      height: 24,
      paddingHorizontal: 10,
      borderRadius: 12,
    },
    statusBadgeActive: {
      backgroundColor: 'rgba(29,158,117,0.15)',
    },
    statusBadgeInactive: {
      backgroundColor: 'rgba(136,135,128,0.15)',
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusDotActive: {
      backgroundColor: theme.teal,
    },
    statusDotInactive: {
      backgroundColor: theme.textMuted,
    },
    statusBadgeText: {
      fontSize: 12,
      fontWeight: '600',
    },
    statusTextActive: {
      color: theme.teal,
    },
    statusTextInactive: {
      color: theme.textMuted,
    },
    menuButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    offerSkill: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '700',
      marginTop: 8,
    },
    wantRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 4,
    },
    wantSkill: {
      color: theme.purpleLight,
      fontSize: 14,
      flex: 1,
    },
    cardImage: {
      width: '100%',
      height: 120,
      borderRadius: 10,
      marginTop: 10,
      backgroundColor: theme.inputBg,
    },

    // ── Stats row ─────────────────────────────────────────────────────────────
    statsRow: {
      flexDirection: 'row',
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    statValue: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '700',
    },
    statLabel: {
      color: theme.textMuted,
      fontSize: 10,
      marginTop: 2,
    },

    // ── Action buttons ────────────────────────────────────────────────────────
    actionsRow: {
      flexDirection: 'row',
      marginTop: 12,
    },
    toggleButton: {
      flex: 1,
      height: 40,
      borderRadius: 10,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    pauseButton: {
      borderColor: theme.textMuted,
    },
    pauseButtonText: {
      color: theme.textMuted,
      fontSize: 14,
      fontWeight: '600',
    },
    reactivateButton: {
      borderColor: theme.teal,
    },
    reactivateButtonText: {
      color: theme.teal,
      fontSize: 14,
      fontWeight: '600',
    },
    deleteButton: {
      width: 80,
      height: 40,
      marginLeft: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.error,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteButtonText: {
      color: theme.error,
      fontSize: 14,
      fontWeight: '600',
    },

    // ── Empty state ───────────────────────────────────────────────────────────
    centerState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingTop: 60,
    },
    emptyTitle: {
      color: theme.textPrimary,
      fontSize: 17,
      fontWeight: 'bold',
      marginBottom: 6,
    },
    emptySubtitle: {
      color: theme.textMuted,
      fontSize: 13,
      textAlign: 'center',
      marginBottom: 18,
    },
    postBtn: {
      height: 40,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
    },
    postBtnText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
    },

    // ── Loading ───────────────────────────────────────────────────────────────
    loaderWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default getStyles;
