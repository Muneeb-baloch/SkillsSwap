import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Animated,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { File } from 'expo-file-system';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } from '../../config/cloudinary';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './PostListingScreen.styles';

const CATEGORIES = [
  'Teaching', 'Cooking', 'Tech', 'Art', 'Music',
  'Fitness', 'Languages', 'Business', 'Crafts', 'Other',
];
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Expert'];
const FLEXIBILITY_OPTIONS = ['Exact match', 'Similar ok', 'Open to anything'];
const FORMAT_OPTIONS = ['In person', 'Video call', 'Chat/text', 'Any'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_OPTIONS = ['Morning', 'Afternoon', 'Evening'];

const STEPS = [
  { number: 1, label: 'What you offer' },
  { number: 2, label: 'What you want' },
  { number: 3, label: 'Details & publish' },
];

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

function toggleArrayItem(array, item) {
  return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const BackIcon = ({ color }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path
      d="M19 12H5M12 5l-7 7 7 7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const LightbulbIcon = ({ color }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path
      d="M12 2a7 7 0 017 7c0 3.87-2.69 6.28-3.5 7.5H8.5C7.69 15.28 5 12.87 5 9a7 7 0 017-7z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M9 21h6M10 17h4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const SearchIcon = ({ color }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path
      d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const PinIcon = ({ color }) => (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path
      d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const CameraIcon = ({ color }) => (
  <Svg width={32} height={32} viewBox="0 0 24 24">
    <Path
      d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M12 17a4 4 0 100-8 4 4 0 000 8z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// ── Small reusable pieces ─────────────────────────────────────────────────────

const CategoryPicker = ({ selected, onSelect, styles }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.chipScrollContent}
  >
    {CATEGORIES.map(cat => (
      <TouchableOpacity
        key={cat}
        style={[styles.categoryChip, selected === cat && styles.categoryChipActive]}
        onPress={() => onSelect(cat)}
        activeOpacity={0.7}
      >
        <Text style={[styles.categoryChipText, selected === cat && styles.categoryChipTextActive]}>
          {cat}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const CharCount = ({ length, max, styles }) => (
  <Text style={[styles.charCount, length > max - 10 && styles.charCountError]}>
    {length}/{max}
  </Text>
);

// ── Main screen ───────────────────────────────────────────────────────────────

const PostListingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);

  // Step
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 — offer
  const [offerCategory, setOfferCategory] = useState('');
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerLevel, setOfferLevel] = useState('');
  const [offerTitleFocused, setOfferTitleFocused] = useState(false);
  const [offerDescriptionFocused, setOfferDescriptionFocused] = useState(false);

  // Step 2 — want
  const [wantCategory, setWantCategory] = useState('');
  const [wantSkill, setWantSkill] = useState('');
  const [flexibility, setFlexibility] = useState('Similar ok');
  const [preferredFormats, setPreferredFormats] = useState(['Any']);
  const [wantSkillFocused, setWantSkillFocused] = useState(false);

  // Step 3 — details
  const [imageUri, setImageUri] = useState(null);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [coords, setCoords] = useState(null);
  const [availableDays, setAvailableDays] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Publish
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);

  const stepOpacity = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let loopAnim;
    if (currentStep === 3) {
      loopAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.3, duration: 750, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 750, useNativeDriver: true }),
        ]),
      );
      loopAnim.start();
    }
    return () => {
      if (loopAnim) loopAnim.stop();
    };
  }, [currentStep, pulseAnim]);

  const goToStep = newStep => {
    Animated.timing(stepOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(newStep);
      Animated.timing(stepOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const validateStep1 = () => {
    if (offerTitle.trim().length < 5) return 'Please enter a skill title (at least 5 characters).';
    if (offerDescription.trim().length < 10) return 'Please add a longer description (at least 10 characters).';
    if (!offerLevel) return 'Please select your experience level.';
    return null;
  };

  const validateStep2 = () => {
    if (wantSkill.trim().length < 5) return 'Please enter what you want to learn (at least 5 characters).';
    return null;
  };

  const validateStep3 = () => {
    if (!city.trim()) return 'Please enter your city.';
    if (availableDays.length === 0) return 'Please select at least one available day.';
    return null;
  };

  const handleNext = () => {
    setError(null);
    if (currentStep === 1) {
      const validationError = validateStep1();
      if (validationError) {
        setError(validationError);
        return;
      }
      goToStep(2);
    } else if (currentStep === 2) {
      const validationError = validateStep2();
      if (validationError) {
        setError(validationError);
        return;
      }
      goToStep(3);
    } else {
      const validationError = validateStep3();
      if (validationError) {
        setError(validationError);
        return;
      }
      handlePublish();
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep === 1) {
      navigation.goBack();
    } else {
      goToStep(currentStep - 1);
    }
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo library access is required to add a picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    setImageUri(asset.uri);
  };

  const getLocation = async () => {
    setLocationError('');
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setCity(address?.city || address?.district || '');
      setCountry(address?.country || 'Pakistan');
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    } catch {
      setLocationError('Could not get your location. Please enter it manually.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      setError(null);

      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Not logged in');

      let photoURL = '';

      // 1. Upload image to Cloudinary if selected (non-blocking — publish proceeds without
      // the photo if this fails, since Cloudinary config issues shouldn't block the listing)
      if (imageUri) {
        try {
          console.log('Cloudinary config:', {
            url: CLOUDINARY_UPLOAD_URL,
            preset: CLOUDINARY_UPLOAD_PRESET,
          });

          const formData = new FormData();
          // Expo SDK 56's fetch only accepts a real Blob/File — the old RN-style
          // {uri, type, name} object throws "Unsupported FormDataPart implementation".
          formData.append('file', new File(imageUri));
          formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
          formData.append('folder', 'skillsswap/listings');

          console.log('Starting Cloudinary upload...');

          const uploadWithTimeout = Promise.race([
            fetch(CLOUDINARY_UPLOAD_URL, {
              method: 'POST',
              body: formData,
              headers: { Accept: 'application/json' },
            }),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error('Upload timeout — check internet connection')),
                30000,
              ),
            ),
          ]);

          const uploadRes = await uploadWithTimeout;
          console.log('Cloudinary response status:', uploadRes.status);

          const uploadData = await uploadRes.json();
          console.log('Cloudinary response body:', JSON.stringify(uploadData, null, 2));

          if (!uploadData.secure_url) {
            throw new Error(uploadData.error?.message || 'No secure_url in response');
          }
          photoURL = uploadData.secure_url;
          console.log('Upload success:', photoURL);
        } catch (uploadErr) {
          console.warn('Image upload failed, publishing without image:', uploadErr);
          photoURL = '';
        }
      }

      // 2. Write listing to Firestore
      const listingData = {
        // User info (denormalized for feed display)
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userPhoto: currentUser.photoURL || '',

        // Offer
        offerSkill: offerTitle.trim(),
        offerCategory: offerCategory,
        offerDescription: offerDescription.trim(),
        offerLevel: offerLevel,

        // Want
        wantSkill: wantSkill.trim(),
        wantCategory: wantCategory,
        flexibility: flexibility,
        preferredFormats: preferredFormats,

        // Location
        city: city.trim(),
        country: country.trim(),
        lat: coords?.lat || null,
        lng: coords?.lng || null,

        // Availability
        availableDays: availableDays,
        availableTimes: availableTimes,

        // Media
        photoURL: photoURL,

        // Meta
        active: true,
        views: 0,
        requests: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'listings'), listingData);

      // 3. Success — navigate back to Home
      navigation.replace('Main');
    } catch (err) {
      console.error('Publish error:', err);
      setError('Failed to publish listing. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  const renderProgressIndicator = () => (
    <View style={styles.progressRow}>
      {STEPS.map((step, idx) => {
        const isDone = currentStep > step.number;
        const isActive = currentStep === step.number;
        const isUpcoming = currentStep < step.number;
        return (
          <React.Fragment key={step.number}>
            <View style={styles.stepDotColumn}>
              <View
                style={[
                  styles.stepDot,
                  isDone && styles.stepDotDone,
                  isActive && styles.stepDotActive,
                  isUpcoming && styles.stepDotUpcoming,
                ]}
              >
                {isDone && <Text style={styles.stepDotCheck}>✓</Text>}
              </View>
              <Text style={[styles.stepLabel, !isUpcoming && styles.stepLabelActive]}>
                {step.label}
              </Text>
            </View>
            {idx < STEPS.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  currentStep > step.number ? styles.stepLineDone : styles.stepLineUpcoming,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <LightbulbIcon color={theme.purpleLight} />
        <View style={styles.cardHeaderTextWrap}>
          <Text style={styles.cardTitle}>What can you teach or offer?</Text>
          <Text style={styles.cardSubtitle}>Be specific — good offers get more requests</Text>
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Category</Text>
        <CategoryPicker selected={offerCategory} onSelect={setOfferCategory} styles={styles} />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Skill title *</Text>
        <TextInput
          style={[styles.input, offerTitleFocused && styles.inputFocused]}
          placeholder="e.g. I can teach conversational English"
          placeholderTextColor={theme.textMuted}
          value={offerTitle}
          onChangeText={setOfferTitle}
          onFocus={() => setOfferTitleFocused(true)}
          onBlur={() => setOfferTitleFocused(false)}
          maxLength={80}
        />
        <CharCount length={offerTitle.length} max={80} styles={styles} />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Describe what you'll teach *</Text>
        <TextInput
          style={[styles.input, styles.textArea, offerDescriptionFocused && styles.inputFocused]}
          placeholder="What level can you teach? How will sessions work? Any requirements for the learner?"
          placeholderTextColor={theme.textMuted}
          value={offerDescription}
          onChangeText={setOfferDescription}
          onFocus={() => setOfferDescriptionFocused(true)}
          onBlur={() => setOfferDescriptionFocused(false)}
          maxLength={300}
          multiline
        />
        <CharCount length={offerDescription.length} max={300} styles={styles} />
      </View>

      <View>
        <Text style={styles.fieldLabel}>Your level *</Text>
        <View style={styles.levelOptionsRow}>
          {EXPERIENCE_LEVELS.map(level => (
            <TouchableOpacity
              key={level}
              style={[styles.levelOption, offerLevel === level && styles.levelOptionActive]}
              onPress={() => setOfferLevel(level)}
              activeOpacity={0.7}
            >
              <Text style={[styles.levelOptionText, offerLevel === level && styles.levelOptionTextActive]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <SearchIcon color={theme.tealLight} />
        <View style={styles.cardHeaderTextWrap}>
          <Text style={styles.cardTitle}>What do you want to learn?</Text>
          <Text style={styles.cardSubtitle}>You'll get matched with people who offer this</Text>
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Category</Text>
        <CategoryPicker selected={wantCategory} onSelect={setWantCategory} styles={styles} />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Skill you want to learn *</Text>
        <TextInput
          style={[styles.input, wantSkillFocused && styles.inputFocused]}
          placeholder="e.g. I want to learn Python programming"
          placeholderTextColor={theme.textMuted}
          value={wantSkill}
          onChangeText={setWantSkill}
          onFocus={() => setWantSkillFocused(true)}
          onBlur={() => setWantSkillFocused(false)}
          maxLength={80}
        />
        <CharCount length={wantSkill.length} max={80} styles={styles} />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>How flexible are you?</Text>
        <View style={styles.levelOptionsRow}>
          {FLEXIBILITY_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={[styles.levelOption, flexibility === option && styles.levelOptionActive]}
              onPress={() => setFlexibility(option)}
              activeOpacity={0.7}
            >
              <Text style={[styles.levelOptionText, flexibility === option && styles.levelOptionTextActive]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View>
        <Text style={styles.fieldLabel}>Preferred format</Text>
        <View style={styles.formatWrapRow}>
          {FORMAT_OPTIONS.map(format => {
            const isSelected = preferredFormats.includes(format);
            return (
              <TouchableOpacity
                key={format}
                style={[styles.formatChip, isSelected && styles.formatChipActive]}
                onPress={() => setPreferredFormats(prev => toggleArrayItem(prev, format))}
                activeOpacity={0.7}
              >
                <Text style={[styles.formatChipText, isSelected && styles.formatChipTextActive]}>
                  {format}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => {
    const initials = getInitials(auth.currentUser?.displayName);

    return (
      <>
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderTextWrap}>
              <Text style={styles.cardTitle}>Add a photo (optional)</Text>
              <Text style={styles.cardSubtitle}>Listings with photos get 3x more responses</Text>
            </View>
          </View>

          {imageUri ? (
            <View style={styles.photoPreviewWrap}>
              <Image source={{ uri: imageUri }} style={styles.photoPreviewImage} />
              <TouchableOpacity
                style={styles.photoRemoveBtn}
                onPress={() => setImageUri(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.photoRemoveBtnText}>×</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.photoPickerEmpty} onPress={handlePickImage} activeOpacity={0.7}>
              <View style={styles.photoIconWrap}>
                <CameraIcon color={theme.textMuted} />
              </View>
              <Text style={styles.photoText}>Tap to add photo</Text>
              <Text style={styles.photoSubtext}>JPG or PNG, max 5MB</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Location *</Text>
            <View style={styles.locationRow}>
              <TextInput
                style={[styles.input, styles.locationInput]}
                placeholder="City"
                placeholderTextColor={theme.textMuted}
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                style={[styles.input, styles.locationInput]}
                placeholder="Country"
                placeholderTextColor={theme.textMuted}
                value={country}
                onChangeText={setCountry}
              />
            </View>

            <View style={styles.locationLinkRow}>
              {locationLoading ? (
                <ActivityIndicator color={theme.purple} />
              ) : (
                <TouchableOpacity style={styles.locationLinkBtn} onPress={getLocation} activeOpacity={0.7}>
                  <PinIcon color={theme.tealLight} />
                  <Text style={styles.locationLink}>Use my current location</Text>
                </TouchableOpacity>
              )}
            </View>
            {!!locationError && <Text style={styles.locationError}>{locationError}</Text>}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>When are you available? *</Text>
            <View style={styles.dayRow}>
              {DAYS.map(day => {
                const isSelected = availableDays.includes(day);
                return (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayChip, isSelected && styles.dayChipActive]}
                    onPress={() => setAvailableDays(prev => toggleArrayItem(prev, day))}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dayChipText, isSelected && styles.dayChipTextActive]}>{day}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View>
            <Text style={styles.fieldLabel}>Time preference</Text>
            <View style={styles.levelOptionsRow}>
              {TIME_OPTIONS.map(time => {
                const isSelected = availableTimes.includes(time);
                return (
                  <TouchableOpacity
                    key={time}
                    style={[styles.levelOption, isSelected && styles.levelOptionActive]}
                    onPress={() => setAvailableTimes(prev => toggleArrayItem(prev, time))}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.levelOptionText, isSelected && styles.levelOptionTextActive]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.previewSection}>
          <View style={styles.previewHeaderRow}>
            <Text style={styles.previewLabel}>Preview</Text>
            <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
          </View>

          <View style={styles.previewCard}>
            <View style={styles.previewTopRow}>
              <View style={styles.previewAvatar}>
                <Text style={styles.previewAvatarText}>{initials}</Text>
              </View>
              <View style={styles.previewUserInfo}>
                <Text style={styles.previewUserName} numberOfLines={1}>
                  {auth.currentUser?.displayName || 'You'}
                </Text>
                <Text style={styles.previewUserCity} numberOfLines={1}>
                  {city ? `${city}, ${country}` : 'Location'}
                </Text>
              </View>
            </View>

            <View style={styles.previewDivider} />

            <View style={styles.previewSkillRow}>
              <Text style={styles.previewSkillLabel}>Offering</Text>
              <Text style={styles.previewOfferText} numberOfLines={1}>
                {offerTitle || 'Your skill'}
              </Text>
            </View>

            <View style={styles.previewSkillRow}>
              <Text style={styles.previewSkillLabel}>Wants</Text>
              <Text style={styles.previewWantText} numberOfLines={1}>
                {wantSkill || 'What you want'}
              </Text>
            </View>

            <View style={styles.previewBottomRow}>
              <Text style={styles.previewTimeText}>Just now</Text>
              <Text style={styles.previewCtaText}>Request swap →</Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <BackIcon color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post a Skill</Text>
          <View style={styles.headerRightSpacer} />
        </View>

        {renderProgressIndicator()}

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: stepOpacity }}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </Animated.View>
        </ScrollView>

        {!!error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
          {currentStep < 3 ? (
            <View style={styles.bottomBarRow}>
              <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                <Text style={styles.backLink}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.85}>
                <Text style={styles.nextButtonText}>Next →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.publishHint}>Your listing will be visible to everyone</Text>
              <TouchableOpacity
                style={[styles.publishButton, publishing && styles.publishButtonDisabled]}
                onPress={handleNext}
                activeOpacity={0.85}
                disabled={publishing}
              >
                {publishing && <ActivityIndicator color="#FFFFFF" />}
                <Text style={styles.publishButtonText}>
                  {publishing ? 'Publishing...' : 'Publish listing'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostListingScreen;
