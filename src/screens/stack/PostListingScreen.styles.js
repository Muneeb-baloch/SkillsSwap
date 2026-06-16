import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    // ── Header ────────────────────────────────────────────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    headerRightSpacer: {
      width: 40,
      height: 40,
    },

    // ── Progress indicator ───────────────────────────────────────────────────────
    progressRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: 32,
      marginTop: 4,
      marginBottom: 20,
    },
    stepDotColumn: {
      alignItems: 'center',
    },
    stepDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepDotActive: {
      backgroundColor: theme.purple,
    },
    stepDotDone: {
      backgroundColor: theme.teal,
    },
    stepDotUpcoming: {
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.textMuted,
    },
    stepDotCheck: {
      color: '#FFFFFF',
      fontSize: 8,
    },
    stepLine: {
      flex: 1,
      height: 1,
      marginTop: 5,
      marginHorizontal: 4,
    },
    stepLineDone: {
      backgroundColor: theme.teal,
    },
    stepLineUpcoming: {
      backgroundColor: theme.inputBg,
    },
    stepLabel: {
      fontSize: 10,
      color: theme.textMuted,
      marginTop: 6,
      textAlign: 'center',
      width: 70,
    },
    stepLabelActive: {
      color: theme.textPrimary,
    },

    // ── Scroll content ───────────────────────────────────────────────────────────
    scrollContent: {
      paddingTop: 4,
      paddingBottom: 24,
    },

    // ── Section card ──────────────────────────────────────────────────────────────
    card: {
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 20,
      marginBottom: 12,
    },
    cardHeaderRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      marginBottom: 16,
    },
    cardHeaderTextWrap: {
      flex: 1,
    },
    cardTitle: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    cardSubtitle: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 2,
    },

    // ── Field label / group ──────────────────────────────────────────────────────
    fieldGroup: {
      marginBottom: 16,
    },
    fieldLabel: {
      color: theme.textMuted,
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 8,
    },

    // ── Category chip picker ─────────────────────────────────────────────────────
    chipScrollContent: {
      paddingRight: 8,
    },
    categoryChip: {
      height: 34,
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    categoryChipActive: {
      backgroundColor: theme.purple,
      borderColor: theme.purple,
    },
    categoryChipText: {
      fontSize: 13,
      color: theme.textMuted,
    },
    categoryChipTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },

    // ── Text inputs ───────────────────────────────────────────────────────────────
    input: {
      backgroundColor: theme.inputBg,
      borderWidth: 1.5,
      borderColor: 'rgba(83,74,183,0.3)',
      borderRadius: 12,
      height: 52,
      color: theme.textPrimary,
      fontSize: 14,
      paddingHorizontal: 14,
    },
    inputFocused: {
      borderColor: theme.purple,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
      paddingTop: 12,
    },
    charCount: {
      color: theme.textMuted,
      fontSize: 11,
      textAlign: 'right',
      marginTop: 4,
    },
    charCountError: {
      color: theme.error,
    },

    // ── Side-by-side option rows (experience level / flexibility / time) ──────────
    levelOptionsRow: {
      flexDirection: 'row',
      gap: 8,
    },
    levelOption: {
      flex: 1,
      minHeight: 40,
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderRadius: 10,
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.divider,
      alignItems: 'center',
      justifyContent: 'center',
    },
    levelOptionActive: {
      backgroundColor: 'rgba(83,74,183,0.2)',
      borderWidth: 1.5,
      borderColor: theme.purple,
    },
    levelOptionText: {
      color: theme.textMuted,
      fontSize: 13,
      textAlign: 'center',
    },
    levelOptionTextActive: {
      color: theme.purpleLight,
      fontWeight: '600',
    },

    // ── Preferred format chips (multi-select, wrap) ────────────────────────────────
    formatWrapRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    formatChip: {
      height: 36,
      paddingHorizontal: 12,
      margin: 4,
      borderRadius: 10,
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.divider,
      alignItems: 'center',
      justifyContent: 'center',
    },
    formatChipActive: {
      backgroundColor: theme.teal,
      borderColor: theme.teal,
    },
    formatChipText: {
      color: theme.textMuted,
      fontSize: 13,
    },
    formatChipTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },

    // ── Day chips ─────────────────────────────────────────────────────────────────
    dayRow: {
      flexDirection: 'row',
    },
    dayChip: {
      flex: 1,
      height: 36,
      marginHorizontal: 3,
      borderRadius: 8,
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.divider,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayChipActive: {
      backgroundColor: theme.purple,
      borderColor: theme.purple,
    },
    dayChipText: {
      color: theme.textMuted,
      fontSize: 12,
    },
    dayChipTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },

    // ── Photo upload ──────────────────────────────────────────────────────────────
    photoPickerEmpty: {
      height: 140,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.divider,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
    },
    photoIconWrap: {
      marginBottom: 8,
    },
    photoText: {
      color: theme.textMuted,
      fontSize: 14,
    },
    photoSubtext: {
      color: theme.textMuted,
      fontSize: 11,
      marginTop: 4,
    },
    photoPreviewWrap: {
      position: 'relative',
      height: 140,
      borderRadius: 12,
      overflow: 'hidden',
    },
    photoPreviewImage: {
      width: '100%',
      height: 140,
      borderRadius: 12,
    },
    photoRemoveBtn: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.cardBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    photoRemoveBtnText: {
      color: theme.textPrimary,
      fontSize: 16,
      lineHeight: 16,
    },

    // ── Location ──────────────────────────────────────────────────────────────────
    locationRow: {
      flexDirection: 'row',
      gap: 8,
    },
    locationInput: {
      flex: 1,
    },
    locationLinkRow: {
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 4,
    },
    locationLinkBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    locationLink: {
      color: theme.tealLight,
      fontSize: 13,
    },
    locationError: {
      color: theme.error,
      fontSize: 12,
      textAlign: 'center',
      marginTop: 6,
    },

    // ── Preview ───────────────────────────────────────────────────────────────────
    previewSection: {
      marginHorizontal: 20,
      marginBottom: 12,
    },
    previewHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 10,
    },
    previewLabel: {
      color: theme.textMuted,
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    pulseDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.teal,
    },
    previewCard: {
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      padding: 16,
    },
    previewTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    previewAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    previewAvatarText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: 'bold',
    },
    previewUserInfo: {
      flex: 1,
    },
    previewUserName: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: 'bold',
    },
    previewUserCity: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    previewDivider: {
      height: 1,
      backgroundColor: theme.divider,
      marginBottom: 12,
    },
    previewSkillRow: {
      marginBottom: 8,
    },
    previewSkillLabel: {
      color: theme.textMuted,
      fontSize: 11,
      textTransform: 'uppercase',
      marginBottom: 2,
      letterSpacing: 0.4,
    },
    previewOfferText: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: 'bold',
    },
    previewWantText: {
      color: theme.purpleLight,
      fontSize: 14,
    },
    previewBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    previewTimeText: {
      color: theme.textMuted,
      fontSize: 11,
    },
    previewCtaText: {
      color: theme.teal,
      fontSize: 13,
      fontWeight: 'bold',
    },

    // ── Error banner ──────────────────────────────────────────────────────────────
    errorBanner: {
      backgroundColor: 'rgba(226,75,74,0.1)',
      borderWidth: 1,
      borderColor: theme.error,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 14,
      marginHorizontal: 20,
      marginBottom: 8,
    },
    errorBannerText: {
      color: theme.error,
      fontSize: 13,
    },

    // ── Bottom action bar ─────────────────────────────────────────────────────────
    bottomBar: {
      backgroundColor: theme.background,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    bottomBarRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backLink: {
      color: theme.textMuted,
      fontSize: 15,
      paddingVertical: 14,
      paddingHorizontal: 4,
    },
    nextButton: {
      flex: 1,
      height: 50,
      backgroundColor: theme.purple,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 12,
    },
    nextButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    publishButton: {
      height: 54,
      backgroundColor: theme.teal,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    publishButtonDisabled: {
      opacity: 0.7,
    },
    publishButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    publishHint: {
      color: theme.textMuted,
      fontSize: 11,
      textAlign: 'center',
      marginBottom: 8,
    },
  });

export default getStyles;
