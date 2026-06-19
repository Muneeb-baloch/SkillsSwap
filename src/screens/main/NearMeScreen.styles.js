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

    // Location label + manual entry
    locationCard: {
      marginHorizontal: 16,
      marginBottom: 10,
      backgroundColor: theme.cardBg,
      borderRadius: 12,
      padding: 14,
    },
    locationRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    locationLabelRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10,
    },
    locationLabel: {
      flexShrink: 1,
      fontSize: 13,
      color: theme.textPrimary,
      fontWeight: '500',
    },
    changeText: {
      fontSize: 13,
      color: theme.purpleLight,
      fontWeight: '700',
    },
    cityInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    cityInput: {
      flex: 1,
      height: 44,
      backgroundColor: theme.inputBg,
      borderRadius: 10,
      paddingHorizontal: 12,
      color: theme.textPrimary,
      fontSize: 14,
    },
    cityGoButton: {
      height: 44,
      paddingHorizontal: 18,
      borderRadius: 10,
      backgroundColor: theme.purple,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cityGoText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
    geoErrorText: {
      color: theme.error,
      fontSize: 12,
      marginTop: 8,
    },
    useGpsButton: {
      marginTop: 12,
      alignSelf: 'flex-start',
    },
    useGpsRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    useGpsText: {
      fontSize: 13,
      color: theme.tealLight,
      fontWeight: '600',
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
    avatarImage: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.inputBg,
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
    distanceBadge: {
      backgroundColor: 'rgba(29,158,117,0.15)',
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 3,
      marginLeft: 8,
    },
    distanceText: {
      fontSize: 11,
      color: theme.tealLight,
      fontWeight: '600',
    },
    divider: {
      height: 1,
      backgroundColor: theme.divider,
      marginBottom: 12,
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
    requestSwapText: {
      color: theme.teal,
      fontSize: 13,
      fontWeight: 'bold',
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
