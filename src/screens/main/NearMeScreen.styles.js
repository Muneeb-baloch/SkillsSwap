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

    // Permission banner
    permissionCard: {
      margin: 16,
      backgroundColor: theme.inputBg,
      borderRadius: 12,
      padding: 18,
      alignItems: 'center',
      gap: 14,
    },
    permissionText: {
      fontSize: 14,
      color: theme.textPrimary,
      textAlign: 'center',
      lineHeight: 20,
    },
    enableButton: {
      width: '100%',
      height: 48,
      backgroundColor: theme.purple,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    enableButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },
    deniedText: {
      textAlign: 'center',
      color: theme.textMuted,
      fontSize: 14,
      marginTop: 40,
      paddingHorizontal: 32,
      lineHeight: 22,
    },

    // Radius selector
    radiusContainer: {
      marginHorizontal: 16,
      marginBottom: 8,
      backgroundColor: theme.cardBg,
      borderRadius: 12,
      padding: 14,
    },
    radiusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    radiusLabel: {
      fontSize: 14,
      color: theme.textPrimary,
      fontWeight: '500',
    },
    radiusValue: {
      fontSize: 14,
      color: theme.textPrimary,
      fontWeight: '700',
    },
    slider: {
      width: '100%',
      height: 36,
    },

    // Results count
    resultsCount: {
      fontSize: 13,
      color: theme.tealLight,
      marginHorizontal: 20,
      marginBottom: 10,
    },

    // List
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 110,
    },

    // Card
    card: {
      backgroundColor: theme.cardBg,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
    },
    cardTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 6,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.textPrimary,
      flex: 1,
      marginRight: 8,
    },
    distanceBadge: {
      backgroundColor: 'rgba(29,158,117,0.15)',
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    distanceText: {
      fontSize: 11,
      color: theme.tealLight,
      fontWeight: '600',
    },
    cardDesc: {
      fontSize: 13,
      color: theme.textMuted,
      marginBottom: 10,
      lineHeight: 18,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardUser: {
      fontSize: 12,
      color: theme.purpleLight,
      fontWeight: '500',
    },
    cardCity: {
      fontSize: 12,
      color: theme.textMuted,
    },
    skillTagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 10,
    },
    skillTag: {
      backgroundColor: 'rgba(83,74,183,0.18)',
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },
    skillTagText: {
      fontSize: 11,
      color: theme.purpleLight,
      fontWeight: '500',
    },

    // States
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
