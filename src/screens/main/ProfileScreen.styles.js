import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingBottom: 20,
    },

    // ── Section 1: Header ──────────────────────────────────────────────────
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

    // ── Section 2: Profile hero ─────────────────────────────────────────────
    heroSection: {
      alignItems: 'center',
      paddingVertical: 24,
      paddingHorizontal: 20,
    },
    avatarContainer: {
      position: 'relative',
      width: 96,
      height: 96,
      alignSelf: 'center',
    },
    avatarCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarImage: {
      width: 96,
      height: 96,
      borderRadius: 48,
      borderWidth: 3,
      borderColor: theme.purple,
    },
    avatarInitials: {
      color: '#FFFFFF',
      fontSize: 32,
      fontWeight: 'bold',
    },
    uploadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 48,
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
      fontSize: 22,
      fontWeight: '700',
      color: theme.textPrimary,
      textAlign: 'center',
      marginTop: 12,
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
      marginTop: 10,
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
      marginTop: 16,
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

    // ── Section 3: Stats row ─────────────────────────────────────────────────
    statsRow: {
      flexDirection: 'row',
      marginHorizontal: 20,
      marginBottom: 16,
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

    // ── Shared section header (skills / listings / reviews / quick actions) ──
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    sectionTitleSm: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    sectionLink: {
      color: theme.teal,
      fontSize: 13,
    },

    // ── Section 4: Skills ───────────────────────────────────────────────────
    skillsSection: {
      marginHorizontal: 20,
      marginBottom: 16,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    skillsGroupOffer: {
      marginTop: 10,
    },
    skillsGroupWant: {
      marginTop: 12,
    },
    skillsLabel: {
      color: theme.textMuted,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
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
      paddingVertical: 6,
      paddingHorizontal: 14,
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
      paddingVertical: 6,
      paddingHorizontal: 14,
    },
    chipWantText: {
      color: theme.teal,
      fontSize: 13,
      fontWeight: '500',
    },
    noSkillsText: {
      color: theme.textMuted,
      fontSize: 13,
      fontStyle: 'italic',
      marginTop: 6,
    },

    // ── Section 5: Appearance / theme toggle ──────────────────────────────────
    appearanceCard: {
      marginHorizontal: 20,
      marginBottom: 16,
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      overflow: 'hidden',
    },
    appearanceHeader: {
      padding: 16,
      paddingBottom: 8,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    themeIconLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    themeLabelCol: {
      marginLeft: 10,
    },
    themeLabelTitle: {
      color: theme.textPrimary,
      fontSize: 15,
    },
    themeLabelSub: {
      color: theme.textMuted,
      fontSize: 12,
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

    // ── Section 6: Listings preview ───────────────────────────────────────────
    listingsCard: {
      marginHorizontal: 20,
      marginBottom: 16,
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      overflow: 'hidden',
    },
    cardHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      paddingBottom: 8,
    },
    miniListingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
    },
    miniListingLeft: {
      flex: 1,
      marginRight: 10,
    },
    miniListingOffer: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '700',
    },
    miniListingWant: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    miniBadgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    miniDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    miniDotActive: {
      backgroundColor: theme.teal,
    },
    miniDotInactive: {
      backgroundColor: theme.textMuted,
    },
    miniBadgeTextActive: {
      color: theme.teal,
      fontSize: 11,
    },
    miniBadgeTextInactive: {
      color: theme.textMuted,
      fontSize: 11,
    },
    emptyCardWrap: {
      padding: 20,
      alignItems: 'center',
    },
    emptyCardText: {
      color: theme.textMuted,
      fontSize: 14,
    },
    emptyCardLink: {
      color: theme.purple,
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 8,
    },

    // ── Section 7: Reviews preview ─────────────────────────────────────────────
    reviewsCard: {
      marginHorizontal: 20,
      marginBottom: 16,
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      overflow: 'hidden',
    },
    reviewRow: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
    },
    reviewTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    reviewAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    reviewAvatarText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
    reviewNameStarsCol: {
      flex: 1,
    },
    reviewName: {
      color: theme.textPrimary,
      fontSize: 13,
      fontWeight: 'bold',
    },
    reviewStars: {
      color: '#F5C518',
      fontSize: 11,
      marginTop: 1,
    },
    reviewTime: {
      color: theme.textMuted,
      fontSize: 11,
    },
    reviewComment: {
      color: theme.textMuted,
      fontSize: 13,
      marginTop: 6,
    },
    pendingReviewText: {
      color: '#F5C518',
      fontSize: 11,
      fontWeight: '600',
      marginTop: 6,
    },
    emptyReviewsText: {
      color: theme.textMuted,
      fontSize: 14,
      padding: 20,
      textAlign: 'center',
    },

    // ── Section 8: Quick actions ───────────────────────────────────────────────
    quickActionsCard: {
      marginHorizontal: 20,
      marginBottom: 16,
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
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    actionLabel: {
      color: theme.textPrimary,
      fontSize: 15,
      flex: 1,
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
      minWidth: 18,
      height: 18,
      borderRadius: 10,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
    },
    actionCountText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: 'bold',
    },

    // ── Section 9: Sign out ────────────────────────────────────────────────────
    signOutButton: {
      marginHorizontal: 20,
      marginTop: 8,
      backgroundColor: 'rgba(226,75,74,0.1)',
      borderWidth: 1.5,
      borderColor: theme.error,
      borderRadius: 14,
      height: 54,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    signOutText: {
      color: theme.error,
      fontSize: 16,
      fontWeight: '700',
      marginLeft: 8,
    },
    versionText: {
      color: theme.textMuted,
      fontSize: 11,
      textAlign: 'center',
      marginTop: 12,
    },

    // ── Loading skeleton ─────────────────────────────────────────────────────
    skeletonAvatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
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
