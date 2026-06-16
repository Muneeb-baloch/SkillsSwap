import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  Animated,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } from '../../config/cloudinary';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './EditProfileScreen.styles';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMES = ['Morning', 'Afternoon', 'Evening'];

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Icons ─────────────────────────────────────────────────────────────────────

const BackIcon = ({ color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M19 12H5M12 5l-7 7 7 7" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const GlobeIcon = ({ color, size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
      stroke={color}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ── Small components ────────────────────────────────────────────────────────

const PulsingSkeleton = ({ style }) => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.8, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return <Animated.View style={[style, { opacity: pulseAnim }]} />;
};

// ── Main screen ───────────────────────────────────────────────────────────────

const EditProfileScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  const [offerSkills, setOfferSkills] = useState([]);
  const [offerInput, setOfferInput] = useState('');
  const [wantSkills, setWantSkills] = useState([]);
  const [wantInput, setWantInput] = useState('');

  const [availableDays, setAvailableDays] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  const [linkedin, setLinkedin] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');

  const [nameFocused, setNameFocused] = useState(false);
  const [cityFocused, setCityFocused] = useState(false);
  const [countryFocused, setCountryFocused] = useState(false);
  const [bioFocused, setBioFocused] = useState(false);
  const [linkedinFocused, setLinkedinFocused] = useState(false);
  const [whatsappFocused, setWhatsappFocused] = useState(false);
  const [websiteFocused, setWebsiteFocused] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const userSnap = await getDoc(doc(db, 'users', currentUser.uid));

        if (userSnap.exists()) {
          const data = userSnap.data();
          setName(data.name || currentUser.displayName || '');
          setCity(data.city || '');
          setCountry(data.country || 'Pakistan');
          setBio(data.bio || '');
          setOfferSkills(data.skills || []);
          setWantSkills(data.wants || []);
          setAvailableDays(data.availableDays || []);
          setAvailableTimes(data.availableTimes || []);
          setLinkedin(data.linkedin || '');
          setWhatsapp(data.whatsapp || '');
          setWebsite(data.website || '');
          setPhotoURL(data.photoURL || currentUser.photoURL || '');
        }
      } catch (err) {
        console.error('Load profile error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleChangePhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Photo library access is required to change your photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled) return;

      setUploadingPhoto(true);
      const uri = result.assets[0].uri;

      const formData = new FormData();
      formData.append('file', new File(uri));
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'skillsswap/profiles');

      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();

      if (!data.secure_url) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      await updateProfile(auth.currentUser, { photoURL: data.secure_url });
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { photoURL: data.secure_url });

      setPhotoURL(data.secure_url);
    } catch (err) {
      console.error('Photo upload error:', err);
      Alert.alert('Error', 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleAddOfferSkill = () => {
    const trimmed = offerInput.trim();
    if (!trimmed) return;
    if (offerSkills.length >= 8) {
      Alert.alert('Max 8 skills', 'Remove a skill before adding another');
      return;
    }
    if (offerSkills.includes(trimmed)) {
      Alert.alert('Already added', 'This skill is already in your list');
      return;
    }
    setOfferSkills(prev => [...prev, trimmed]);
    setOfferInput('');
  };

  const handleAddWantSkill = () => {
    const trimmed = wantInput.trim();
    if (!trimmed) return;
    if (wantSkills.length >= 8) {
      Alert.alert('Max 8 skills', 'Remove a skill before adding another');
      return;
    }
    if (wantSkills.includes(trimmed)) {
      Alert.alert('Already added', 'This skill is already in your list');
      return;
    }
    setWantSkills(prev => [...prev, trimmed]);
    setWantInput('');
  };

  const removeOfferSkill = skill => {
    setOfferSkills(prev => prev.filter(s => s !== skill));
  };

  const removeWantSkill = skill => {
    setWantSkills(prev => prev.filter(s => s !== skill));
  };

  const toggleDay = day => {
    setAvailableDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]));
  };

  const toggleTime = time => {
    setAvailableTimes(prev => (prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]));
  };

  const validate = () => {
    if (name.trim().length < 2) {
      Alert.alert('Name required', 'Please enter your display name');
      return false;
    }
    if (offerSkills.length === 0) {
      Alert.alert('Skills required', 'Add at least one skill you can offer');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      const currentUser = auth.currentUser;

      await updateProfile(currentUser, { displayName: name.trim() });

      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: name.trim(),
        city: city.trim(),
        country: country.trim(),
        bio: bio.trim(),
        skills: offerSkills,
        wants: wantSkills,
        availableDays,
        availableTimes,
        linkedin: linkedin.trim(),
        whatsapp: whatsapp.trim(),
        website: website.trim(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert('✓ Profile updated', 'Your changes have been saved.', [
        { text: 'Done', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error('Save profile error:', err);
      Alert.alert('Error', 'Failed to save profile. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <BackIcon color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>Edit Profile</Text>

        <View style={styles.headerRight}>
          {saving ? (
            <ActivityIndicator size="small" color={theme.purple} />
          ) : (
            <TouchableOpacity onPress={handleSave} disabled={loading} activeOpacity={0.7}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <KeyboardAvoidingView style={styles.flexFill} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <>
              <PulsingSkeleton style={styles.skeletonAvatar} />
              <PulsingSkeleton style={styles.skeletonInputBar} />
              <PulsingSkeleton style={styles.skeletonInputBar} />
              <PulsingSkeleton style={styles.skeletonInputBar} />
            </>
          ) : (
            <>
              {/* ── Section 1: Avatar ────────────────────────────────────── */}
              <View style={styles.avatarWrap}>
                <View style={styles.avatarContainer}>
                  {photoURL ? (
                    <Image source={{ uri: photoURL }} style={styles.avatarImage} resizeMode="cover" />
                  ) : (
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
                    </View>
                  )}
                </View>

                {uploadingPhoto ? (
                  <View style={styles.uploadingRow}>
                    <ActivityIndicator size="small" color={theme.purple} />
                    <Text style={styles.uploadingText}>Uploading...</Text>
                  </View>
                ) : (
                  <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.7}>
                    <Text style={styles.changePhotoText}>Change photo</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* ── Section 2: Basic info ────────────────────────────────── */}
              <Text style={styles.sectionLabel}>Basic Info</Text>

              <TextInput
                style={[styles.input, styles.inputNoMargin, nameFocused && styles.inputFocused]}
                placeholder="Your full name"
                placeholderTextColor={theme.textMuted}
                value={name}
                onChangeText={setName}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                autoCapitalize="words"
                maxLength={50}
              />
              <View style={styles.charCountRow}>
                <Text style={styles.charCountText}>{name.length}/50</Text>
              </View>

              <TextInput
                style={[styles.input, cityFocused && styles.inputFocused]}
                placeholder="Your city"
                placeholderTextColor={theme.textMuted}
                value={city}
                onChangeText={setCity}
                onFocus={() => setCityFocused(true)}
                onBlur={() => setCityFocused(false)}
                autoCapitalize="words"
              />

              <TextInput
                style={[styles.input, countryFocused && styles.inputFocused]}
                placeholder="Your country"
                placeholderTextColor={theme.textMuted}
                value={country}
                onChangeText={setCountry}
                onFocus={() => setCountryFocused(true)}
                onBlur={() => setCountryFocused(false)}
                autoCapitalize="words"
              />

              <Text style={styles.sectionLabel}>About You</Text>

              <TextInput
                style={[styles.input, styles.bioInput, styles.inputNoMargin, bioFocused && styles.inputFocused]}
                placeholder="Tell people a bit about yourself, your background, and what you're passionate about..."
                placeholderTextColor={theme.textMuted}
                value={bio}
                onChangeText={setBio}
                onFocus={() => setBioFocused(true)}
                onBlur={() => setBioFocused(false)}
                multiline
                maxLength={200}
              />
              <View style={styles.charCountRow}>
                <Text style={styles.charCountText}>{bio.length}/200</Text>
              </View>

              {/* ── Section 3: Skills I offer ────────────────────────────── */}
              <Text style={styles.sectionLabel}>Skills I Offer</Text>
              <Text style={styles.sectionSubtext}>What can you teach or share? (max 8)</Text>

              <View style={styles.skillInputRow}>
                <TextInput
                  style={styles.skillTextInput}
                  placeholder="Type a skill and press Add"
                  placeholderTextColor={theme.textMuted}
                  value={offerInput}
                  onChangeText={setOfferInput}
                  onSubmitEditing={handleAddOfferSkill}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={[styles.addSkillButton, !offerInput.trim() && styles.addSkillButtonDisabled]}
                  onPress={handleAddOfferSkill}
                  disabled={!offerInput.trim()}
                  activeOpacity={0.7}
                >
                  <Text style={styles.addSkillButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              {offerSkills.length > 0 && (
                <View style={styles.tagRow}>
                  {offerSkills.map(skill => (
                    <View key={skill} style={styles.tagPillOffer}>
                      <Text style={styles.tagTextOffer}>{skill}</Text>
                      <TouchableOpacity style={styles.tagRemoveOffer} onPress={() => removeOfferSkill(skill)}>
                        <Text style={styles.tagRemoveText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* ── Section 4: Skills I want ─────────────────────────────── */}
              <Text style={styles.sectionLabel}>Skills I Want</Text>
              <Text style={styles.sectionSubtext}>What do you want to learn? (max 8)</Text>

              <View style={styles.skillInputRow}>
                <TextInput
                  style={styles.skillTextInput}
                  placeholder="Type a skill and press Add"
                  placeholderTextColor={theme.textMuted}
                  value={wantInput}
                  onChangeText={setWantInput}
                  onSubmitEditing={handleAddWantSkill}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={[styles.addSkillButton, !wantInput.trim() && styles.addSkillButtonDisabled]}
                  onPress={handleAddWantSkill}
                  disabled={!wantInput.trim()}
                  activeOpacity={0.7}
                >
                  <Text style={styles.addSkillButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              {wantSkills.length > 0 && (
                <View style={styles.tagRow}>
                  {wantSkills.map(skill => (
                    <View key={skill} style={styles.tagPillWant}>
                      <Text style={styles.tagTextWant}>{skill}</Text>
                      <TouchableOpacity style={styles.tagRemoveWant} onPress={() => removeWantSkill(skill)}>
                        <Text style={styles.tagRemoveText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* ── Section 5: Availability ───────────────────────────────── */}
              <Text style={styles.sectionLabel}>Availability</Text>

              <Text style={styles.availabilityLabel}>Available days</Text>
              <View style={styles.daysRow}>
                {DAYS.map(day => {
                  const selected = availableDays.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      style={[styles.optionChip, selected ? styles.optionChipSelected : styles.optionChipUnselected]}
                      onPress={() => toggleDay(day)}
                      activeOpacity={0.7}
                    >
                      <Text style={selected ? styles.optionChipTextSelected : styles.optionChipTextUnselected}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.availabilityLabel, { marginTop: 16 }]}>Preferred times</Text>
              <View style={styles.timesRow}>
                {TIMES.map(time => {
                  const selected = availableTimes.includes(time);
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[styles.optionChip, selected ? styles.optionChipSelected : styles.optionChipUnselected]}
                      onPress={() => toggleTime(time)}
                      activeOpacity={0.7}
                    >
                      <Text style={selected ? styles.optionChipTextSelected : styles.optionChipTextUnselected}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* ── Section 6: Social links ──────────────────────────────── */}
              <Text style={styles.sectionLabel}>Social Links</Text>
              <Text style={styles.sectionSubtext}>Help people find and trust you (optional)</Text>

              <View
                style={[styles.socialInputRow, linkedinFocused && styles.socialInputRowFocused]}
              >
                <View style={styles.socialIconBox}>
                  <Text style={styles.socialIconTextLinkedin}>in</Text>
                </View>
                <TextInput
                  style={styles.socialTextInput}
                  placeholder="linkedin.com/in/yourname"
                  placeholderTextColor={theme.textMuted}
                  value={linkedin}
                  onChangeText={setLinkedin}
                  onFocus={() => setLinkedinFocused(true)}
                  onBlur={() => setLinkedinFocused(false)}
                  autoCapitalize="none"
                />
              </View>

              <View
                style={[styles.socialInputRow, whatsappFocused && styles.socialInputRowFocused]}
              >
                <View style={styles.socialIconBox}>
                  <Text style={styles.socialIconTextWhatsapp}>W</Text>
                </View>
                <TextInput
                  style={styles.socialTextInput}
                  placeholder="WhatsApp number"
                  placeholderTextColor={theme.textMuted}
                  value={whatsapp}
                  onChangeText={setWhatsapp}
                  onFocus={() => setWhatsappFocused(true)}
                  onBlur={() => setWhatsappFocused(false)}
                  keyboardType="phone-pad"
                />
              </View>

              <View
                style={[styles.socialInputRow, websiteFocused && styles.socialInputRowFocused]}
              >
                <View style={styles.socialIconBox}>
                  <GlobeIcon color={theme.textMuted} />
                </View>
                <TextInput
                  style={styles.socialTextInput}
                  placeholder="yourwebsite.com"
                  placeholderTextColor={theme.textMuted}
                  value={website}
                  onChangeText={setWebsite}
                  onFocus={() => setWebsiteFocused(true)}
                  onBlur={() => setWebsiteFocused(false)}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
