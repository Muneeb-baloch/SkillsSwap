import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingBottom: 110,
    },
    loadingWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background,
    },
    missingWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background,
      paddingHorizontal: 24,
    },
    missingText: {
      color: theme.textMuted,
      fontSize: 15,
      textAlign: 'center',
    },

    // ── Header ──────────────────────────────────────────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 12,
      paddingHorizontal: 20,
      paddingBottom: 12,
      backgroundColor: theme.background,
    },
    headerButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: 'bold',
    },
    moreButtonText: {
      color: theme.textMuted,
      fontSize: 22,
    },

    // ── Hero ────────────────────────────────────────────────────────────────
    heroSection: {
      backgroundColor: theme.background,
      paddingTop: 24,
      paddingBottom: 20,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    avatarImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
      borderColor: theme.purple,
    },
    avatarCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitials: {
      color: '#FFFFFF',
      fontSize: 26,
      fontWeight: 'bold',
    },
    nameText: {
      color: theme.textPrimary,
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 12,
      textAlign: 'center',
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
    },
    locationText: {
      color: theme.textMuted,
      fontSize: 13,
    },
    bioText: {
      color: theme.textSecondary,
      fontSize: 13,
      textAlign: 'center',
      marginTop: 8,
      paddingHorizontal: 20,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    stars: {
      fontSize: 18,
      letterSpacing: 2,
      color: '#F5C518',
    },
    ratingText: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '700',
      marginLeft: 6,
    },
    reviewCount: {
      color: theme.textMuted,
      fontSize: 12,
      marginLeft: 4,
    },
    noRatingText: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 6,
    },
    memberSinceText: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 4,
      textAlign: 'center',
    },
    heroDivider: {
      height: 1,
      backgroundColor: theme.divider,
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 4,
    },

    // ── Stats row ───────────────────────────────────────────────────────────
    statsRow: {
      flexDirection: 'row',
      marginHorizontal: 20,
      marginTop: 20,
      gap: 8,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.divider,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    statLabel: {
      fontSize: 11,
      color: theme.textMuted,
      marginTop: 4,
      textAlign: 'center',
    },

    // ── Shared section card (skills / listings / reviews) ─────────────────
    sectionCard: {
      marginHorizontal: 20,
      marginTop: 16,
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.divider,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 14,
    },

    // ── Skills section ──────────────────────────────────────────────────────
    skillsSubLabel: {
      fontSize: 10,
      fontWeight: '500',
      color: theme.textMuted,
      letterSpacing: 0.8,
      marginBottom: 8,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    offerChip: {
      backgroundColor: 'rgba(83,74,183,0.12)',
      borderWidth: 1,
      borderColor: theme.purple,
      borderRadius: 20,
      paddingVertical: 5,
      paddingHorizontal: 12,
    },
    offerChipText: {
      color: theme.purple,
      fontSize: 13,
      fontWeight: '500',
    },
    wantChip: {
      backgroundColor: 'rgba(29,158,117,0.12)',
      borderWidth: 1,
      borderColor: theme.teal,
      borderRadius: 20,
      paddingVertical: 5,
      paddingHorizontal: 12,
    },
    wantChipText: {
      color: theme.teal,
      fontSize: 13,
      fontWeight: '500',
    },
    skillsDivider: {
      height: 1,
      backgroundColor: theme.divider,
      marginVertical: 12,
    },
    emptySkillText: {
      color: theme.textMuted,
      fontSize: 13,
      fontStyle: 'italic',
    },

    // ── Active listings section ────────────────────────────────────────────
    listingRow: {
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    listingRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    listingLeftCol: {
      flex: 1,
    },
    listingOfferSkill: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    listingWantSkill: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 3,
    },
    emptyListingState: {
      paddingVertical: 12,
      alignItems: 'center',
    },
    emptyStateTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textMuted,
    },
    emptyStateSubtitle: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 4,
      textAlign: 'center',
    },

    // ── Reviews section ─────────────────────────────────────────────────────
    reviewRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 12,
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
    reviewerName: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    reviewStars: {
      fontSize: 11,
      color: '#F5C518',
      letterSpacing: 1,
    },
    reviewComment: {
      fontSize: 13,
      color: theme.textMuted,
      marginTop: 4,
      lineHeight: 18,
    },

    // ── Bottom CTA bar ──────────────────────────────────────────────────────
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.background,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
      paddingHorizontal: 20,
      paddingTop: 12,
    },
    ownProfileBar: {
      alignItems: 'center',
      gap: 10,
    },
    ownProfileText: {
      color: theme.textMuted,
      fontSize: 13,
    },
    editProfileBtn: {
      width: '100%',
      height: 50,
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: theme.purple,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editProfileBtnText: {
      color: theme.purple,
      fontSize: 15,
      fontWeight: '700',
    },
    ctaRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    messageButton: {
      flex: 1,
      height: 50,
      borderWidth: 1.5,
      borderColor: theme.purple,
      backgroundColor: 'transparent',
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    messageButtonText: {
      color: theme.purple,
      fontSize: 15,
      fontWeight: '700',
    },
    requestSwapButton: {
      flex: 1,
      height: 50,
      marginLeft: 10,
      backgroundColor: theme.purple,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    requestSwapButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },
  });

export default getStyles;
