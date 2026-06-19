import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './NearMeScreen.styles';

function getInitials(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Single nearby listing card. Defined as its own component so it can resolve
// the poster's real name (older listings may have a missing/'Anonymous' name).
const NearbyCard = ({ item, navigation, styles }) => {
  const hasName = item.userName && item.userName !== 'Anonymous';
  const [resolvedName, setResolvedName] = useState(hasName ? item.userName : '');

  useEffect(() => {
    if (hasName || !item.userId) return;
    let active = true;
    getDoc(doc(db, 'users', item.userId))
      .then(snap => {
        if (active && snap.exists() && snap.data().name) setResolvedName(snap.data().name);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [hasName, item.userId]);

  const displayName = resolvedName || 'User';
  const initials = getInitials(displayName);

  const goToProfile = () => navigation.navigate('UserProfile', { userId: item.userId });
  const goToDetail = () => navigation.navigate('ListingDetail', { listing: item });

  return (
    <View style={styles.card}>
      {/* Top row: avatar + name/city + distance */}
      <View style={styles.cardTopRow}>
        <TouchableOpacity style={styles.avatarWrapper} onPress={goToProfile} activeOpacity={0.7}>
          {item.userPhoto ? (
            <Image source={{ uri: item.userPhoto }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.userInfo} onPress={goToProfile} activeOpacity={0.7}>
          <Text style={styles.userName} numberOfLines={1}>{displayName}</Text>
          <Text style={styles.userCity} numberOfLines={1}>{item.city || ''}</Text>
        </TouchableOpacity>

        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{item.distance} km away</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Offer */}
      <View style={styles.skillRow}>
        <Text style={styles.skillLabel}>Offering</Text>
        <Text style={styles.offerSkill} numberOfLines={1}>{capitalize(item.offerSkill)}</Text>
      </View>

      {/* Want */}
      <View style={styles.skillRow}>
        <Text style={styles.skillLabel}>Wants</Text>
        <Text style={styles.wantSkill} numberOfLines={1}>{capitalize(item.wantSkill)}</Text>
      </View>

      {/* Bottom row: CTA */}
      <View style={styles.cardBottomRow}>
        <View />
        <TouchableOpacity onPress={goToDetail} activeOpacity={0.7}>
          <Text style={styles.requestSwapText}>Request swap →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  const [locationLabel, setLocationLabel]     = useState('');
  const [editingCity, setEditingCity]         = useState(false);
  const [cityInput, setCityInput]             = useState('');
  const [geocoding, setGeocoding]             = useState(false);
  const [geoError, setGeoError]               = useState('');

  // Turn a set of coords into a readable "City, Country" label.
  const labelFromCoords = useCallback(async (lat, lng) => {
    try {
      const places = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      const p = places?.[0];
      if (p) {
        const city = p.city || p.subregion || p.region || '';
        const country = p.country || '';
        setLocationLabel([city, country].filter(Boolean).join(', '));
      }
    } catch {
      // Reverse geocode is best-effort; leave any existing label in place.
    }
  }, []);

  const requestPermission = useCallback(async () => {
    setGeoError('');
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      setEditingCity(false);
      labelFromCoords(loc.coords.latitude, loc.coords.longitude);
    }
  }, [labelFromCoords]);

  // Forward-geocode a manually typed city into coords + re-run the filter.
  const applyManualCity = useCallback(async () => {
    const term = cityInput.trim();
    if (!term) return;
    setGeocoding(true);
    setGeoError('');
    try {
      const results = await Location.geocodeAsync(term);
      const r = results?.[0];
      if (r) {
        setUserLocation({ lat: r.latitude, lng: r.longitude });
        setLocationLabel(term);
        setEditingCity(false);
        setCityInput('');
      } else {
        setGeoError('Could not find that location. Try another city.');
      }
    } catch {
      setGeoError('Could not look up that location. Try again.');
    } finally {
      setGeocoding(false);
    }
  }, [cityInput]);

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
    const myUid = auth.currentUser?.uid;
    const filtered = listings
      .filter(l => l.userId !== myUid) // don't show the user their own listings
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
    <NearbyCard item={item} navigation={navigation} styles={styles} />
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

  // Location label + manual-entry row, shown below the radius slider.
  const renderLocationRow = () => (
    <View style={styles.locationCard}>
      {editingCity ? (
        <>
          <View style={styles.cityInputRow}>
            <TextInput
              style={styles.cityInput}
              placeholder="Enter a city e.g. Karachi"
              placeholderTextColor={theme.textMuted}
              value={cityInput}
              onChangeText={setCityInput}
              autoFocus
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={applyManualCity}
            />
            <TouchableOpacity
              style={styles.cityGoButton}
              onPress={applyManualCity}
              disabled={geocoding}
              activeOpacity={0.8}
            >
              {geocoding ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.cityGoText}>Go</Text>
              )}
            </TouchableOpacity>
          </View>
          {geoError ? <Text style={styles.geoErrorText}>{geoError}</Text> : null}
          <TouchableOpacity
            style={[styles.useGpsButton, styles.useGpsRow]}
            onPress={requestPermission}
            activeOpacity={0.7}
          >
            <Ionicons name="locate-outline" size={14} color={theme.tealLight} />
            <Text style={styles.useGpsText}> Use current location</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.locationRow}>
          <View style={styles.locationLabelRow}>
            <Ionicons name="location-outline" size={15} color={theme.textPrimary} />
            <Text style={styles.locationLabel} numberOfLines={1}>
              {' '}Using: {locationLabel || 'your location'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setEditingCity(true);
              setGeoError('');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

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

      {permissionStatus === 'denied' && !userLocation && (
        <>
          {renderPermissionState()}
          <View style={styles.radiusContainer}>
            <Text style={styles.radiusLabel}>Or search by city</Text>
          </View>
          {renderLocationRow()}
        </>
      )}

      {(permissionStatus === 'granted' || (permissionStatus === 'denied' && userLocation)) && (
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

          {renderLocationRow()}

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
