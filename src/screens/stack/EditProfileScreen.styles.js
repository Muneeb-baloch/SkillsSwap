import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    flexFill: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },

    // ── Header ──────────────────────────────────────────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 12,
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    headerLeft: {
      width: 40,
      alignItems: 'flex-start',
    },
    headerRight: {
      width: 60,
      alignItems: 'flex-end',
    },
    backButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    saveText: {
      color: theme.purple,
      fontSize: 16,
      fontWeight: '700',
    },

    // ── Avatar ──────────────────────────────────────────────────────────────
    avatarWrap: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    avatarContainer: {
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
    changePhotoText: {
      color: theme.purple,
      fontSize: 14,
      fontWeight: '600',
      marginTop: 12,
    },
    uploadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
    },
    uploadingText: {
      color: theme.textMuted,
      fontSize: 13,
    },

    // ── Shared section label ───────────────────────────────────────────────
    sectionLabel: {
      color: theme.textMuted,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginTop: 20,
      marginBottom: 10,
    },
    sectionSubtext: {
      color: theme.textMuted,
      fontSize: 12,
      marginBottom: 10,
    },

    // ── Shared text input ──────────────────────────────────────────────────
    input: {
      backgroundColor: theme.inputBg,
      borderRadius: 12,
      height: 52,
      paddingHorizontal: 14,
      color: theme.textPrimary,
      fontSize: 14,
      borderWidth: 1.5,
      borderColor: 'rgba(83,74,183,0.25)',
      marginBottom: 12,
    },
    inputNoMargin: {
      marginBottom: 4,
    },
    inputFocused: {
      borderColor: theme.purple,
    },
    bioInput: {
      height: 100,
      textAlignVertical: 'top',
      paddingTop: 12,
    },
    charCountRow: {
      alignItems: 'flex-end',
      marginBottom: 12,
    },
    charCountText: {
      color: theme.textMuted,
      fontSize: 11,
    },

    // ── Skills tag input ────────────────────────────────────────────────────
    skillInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    skillTextInput: {
      flex: 1,
      backgroundColor: theme.inputBg,
      borderRadius: 12,
      height: 46,
      paddingHorizontal: 14,
      color: theme.textPrimary,
      fontSize: 14,
      borderWidth: 1.5,
      borderColor: 'rgba(83,74,183,0.25)',
    },
    addSkillButton: {
      marginLeft: 8,
      backgroundColor: theme.purple,
      borderRadius: 12,
      width: 46,
      height: 46,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addSkillButtonDisabled: {
      opacity: 0.4,
    },
    addSkillButtonText: {
      color: '#FFFFFF',
      fontSize: 22,
      lineHeight: 22,
    },
    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 10,
    },
    tagPillOffer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(83,74,183,0.15)',
      borderWidth: 1,
      borderColor: theme.purple,
      borderRadius: 20,
      paddingVertical: 7,
      paddingHorizontal: 14,
    },
    tagTextOffer: {
      color: theme.purple,
      fontSize: 13,
      fontWeight: '500',
    },
    tagRemoveOffer: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: 'rgba(83,74,183,0.3)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tagPillWant: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(29,158,117,0.15)',
      borderWidth: 1,
      borderColor: theme.teal,
      borderRadius: 20,
      paddingVertical: 7,
      paddingHorizontal: 14,
    },
    tagTextWant: {
      color: theme.teal,
      fontSize: 13,
      fontWeight: '500',
    },
    tagRemoveWant: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: 'rgba(29,158,117,0.3)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tagRemoveText: {
      color: '#FFFFFF',
      fontSize: 12,
      textAlign: 'center',
    },

    // ── Availability ────────────────────────────────────────────────────────
    availabilityLabel: {
      color: theme.textMuted,
      fontSize: 12,
      marginBottom: 8,
    },
    daysRow: {
      flexDirection: 'row',
      gap: 6,
    },
    timesRow: {
      flexDirection: 'row',
      gap: 6,
      marginTop: 12,
    },
    optionChip: {
      flex: 1,
      height: 38,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionChipSelected: {
      backgroundColor: theme.purple,
    },
    optionChipUnselected: {
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: 'rgba(83,74,183,0.2)',
    },
    optionChipTextSelected: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    optionChipTextUnselected: {
      color: theme.textMuted,
      fontSize: 12,
    },

    // ── Social links ────────────────────────────────────────────────────────
    socialInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBg,
      borderRadius: 12,
      height: 52,
      marginBottom: 12,
      borderWidth: 1.5,
      borderColor: 'rgba(83,74,183,0.25)',
    },
    socialInputRowFocused: {
      borderColor: theme.purple,
    },
    socialIconBox: {
      width: 46,
      alignItems: 'center',
      justifyContent: 'center',
      borderRightWidth: 1,
      borderRightColor: theme.divider,
    },
    socialIconTextLinkedin: {
      color: '#0A66C2',
      fontWeight: '700',
      fontSize: 14,
    },
    socialIconTextWhatsapp: {
      color: '#25D366',
      fontWeight: '700',
      fontSize: 14,
    },
    socialTextInput: {
      flex: 1,
      paddingHorizontal: 12,
      color: theme.textPrimary,
      fontSize: 14,
    },

    // ── Loading skeleton ────────────────────────────────────────────────────
    skeletonAvatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: theme.inputBg,
      alignSelf: 'center',
      marginTop: 24,
      marginBottom: 24,
    },
    skeletonInputBar: {
      width: '100%',
      height: 52,
      borderRadius: 12,
      backgroundColor: theme.inputBg,
      marginBottom: 12,
    },
  });

export default getStyles;
