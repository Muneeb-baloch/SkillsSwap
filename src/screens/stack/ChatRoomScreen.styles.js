import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    flex: {
      flex: 1,
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    backButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backText: {
      color: theme.textPrimary,
      fontSize: 24,
    },
    headerCenter: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 4,
    },
    headerAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    headerAvatarImage: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.inputBg,
      marginRight: 10,
    },
    headerAvatarText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: 'bold',
    },
    headerName: {
      flex: 1,
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    completeButton: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: 'rgba(29,158,117,0.15)',
    },
    completeText: {
      color: theme.teal,
      fontSize: 13,
      fontWeight: '700',
    },

    // Completion button placeholder (keeps header centered when ✓ is hidden)
    completeButtonPlaceholder: {
      width: 64,
    },

    // ── Swap status banner ──────────────────────────────────────────────────
    statusBanner: {
      marginHorizontal: 14,
      marginTop: 12,
      borderRadius: 12,
      padding: 12,
    },
    bannerAccepted: {
      backgroundColor: 'rgba(83,74,183,0.1)',
    },
    bannerWaiting: {
      backgroundColor: 'rgba(245,197,24,0.1)',
    },
    bannerConfirm: {
      backgroundColor: 'rgba(83,74,183,0.1)',
    },
    bannerCompleted: {
      backgroundColor: 'rgba(29,158,117,0.1)',
    },
    bannerDisputed: {
      backgroundColor: 'rgba(226,75,74,0.1)',
    },
    bannerCancelled: {
      backgroundColor: 'rgba(136,135,128,0.1)',
    },
    bannerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bannerIcon: {
      fontSize: 13,
      marginRight: 6,
    },
    purpleDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.purple,
      marginRight: 8,
    },
    bannerText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 17,
    },
    bannerTextGold: {
      color: '#F5C518',
    },
    bannerTextPurple: {
      color: theme.purple,
    },
    bannerTextTeal: {
      color: theme.teal,
      fontWeight: '700',
    },
    bannerTextError: {
      color: theme.error,
    },
    bannerSubRow: {
      marginTop: 4,
    },
    bannerSubText: {
      color: theme.textMuted,
      fontSize: 12,
    },
    bannerSubMuted: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 4,
    },
    reviewLink: {
      color: theme.teal,
      fontSize: 12,
      fontWeight: '700',
      marginTop: 2,
    },
    autoText: {
      color: theme.textMuted,
      fontSize: 11,
      marginTop: 6,
    },
    bannerActions: {
      flexDirection: 'row',
      marginTop: 8,
    },
    confirmBtn: {
      backgroundColor: theme.teal,
      borderRadius: 10,
      height: 36,
      paddingHorizontal: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    confirmBtnText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600',
    },
    disputeBtn: {
      borderWidth: 1,
      borderColor: theme.error,
      borderRadius: 10,
      height: 36,
      paddingHorizontal: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disputeBtnText: {
      color: theme.error,
      fontSize: 13,
      fontWeight: '600',
    },
    supportLink: {
      color: theme.textMuted,
      fontSize: 11,
      textDecorationLine: 'underline',
      marginTop: 6,
    },
    cancelledText: {
      color: theme.textMuted,
      fontSize: 12,
      textAlign: 'center',
    },

    // ── System message ──────────────────────────────────────────────────────
    systemRow: {
      alignItems: 'center',
      marginVertical: 8,
      paddingHorizontal: 20,
    },
    systemBubble: {
      backgroundColor: theme.inputBg,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    systemText: {
      color: theme.textMuted,
      fontSize: 12,
      textAlign: 'center',
      lineHeight: 17,
    },

    // Context card (original swap request)
    contextCard: {
      marginHorizontal: 14,
      marginTop: 12,
      backgroundColor: theme.cardBg,
      borderRadius: 12,
      padding: 12,
      borderLeftWidth: 3,
      borderLeftColor: theme.purple,
    },
    contextTitle: {
      color: theme.textMuted,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    contextLine: {
      color: theme.textMuted,
      fontSize: 13,
      lineHeight: 19,
    },
    contextName: {
      color: theme.textPrimary,
      fontWeight: '700',
    },
    contextHighlight: {
      color: theme.textPrimary,
      fontWeight: '700',
    },
    contextHighlightAlt: {
      color: theme.purpleLight,
      fontWeight: '700',
    },
    contextMessage: {
      color: theme.textPrimary,
      fontSize: 13,
      fontStyle: 'italic',
      lineHeight: 19,
      marginTop: 8,
    },

    // Messages
    messagesContent: {
      paddingHorizontal: 14,
      paddingVertical: 14,
      flexGrow: 1,
    },
    bubbleRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    bubbleRowMine: {
      justifyContent: 'flex-end',
    },
    bubbleRowTheirs: {
      justifyContent: 'flex-start',
    },
    bubble: {
      maxWidth: '78%',
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    bubbleMine: {
      backgroundColor: theme.purple,
      borderBottomRightRadius: 4,
    },
    bubbleTheirs: {
      backgroundColor: theme.cardBg,
      borderBottomLeftRadius: 4,
    },
    bubbleText: {
      fontSize: 14,
      lineHeight: 19,
    },
    bubbleTextMine: {
      color: '#FFFFFF',
    },
    bubbleTextTheirs: {
      color: theme.textPrimary,
    },
    bubbleTime: {
      fontSize: 10,
      marginTop: 3,
      alignSelf: 'flex-end',
    },
    bubbleTimeMine: {
      color: 'rgba(255,255,255,0.7)',
    },
    bubbleTimeTheirs: {
      color: theme.textMuted,
    },

    // Empty / loading
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80,
      transform: [{ scaleY: -1 }],
    },
    emptyText: {
      color: theme.textMuted,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 22,
    },

    // Input bar
    inputBar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
      backgroundColor: theme.background,
    },
    input: {
      flex: 1,
      minHeight: 44,
      maxHeight: 120,
      backgroundColor: theme.inputBg,
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 12,
      color: theme.textPrimary,
      fontSize: 14,
      marginRight: 10,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
    sendButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
    },
  });

export default getStyles;
