import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingBottom: 0,
    },
    bottomSpacer: {
      height: 100,
    },

    // ── Missing listing guard ──────────────────────────────────────────────
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

    // ── Part 1: Hero ──────────────────────────────────────────────────────
    heroSection: {
      height: 260,
      position: 'relative',
      backgroundColor: theme.cardBg,
    },
    heroImage: {
      width: '100%',
      height: 260,
    },
    heroImageLoader: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroFallbackBase: {
      ...StyleSheet.absoluteFillObject,
      // Fixed brand purple (same value in both themes) rather than theme.cardBg —
      // guarantees the white ghost letter/chip/icons below stay legible in light mode.
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroFallbackTint: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.12)',
    },
    heroFallbackContent: {
      alignItems: 'center',
    },
    heroAvatarCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroAvatarInitials: {
      color: '#FFFFFF',
      fontSize: 28,
      fontWeight: '800',
    },
    heroSkillText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center',
      paddingHorizontal: 30,
      marginTop: 12,
    },
    heroCategoryChip: {
      marginTop: 8,
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.55)',
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    heroCategoryChipText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600',
    },
    circleButtonBase: {
      position: 'absolute',
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      // Always a translucent black circle — both the photo hero and the fixed-purple
      // fallback hero are dark/saturated enough for the white icon to read clearly.
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    backButtonPosition: {
      left: 16,
    },
    shareButtonPosition: {
      right: 16,
    },

    // ── Part 2: Poster info row ───────────────────────────────────────────
    posterRow: {
      marginTop: -20,
      marginHorizontal: 20,
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 10,
    },
    posterAvatarImage: {
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 2,
      borderColor: theme.background,
    },
    posterAvatarFallback: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
    },
    posterAvatarInitial: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: 'bold',
    },
    posterInfo: {
      flex: 1,
      marginLeft: 12,
    },
    posterName: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    posterCityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 2,
    },
    posterCityText: {
      color: theme.textMuted,
      fontSize: 12,
    },
    posterRatingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    posterStars: {
      fontSize: 13,
      letterSpacing: 1,
    },
    starFilled: {
      color: '#F5C518',
    },
    starEmpty: {
      color: theme.textMuted,
    },
    posterReviewsText: {
      color: theme.textMuted,
      fontSize: 11,
      marginLeft: 4,
    },
    viewProfileButton: {
      borderWidth: 1,
      borderColor: theme.purple,
      borderRadius: 10,
      paddingVertical: 7,
      paddingHorizontal: 12,
    },
    viewProfileButtonText: {
      color: theme.purple,
      fontSize: 12,
      fontWeight: '600',
    },

    // ── Part 3: Swap details card ─────────────────────────────────────────
    swapCard: {
      marginHorizontal: 20,
      marginTop: 16,
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      padding: 16,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    swapRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
    },
    swapBoxOffer: {
      flex: 1,
      backgroundColor: 'rgba(83,74,183,0.1)',
      borderWidth: 1,
      borderColor: 'rgba(83,74,183,0.3)',
      borderRadius: 12,
      padding: 12,
    },
    swapBoxWant: {
      flex: 1,
      backgroundColor: 'rgba(29,158,117,0.1)',
      borderWidth: 1,
      borderColor: 'rgba(29,158,117,0.3)',
      borderRadius: 12,
      padding: 12,
    },
    swapBoxLabel: {
      color: theme.textMuted,
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 6,
    },
    swapOfferSkillText: {
      color: theme.purple,
      fontSize: 14,
      fontWeight: '700',
    },
    swapWantSkillText: {
      color: theme.teal,
      fontSize: 14,
      fontWeight: '700',
    },
    swapOfferBadge: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(83,74,183,0.2)',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
      marginTop: 6,
    },
    swapOfferBadgeText: {
      color: theme.purpleLight,
      fontSize: 11,
      fontWeight: '500',
    },
    swapWantBadge: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(29,158,117,0.2)',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
      marginTop: 6,
    },
    swapWantBadgeText: {
      color: theme.tealLight,
      fontSize: 11,
      fontWeight: '500',
    },
    swapIconWrap: {
      marginHorizontal: 10,
    },
    descriptionWrap: {
      marginTop: 14,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
      paddingTop: 14,
    },
    descriptionLabel: {
      color: theme.textMuted,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    descriptionText: {
      color: theme.textSecondary,
      fontSize: 14,
      lineHeight: 22,
      marginTop: 6,
    },

    // ── Part 4: Details card ──────────────────────────────────────────────
    detailsCard: {
      marginHorizontal: 20,
      marginTop: 12,
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      padding: 16,
    },
    detailsTitle: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: '700',
      marginBottom: 14,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    detailRowLast: {
      borderBottomWidth: 0,
    },
    detailIconBox: {
      width: 34,
      height: 34,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    detailTextCol: {
      flex: 1,
    },
    detailLabel: {
      color: theme.textMuted,
      fontSize: 12,
    },
    detailValue: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '500',
      marginTop: 2,
    },
    detailValueSub: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 8,
      paddingVertical: 10,
    },
    statChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: theme.inputBg,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 7,
    },
    statChipText: {
      color: theme.textMuted,
      fontSize: 12,
    },

    // ── Part 5: Similar listings ──────────────────────────────────────────
    similarSection: {
      marginHorizontal: 20,
      marginTop: 12,
      marginBottom: 100,
    },
    similarScrollContent: {
      paddingTop: 12,
      paddingRight: 8,
    },
    similarCard: {
      width: 200,
      marginRight: 12,
      backgroundColor: theme.cardBg,
      borderRadius: 14,
      padding: 14,
    },
    similarAvatarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    similarAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
    },
    similarAvatarText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: 'bold',
    },
    similarUserName: {
      flex: 1,
      color: theme.textPrimary,
      fontSize: 13,
      fontWeight: 'bold',
    },
    similarOfferSkill: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 8,
    },
    similarWantSkill: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 4,
    },
    similarBottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
    similarCity: {
      color: theme.textMuted,
      fontSize: 11,
    },
    similarViewLink: {
      color: theme.teal,
      fontSize: 12,
      fontWeight: 'bold',
    },

    // ── Part 6: Bottom action bar ──────────────────────────────────────────
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
    bottomBarRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    editButton: {
      flex: 1,
      height: 52,
      borderWidth: 1.5,
      borderColor: theme.purple,
      backgroundColor: 'transparent',
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editButtonText: {
      color: theme.purple,
      fontSize: 15,
      fontWeight: '700',
    },
    toggleActiveButton: {
      marginLeft: 10,
      height: 52,
      width: 120,
      borderRadius: 14,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toggleActiveButtonPause: {
      backgroundColor: 'rgba(226,75,74,0.1)',
      borderColor: theme.error,
    },
    toggleActiveButtonReactivate: {
      backgroundColor: 'rgba(29,158,117,0.1)',
      borderColor: theme.teal,
    },
    toggleActiveTextPause: {
      color: theme.error,
      fontSize: 14,
      fontWeight: '700',
    },
    toggleActiveTextReactivate: {
      color: theme.teal,
      fontSize: 14,
      fontWeight: '700',
    },
    requestButton: {
      flex: 1,
      height: 54,
      backgroundColor: theme.purple,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    requestButtonDisabled: {
      opacity: 0.5,
    },
    requestButtonAlready: {
      backgroundColor: 'rgba(83,74,183,0.3)',
    },
    requestButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    pendingHintText: {
      color: theme.textMuted,
      fontSize: 12,
      textAlign: 'center',
      marginTop: 8,
    },

    // ── Request modal ──────────────────────────────────────────────────────
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'flex-end',
    },
    modalDismissArea: {
      flex: 1,
    },
    modalSheet: {
      backgroundColor: theme.cardBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
    },
    modalDragHandle: {
      width: 40,
      height: 4,
      backgroundColor: theme.divider,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    modalSubtitle: {
      color: theme.textMuted,
      fontSize: 14,
      marginBottom: 20,
    },
    modalSectionLabel: {
      color: theme.textMuted,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 8,
    },
    noSkillsWarning: {
      backgroundColor: 'rgba(226,75,74,0.1)',
      borderWidth: 1,
      borderColor: theme.error,
      borderRadius: 12,
      padding: 12,
    },
    noSkillsWarningText: {
      color: theme.error,
      fontSize: 13,
    },
    noSkillsLink: {
      color: theme.error,
      fontSize: 13,
      fontWeight: '700',
      marginTop: 8,
    },
    skillChipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    skillChip: {
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.divider,
      borderRadius: 20,
      paddingVertical: 7,
      paddingHorizontal: 14,
    },
    skillChipSelected: {
      backgroundColor: theme.purple,
      borderColor: theme.purple,
    },
    skillChipText: {
      color: theme.textMuted,
      fontSize: 13,
      fontWeight: '500',
    },
    skillChipTextSelected: {
      color: '#FFFFFF',
    },
    skillHint: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 8,
    },
    messageInputLabel: {
      color: theme.textMuted,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginTop: 16,
      marginBottom: 8,
    },
    messageInput: {
      backgroundColor: theme.inputBg,
      borderRadius: 12,
      height: 90,
      paddingHorizontal: 14,
      paddingTop: 12,
      color: theme.textPrimary,
      fontSize: 14,
      textAlignVertical: 'top',
      borderWidth: 1.5,
      borderColor: 'rgba(83,74,183,0.25)',
    },
    sendButton: {
      height: 52,
      backgroundColor: theme.purple,
      borderRadius: 14,
      marginTop: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
    sendButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
  });

export default getStyles;
