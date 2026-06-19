import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 2,
    },
    subtitle: {
      fontSize: 13,
      color: theme.textMuted,
    },

    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 110,
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardBg,
      borderRadius: 14,
      padding: 12,
      marginBottom: 10,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    avatarImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.inputBg,
      marginRight: 12,
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    rowBody: {
      flex: 1,
    },
    rowTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    name: {
      flex: 1,
      marginRight: 8,
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    time: {
      color: theme.textMuted,
      fontSize: 11,
    },
    rowBottom: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    preview: {
      flex: 1,
      color: theme.textMuted,
      fontSize: 13,
    },
    previewUnread: {
      color: theme.textPrimary,
      fontWeight: '600',
    },
    unreadDot: {
      width: 9,
      height: 9,
      borderRadius: 5,
      backgroundColor: theme.teal,
      marginLeft: 8,
    },

    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 60,
    },
    emptyText: {
      color: theme.textMuted,
      fontSize: 14,
      textAlign: 'center',
      paddingHorizontal: 32,
      lineHeight: 22,
    },
  });

export default getStyles;
