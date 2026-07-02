import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    // Bottom padding must clear the floating pill tab bar, which overlays
    // content (same 110px clearance as HomeScreen's listContent).
    scrollContent: {
      paddingBottom: 110,
    },

    // ── Header ───────────────────────────────────────────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 8,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    iconButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ── Hero (compact) ───────────────────────────────────────────────────────
    heroSection: {
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    avatarContainer: {
      position: 'relative',
      width: 80,
      height: 80,
      alignSelf: 'center',
    },
    avatarCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
      borderColor: theme.purple,
    },
    avatarInitials: {
      color: '#FFFFFF',
      fontSize: 28,
      fontWeight: 'bold',
    },
    uploadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 40,
      backgroundColor: 'rgba(0,0,0,0.45)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    editOverlay: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.cardBg,
      borderWidth: 2,
      borderColor: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    nameText: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.textPrimary,
      textAlign: 'center',
      marginTop: 10,
    },
    cityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      marginTop: 4,
    },
    cityText: {
      color: theme.textMuted,
      fontSize: 13,
    },
    memberSinceText: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 2,
      textAlign: 'center',
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    starsText: {
      fontSize: 18,
      letterSpacing: 2,
    },
    starFilled: {
      color: '#F5C518',
    },
    starEmpty: {
      color: theme.textMuted,
    },
    reviewCountText: {
      color: theme.textMuted,
      fontSize: 12,
      marginLeft: 6,
    },
    editProfileButton: {
      marginTop: 12,
      alignSelf: 'center',
      borderWidth: 1.5,
      borderColor: theme.purple,
      backgroundColor: 'transparent',
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 24,
    },
    editProfileButtonText: {
      color: theme.purple,
      fontSize: 14,
      fontWeight: '600',
    },

    // ── Stats row ────────────────────────────────────────────────────────────
    statsRow: {
      flexDirection: 'row',
      marginHorizontal: 20,
      gap: 8,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      padding: 14,
      alignItems: 'center',
    },
    statValue: {
      color: theme.textPrimary,
      fontSize: 24,
      fontWeight: 'bold',
    },
    statLabel: {
      color: theme.textMuted,
      fontSize: 11,
      marginTop: 4,
      textAlign: 'center',
    },

    // ── Shared card + section header pieces ──────────────────────────────────
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    sectionLink: {
      color: theme.teal,
      fontSize: 13,
      fontWeight: '500',
    },
    sectionDivider: {
      height: 1,
      backgroundColor: theme.divider,
      marginVertical: 14,
    },
    emptyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    emptyRowText: {
      fontSize: 13,
      color: theme.textMuted,
      fontStyle: 'italic',
    },
    emptyRowAction: {
      fontSize: 13,
      color: theme.teal,
      fontWeight: '600',
    },

    // ── Skills card ──────────────────────────────────────────────────────────
    skillsCard: {
      marginHorizontal: 20,
      marginTop: 16,
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      padding: 14,
    },
    skillsLabel: {
      color: theme.textMuted,
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    skillsDivider: {
      height: 1,
      backgroundColor: theme.divider,
      marginVertical: 10,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 6,
    },
    chipOffer: {
      backgroundColor: 'rgba(83,74,183,0.15)',
      borderWidth: 1,
      borderColor: theme.purple,
      borderRadius: 20,
      paddingVertical: 5,
      paddingHorizontal: 12,
    },
    chipOfferText: {
      color: theme.purple,
      fontSize: 13,
      fontWeight: '500',
    },
    chipWant: {
      backgroundColor: 'rgba(29,158,117,0.15)',
      borderWidth: 1,
      borderColor: theme.teal,
      borderRadius: 20,
      paddingVertical: 5,
      paddingHorizontal: 12,
    },
    chipWantText: {
      color: theme.teal,
      fontSize: 13,
      fontWeight: '500',
    },

    // ── Combined Listings + Reviews card ─────────────────────────────────────
    sectionCard: {
      marginHorizontal: 20,
      marginTop: 12,
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      padding: 16,
    },
    listingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
    },
    rowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    listingTextCol: {
      flex: 1,
      marginRight: 10,
    },
    listingOffer: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    listingWant: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 2,
    },
    activeBadge: {
      backgroundColor: 'rgba(29,158,117,0.12)',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    activeBadgeText: {
      color: theme.teal,
      fontSize: 11,
      fontWeight: '500',
    },
    reviewRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingTop: 2,
    },
    reviewAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
    },
    reviewAvatarText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
    reviewBody: {
      flex: 1,
      marginLeft: 10,
    },
    reviewTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    reviewName: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    reviewStars: {
      fontSize: 12,
      color: '#F5C518',
    },
    reviewComment: {
      fontSize: 13,
      color: theme.textMuted,
      marginTop: 3,
      lineHeight: 18,
    },
    pendingReviewText: {
      color: '#F5C518',
      fontSize: 11,
      fontWeight: '600',
      marginTop: 3,
    },

    // ── Quick actions (theme toggle lives here now) ──────────────────────────
    quickActionsCard: {
      marginHorizontal: 20,
      marginTop: 12,
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      overflow: 'hidden',
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    actionRowLast: {
      borderBottomWidth: 0,
    },
    actionIconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    actionLabel: {
      color: theme.textPrimary,
      fontSize: 15,
      flex: 1,
    },
    actionLabelCol: {
      flex: 1,
    },
    actionLabelPlain: {
      color: theme.textPrimary,
      fontSize: 15,
    },
    actionSub: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 1,
    },
    actionRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    actionChevron: {
      color: theme.textMuted,
      fontSize: 18,
    },
    actionCountBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
    },
    actionCountText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '700',
    },
    toggleTrackBase: {
      width: 48,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      padding: 2,
    },
    toggleThumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },

    // ── Sign out (subtle text link) + version ────────────────────────────────
    signOutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 16,
      marginTop: 8,
    },
    signOutText: {
      color: theme.error,
      fontSize: 15,
      fontWeight: '500',
    },
    versionText: {
      color: theme.textMuted,
      fontSize: 11,
      textAlign: 'center',
    },

    // ── Loading skeleton ─────────────────────────────────────────────────────
    skeletonAvatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.inputBg,
      alignSelf: 'center',
    },
    skeletonNameBar: {
      width: 140,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.inputBg,
      alignSelf: 'center',
      marginTop: 14,
    },
    skeletonCityBar: {
      width: 90,
      height: 14,
      borderRadius: 7,
      backgroundColor: theme.inputBg,
      alignSelf: 'center',
      marginTop: 8,
    },
    skeletonStatsRow: {
      flexDirection: 'row',
      marginHorizontal: 20,
      marginTop: 24,
      gap: 8,
    },
    skeletonStatCard: {
      flex: 1,
      height: 74,
      borderRadius: 16,
      backgroundColor: theme.inputBg,
    },
  });

export default getStyles;
