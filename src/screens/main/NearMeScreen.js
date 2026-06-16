import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './NearMeScreen.styles';

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

const NearMeScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);
  const [userLocation, setUserLocation]       = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [radius, setRadius]                   = useState(10);
  const [listings, setListings]               = useState([]);
  const [nearbyListings, setNearbyListings]   = useState([]);
  const [loading, setLoading]                 = useState(false);

  const requestPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    }
  }, []);

  // Request permission on mount
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Fetch all active listings once location is granted
  useEffect(() => {
    if (!userLocation) return;
    const fetchListings = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'listings'), where('active', '==', true));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setListings(data);
      } catch (e) {
        console.error('Error fetching listings:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [userLocation]);

  // Re-filter whenever radius, location, or listings change
  useEffect(() => {
    if (!userLocation || !listings.length) {
      setNearbyListings([]);
      return;
    }
    const filtered = listings
      .filter(l => l.lat != null && l.lng != null)
      .map(l => ({
        ...l,
        distance: haversineDistance(userLocation.lat, userLocation.lng, l.lat, l.lng),
      }))
      .filter(l => l.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
    setNearbyListings(filtered);
  }, [userLocation, radius, listings]);

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ListingDetail', { listing: item })}
      activeOpacity={0.75}
    >
      <View style={styles.cardTopRow}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{item.distance} km away</Text>
        </View>
      </View>

      {item.description ? (
        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
      ) : null}

      {Array.isArray(item.skills) && item.skills.length > 0 && (
        <View style={styles.skillTagRow}>
          {item.skills.slice(0, 3).map((s, i) => (
            <View key={i} style={styles.skillTag}>
              <Text style={styles.skillTagText}>{s}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.cardFooter}>
        <Text style={styles.cardUser}>{item.userName || 'Anonymous'}</Text>
        <Text style={styles.cardCity}>{item.city || ''}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPermissionState = () => {
    if (permissionStatus === 'unknown') return null;

    if (permissionStatus === 'denied') {
      return (
        <Text style={styles.deniedText}>
          Location access denied.{'\n'}Please enable it in your phone settings.
        </Text>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Near Me</Text>
        <Text style={styles.subtitle}>Skills available in your area</Text>
      </View>

      {permissionStatus === 'unknown' && (
        <View style={styles.permissionCard}>
          <Text style={styles.permissionText}>
            Allow location access to find skills near you
          </Text>
          <TouchableOpacity style={styles.enableButton} onPress={requestPermission}>
            <Text style={styles.enableButtonText}>Enable location</Text>
          </TouchableOpacity>
        </View>
      )}

      {permissionStatus === 'denied' && renderPermissionState()}

      {permissionStatus === 'granted' && (
        <>
          <View style={styles.radiusContainer}>
            <View style={styles.radiusRow}>
              <Text style={styles.radiusLabel}>Search radius</Text>
              <Text style={styles.radiusValue}>{radius} km</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={50}
              step={1}
              value={radius}
              onValueChange={val => setRadius(val)}
              minimumTrackTintColor={theme.purple}
              maximumTrackTintColor={theme.inputBg}
              thumbTintColor={theme.purple}
            />
          </View>

          {!loading && (
            <Text style={styles.resultsCount}>
              {nearbyListings.length} skill{nearbyListings.length !== 1 ? 's' : ''} found within {radius} km
            </Text>
          )}

          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={theme.purple} />
            </View>
          ) : (
            <FlatList
              data={nearbyListings}
              keyExtractor={item => item.id}
              renderItem={renderCard}
              contentContainerStyle={[
                styles.listContent,
                nearbyListings.length === 0 && styles.centered,
              ]}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No skills found nearby.{'\n'}Try increasing the radius.
                </Text>
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default NearMeScreen;
