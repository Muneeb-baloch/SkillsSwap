import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    // ── Header ────────────────────────────────────────────────────────────────
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
    },
    headerLeft: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    headerSubtitle: {
      fontSize: 13,
      color: theme.textMuted,
      marginTop: 3,
    },
    searchIconButton: {
      paddingTop: 2,
      paddingLeft: 12,
    },
    searchIconButtonText: {
      fontSize: 22,
      color: theme.textPrimary,
    },

    // ── Search Bar ────────────────────────────────────────────────────────────
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 48,
      backgroundColor: theme.inputBg,
      borderRadius: 12,
      marginHorizontal: 20,
      marginBottom: 8,
      paddingHorizontal: 14,
    },
    searchPrefixIcon: {
      fontSize: 17,
      color: theme.textMuted,
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: 48,
      color: theme.textPrimary,
      fontSize: 14,
    },

    // ── Category Chips ────────────────────────────────────────────────────────
    chipsScroll: {
      flexGrow: 0,
      flexShrink: 0,
      marginBottom: 14,
    },
    chipsContent: {
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 8,
      alignItems: 'center',
    },
    chip: {
      height: 34,
      paddingHorizontal: 16,
      borderRadius: 17,
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    chipActive: {
      backgroundColor: theme.purple,
      borderColor: theme.purple,
    },
    chipText: {
      fontSize: 13,
      color: theme.textMuted,
    },
    chipTextActive: {
      color: '#FFFFFF',
    },

    // ── Feed ──────────────────────────────────────────────────────────────────
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 110,
    },

    // ── Listing Card ──────────────────────────────────────────────────────────
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
    distance: {
      color: theme.tealLight,
      fontSize: 11,
    },
    divider: {
      height: 1,
      backgroundColor: theme.divider,
      marginBottom: 12,
    },
    listingImageWrap: {
      position: 'relative',
      marginTop: 8,
      marginBottom: 12,
    },
    listingImage: {
      width: '100%',
      height: 160,
      borderRadius: 10,
      backgroundColor: theme.inputBg,
    },
    imageLoader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.inputBg,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
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

    // ── Skeleton ──────────────────────────────────────────────────────────────
    skeletonCard: {
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    skeletonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    skeletonAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.inputBg,
      marginRight: 10,
    },
    skeletonTextBlock: {
      flex: 1,
    },
    skeletonLine: {
      height: 11,
      borderRadius: 6,
      backgroundColor: theme.inputBg,
      marginBottom: 7,
    },
    skeletonLineShort: {
      width: '55%',
    },
    skeletonLineMed: {
      width: '75%',
    },
    skeletonDivider: {
      height: 1,
      backgroundColor: theme.inputBg,
      marginBottom: 12,
    },

    // ── Empty / Error states (mutually exclusive — rendered in place of the list) ─
    centerState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingTop: 60,
    },
    errorText: {
      color: theme.error,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 16,
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
    noMatchText: {
      color: theme.textMuted,
      fontSize: 15,
      textAlign: 'center',
    },

    // ── Footer loader ─────────────────────────────────────────────────────────
    footerLoader: {
      paddingVertical: 16,
      alignItems: 'center',
    },

    // ── FAB ───────────────────────────────────────────────────────────────────
    fab: {
      position: 'absolute',
      bottom: 100,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    fabText: {
      color: '#FFFFFF',
      fontSize: 28,
      lineHeight: 34,
    },
  });

export default getStyles;
