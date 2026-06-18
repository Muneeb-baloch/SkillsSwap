import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  Share,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  getDoc,
  limit,
} from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './ListingDetailScreen.styles';

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

function timeAgo(date) {
  if (!date) return 'Recently';
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 2592000) return Math.floor(diff / 86400) + 'd ago';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function formatDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const BackIcon = ({ color }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M19 12H5M12 5l-7 7 7 7" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

const ShareIcon = ({ color }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="M16 6l-4-4-4 4M12 2v13" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

const SwapIcon = ({ color, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M7 16V4m0 0L3 8m4-4l4 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="M17 8v12m0 0l4-4m-4 4l-4-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

const MonitorIcon = ({ color }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path d="M2 3h20v14H2zM8 21h8M12 17v4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

const PinIcon = ({ color }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

const LocationPinIcon = ({ color }) => (
  <Svg width={11} height={11} viewBox="0 0 24 24" style={{ marginRight: 3, marginTop: 1 }}>
    <Path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  </Svg>
);

const CalendarIcon = ({ color }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

const EyeIcon = ({ color }) => (
  <Svg width={12} height={12} viewBox="0 0 24 24">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0" fill="none" stroke={color} strokeWidth={2} />
  </Svg>
);

const RequestsIcon = ({ color }) => (
  <Svg width={12} height={12} viewBox="0 0 24 24">
    <Path
      d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ClockIcon = ({ color }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

// ── Small components ────────────────────────────────────────────────────────

const StarRow = ({ rating, styles }) => {
  const filled = Math.floor(rating || 0);
  return (
    <Text style={styles.posterStars}>
      {Array.from({ length: 5 }, (_, i) => (
        <Text key={i} style={i < filled ? styles.starFilled : styles.starEmpty}>
          {i < filled ? '★' : '☆'}
        </Text>
      ))}
    </Text>
  );
};

// ── Main screen ───────────────────────────────────────────────────────────────

const ListingDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const listing = route.params?.listing;

  const [listingActive, setListingActive] = useState(listing?.active ?? true);
  const [imageLoading, setImageLoading] = useState(false);

  const [posterRating, setPosterRating] = useState(0);
  const [posterReviews, setPosterReviews] = useState(0);
  const [posterData, setPosterData] = useState(null);

  const [currentUserSkills, setCurrentUserSkills] = useState([]);

  const [alreadyRequested, setAlreadyRequested] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedOfferSkill, setSelectedOfferSkill] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

  const [similarListings, setSimilarListings] = useState([]);

  const isOwnListing = !!listing && listing.userId === auth.currentUser?.uid;

  useEffect(() => {
    if (!listing) return;

    // Increment view count silently
    updateDoc(doc(db, 'listings', listing.id), { views: increment(1) }).catch(() => {});

    // Fetch poster data (rating, reviewCount, and real name/photo — listing.userName
    // can be stale/missing if displayName was null when the listing was created)
    getDoc(doc(db, 'users', listing.userId))
      .then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          setPosterData(data);
          setPosterRating(data.rating || 0);
          setPosterReviews(data.reviewCount || 0);
        }
      })
      .catch(() => {});

    const currentUser = auth.currentUser;
    if (!currentUser || isOwnListing) return;

    // Fetch current user's own skills (for the request modal)
    getDoc(doc(db, 'users', currentUser.uid))
      .then(snap => {
        if (snap.exists()) {
          setCurrentUserSkills(snap.data().skills || []);
        }
      })
      .catch(() => {});

    // Check for an existing pending/accepted request
    const checkExisting = async () => {
      try {
        const q = query(
          collection(db, 'barterRequests'),
          where('fromUserId', '==', currentUser.uid),
          where('listingId', '==', listing.id),
          where('status', 'in', ['pending', 'accepted']),
        );
        const snap = await getDocs(q);
        setAlreadyRequested(!snap.empty);
      } catch (err) {
        console.error('Check existing error:', err);
      }
    };
    checkExisting();
  }, [listing?.id]);

  useEffect(() => {
    if (!listing?.offerCategory) return;

    const fetchSimilar = async () => {
      try {
        const q = query(
          collection(db, 'listings'),
          where('offerCategory', '==', listing.offerCategory),
          where('active', '==', true),
          limit(4),
        );
        const snap = await getDocs(q);
        const docs = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(l => l.id !== listing.id)
          .slice(0, 3);
        setSimilarListings(docs);
      } catch (err) {
        console.error('Similar listings fetch error:', err);
      }
    };
    fetchSimilar();
  }, [listing?.id, listing?.offerCategory]);

  if (!listing) {
    return (
      <View style={styles.missingWrap}>
        <Text style={styles.missingText}>This listing could not be found.</Text>
      </View>
    );
  }

  const hasPhoto = !!listing.photoURL;

  const posterName = posterData?.name || listing.userName || 'User';
  const posterPhoto = posterData?.photoURL || listing.userPhoto || '';

  const handleShare = () => {
    Share.share({
      message: `Check out this skill swap on SkillsSwap!\n${listing.userName} is offering: ${capitalize(listing.offerSkill)}\nIn exchange for: ${capitalize(listing.wantSkill)}`,
      title: 'SkillsSwap — ' + capitalize(listing.offerSkill),
    });
  };

  const handleToggleActive = async () => {
    try {
      await updateDoc(doc(db, 'listings', listing.id), {
        active: !listingActive,
        updatedAt: serverTimestamp(),
      });
      setListingActive(prev => !prev);
    } catch {
      Alert.alert('Error', 'Failed to update listing');
    }
  };

  const handleGoToEditSkills = () => {
    setShowRequestModal(false);
    navigation.navigate('EditProfile');
  };

  const handleSendRequest = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      if (!selectedOfferSkill) {
        Alert.alert('Select a skill', 'Please select which skill you want to offer');
        return;
      }

      setRequestLoading(true);

      const existingQ = query(
        collection(db, 'barterRequests'),
        where('fromUserId', '==', currentUser.uid),
        where('listingId', '==', listing.id),
        where('status', 'in', ['pending', 'accepted']),
      );
      const existing = await getDocs(existingQ);
      if (!existing.empty) {
        Alert.alert('Already requested', 'You already have an active request for this listing');
        setShowRequestModal(false);
        setAlreadyRequested(true);
        return;
      }

      await addDoc(collection(db, 'barterRequests'), {
        fromUserId: currentUser.uid,
        fromUserName: currentUser.displayName || 'User',
        fromUserPhoto: currentUser.photoURL || '',
        fromUserSkill: selectedOfferSkill,
        toUserId: listing.userId,
        toUserName: listing.userName,
        listingId: listing.id,
        offerSkill: listing.offerSkill,
        wantSkill: listing.wantSkill,
        message: requestMessage.trim(),
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, 'listings', listing.id), { requests: increment(1) });

      setShowRequestModal(false);
      setAlreadyRequested(true);
      setRequestMessage('');
      setSelectedOfferSkill('');

      Alert.alert(
        '🎉 Request sent!',
        listing.userName + " will be notified of your request. You'll hear back soon!",
        [{ text: 'Great!' }],
      );
    } catch (err) {
      console.error('Request error:', err);
      Alert.alert('Error', 'Failed to send request. Try again.');
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Part 1: Hero ──────────────────────────────────────────────── */}
      <View style={styles.heroSection}>
        {/* Background layer (absolute, behind the foreground) */}
        {hasPhoto ? (
          <>
            <Image
              source={{ uri: listing.photoURL }}
              style={styles.heroImage}
              resizeMode="cover"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
            <View style={styles.heroImageOverlay} />
            {imageLoading && (
              <View style={styles.heroImageLoader}>
                <ActivityIndicator color={theme.purple} />
              </View>
            )}
          </>
        ) : (
          <>
            <View style={styles.decorCircleTop} />
            <View style={styles.decorCircleBottom} />
          </>
        )}

        {/* Foreground: button row (top) + skill text (centered below), as direct
            flex children of the fixed-height hero so they never overlap. */}
        <View style={[styles.heroButtonRow, { marginTop: insets.top + 10 }]}>
          <TouchableOpacity style={styles.heroButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <BackIcon color={theme.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.heroButton} onPress={handleShare} activeOpacity={0.8}>
            <ShareIcon color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        {!hasPhoto && (
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroSkillText} numberOfLines={2} ellipsizeMode="tail">
              {capitalize(listing.offerSkill)}
            </Text>
            <View style={styles.heroCategoryChip}>
              <Text style={styles.heroCategoryChipText}>{listing.offerCategory || 'Skill'}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.heroTransition} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Part 2: Poster info row ─────────────────────────────────── */}
        <View style={styles.posterRow}>
          {posterPhoto ? (
            <Image source={{ uri: posterPhoto }} style={styles.posterAvatarImage} resizeMode="cover" />
          ) : (
            <View style={styles.posterAvatarFallback}>
              <Text style={styles.posterAvatarInitial}>{getInitials(posterName)}</Text>
            </View>
          )}

          <View style={styles.posterInfo}>
            <Text style={styles.posterName} numberOfLines={1}>
              {posterName}
            </Text>
            <View style={styles.posterLocationRow}>
              <LocationPinIcon color={theme.textMuted} />
              <Text style={styles.posterCity}>{[listing.city, listing.country].filter(Boolean).join(', ')}</Text>
            </View>
            <View style={styles.posterRatingRow}>
              <StarRow rating={posterRating} styles={styles} />
              <Text style={styles.posterReviewsText}>({posterReviews} reviews)</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewProfileButton}
            onPress={() => navigation.navigate('UserProfile', { userId: listing.userId })}
            activeOpacity={0.7}
          >
            <Text style={styles.viewProfileButtonText}>View profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── Part 3: Swap details card ───────────────────────────────── */}
        <View style={styles.swapCard}>
          <Text style={styles.sectionTitle}>The Swap</Text>

          <View style={styles.swapRow}>
            <View style={styles.swapBoxOffer}>
              <Text style={styles.swapBoxLabel}>THEY OFFER</Text>
              <Text style={styles.swapOfferSkillText} numberOfLines={1}>
                {capitalize(listing.offerSkill)}
              </Text>
              <View style={styles.swapOfferBadge}>
                <Text style={styles.swapOfferBadgeText}>{listing.offerLevel || 'Any level'}</Text>
              </View>
            </View>

            <View style={styles.swapIconWrap}>
              <SwapIcon color={theme.textMuted} />
            </View>

            <View style={styles.swapBoxWant}>
              <Text style={styles.swapBoxLabel}>THEY WANT</Text>
              <Text style={styles.swapWantSkillText} numberOfLines={1}>
                {capitalize(listing.wantSkill)}
              </Text>
              <View style={styles.swapWantBadge}>
                <Text style={styles.swapWantBadgeText}>{listing.flexibility || 'Open'}</Text>
              </View>
            </View>
          </View>

          {!!listing.offerDescription && (
            <View style={styles.descriptionWrap}>
              <Text style={styles.descriptionLabel}>ABOUT THIS SKILL</Text>
              <Text style={styles.descriptionText}>{listing.offerDescription}</Text>
            </View>
          )}
        </View>

        {/* ── Part 4: Details card ─────────────────────────────────────── */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Details</Text>

          <View style={styles.detailRow}>
            <View style={[styles.detailIconBox, { backgroundColor: 'rgba(83,74,183,0.15)' }]}>
              <MonitorIcon color={theme.purple} />
            </View>
            <View style={styles.detailTextCol}>
              <Text style={styles.detailLabel}>Format</Text>
              <Text style={styles.detailValue}>{listing.preferredFormats?.join(', ') || 'Any'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={[styles.detailIconBox, { backgroundColor: 'rgba(29,158,117,0.15)' }]}>
              <PinIcon color={theme.teal} />
            </View>
            <View style={styles.detailTextCol}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>
                {listing.city ? [listing.city, listing.country].filter(Boolean).join(', ') : 'Location not specified'}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={[styles.detailIconBox, { backgroundColor: 'rgba(245,197,24,0.15)' }]}>
              <CalendarIcon color="#F5C518" />
            </View>
            <View style={styles.detailTextCol}>
              <Text style={styles.detailLabel}>Available</Text>
              <Text style={styles.detailValue}>{listing.availableDays?.join(', ') || 'Flexible'}</Text>
              {!!listing.availableTimes?.length && (
                <Text style={styles.detailValueSub}>{listing.availableTimes.join(', ')}</Text>
              )}
            </View>
          </View>

          <View style={[styles.detailRow, styles.detailRowLast]}>
            <View style={[styles.detailIconBox, { backgroundColor: 'rgba(136,135,128,0.15)' }]}>
              <ClockIcon color={theme.textMuted} />
            </View>
            <View style={styles.detailTextCol}>
              <Text style={styles.detailLabel}>Posted</Text>
              <Text style={styles.detailValue}>{timeAgo(listing.createdAt?.toDate?.())}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <EyeIcon color={theme.textMuted} />
              <Text style={styles.statChipText}>{listing.views || 0} views</Text>
            </View>
            <View style={styles.statChip}>
              <RequestsIcon color={theme.textMuted} />
              <Text style={styles.statChipText}>{listing.requests || 0} requests</Text>
            </View>
          </View>
        </View>

        {/* ── Part 5: Similar listings ─────────────────────────────────── */}
        {similarListings.length > 0 && (
          <View style={styles.similarSection}>
            <Text style={styles.sectionTitle}>Similar Listings</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarScrollContent}
            >
              {similarListings.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.similarCard}
                  onPress={() => navigation.push('ListingDetail', { listing: item })}
                  activeOpacity={0.8}
                >
                  <View style={styles.similarAvatarRow}>
                    <View style={styles.similarAvatar}>
                      <Text style={styles.similarAvatarText}>{getInitials(item.userName)}</Text>
                    </View>
                    <Text style={styles.similarUserName} numberOfLines={1}>
                      {item.userName}
                    </Text>
                  </View>

                  <Text style={styles.similarOfferSkill} numberOfLines={1}>
                    {capitalize(item.offerSkill)}
                  </Text>
                  <Text style={styles.similarWantSkill} numberOfLines={1}>
                    ↔ {capitalize(item.wantSkill)}
                  </Text>

                  <View style={styles.similarBottomRow}>
                    <Text style={styles.similarCity} numberOfLines={1}>
                      {item.city || ''}
                    </Text>
                    <Text style={styles.similarViewLink}>View →</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── Part 6: Fixed bottom action bar ──────────────────────────────── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        {isOwnListing ? (
          <View style={styles.bottomBarRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('PostListing', { editMode: true, listing })}
              activeOpacity={0.8}
            >
              <Text style={styles.editButtonText}>Edit listing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleActiveButton,
                listingActive ? styles.toggleActiveButtonPause : styles.toggleActiveButtonReactivate,
              ]}
              onPress={handleToggleActive}
              activeOpacity={0.8}
            >
              <Text style={listingActive ? styles.toggleActiveTextPause : styles.toggleActiveTextReactivate}>
                {listingActive ? 'Pause' : 'Reactivate'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : alreadyRequested ? (
          <>
            <TouchableOpacity style={[styles.requestButton, styles.requestButtonAlready]} disabled activeOpacity={1}>
              <Text style={styles.requestButtonText}>Request Sent ✓</Text>
            </TouchableOpacity>
            <Text style={styles.pendingHintText}>Pending response from poster</Text>
          </>
        ) : (
          <TouchableOpacity
            style={styles.requestButton}
            onPress={() => setShowRequestModal(true)}
            activeOpacity={0.85}
          >
            <SwapIcon color="#FFFFFF" size={18} />
            <Text style={styles.requestButtonText}>Request Swap</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Request swap modal ───────────────────────────────────────────── */}
      <Modal visible={showRequestModal} animationType="slide" transparent onRequestClose={() => setShowRequestModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDismissArea} onPress={() => setShowRequestModal(false)} />

          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.modalDragHandle} />

            <Text style={styles.modalTitle}>Send Swap Request</Text>
            <Text style={styles.modalSubtitle}>to {listing.userName}</Text>

            <Text style={styles.modalSectionLabel}>YOU'RE OFFERING</Text>

            {currentUserSkills.length === 0 ? (
              <View style={styles.noSkillsWarning}>
                <Text style={styles.noSkillsWarningText}>
                  Add skills to your profile first before requesting a swap
                </Text>
                <TouchableOpacity onPress={handleGoToEditSkills} activeOpacity={0.7}>
                  <Text style={styles.noSkillsLink}>Go to Profile →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.skillChipRow}>
                  {currentUserSkills.map(skill => {
                    const selected = selectedOfferSkill === skill;
                    return (
                      <TouchableOpacity
                        key={skill}
                        style={[styles.skillChip, selected && styles.skillChipSelected]}
                        onPress={() => setSelectedOfferSkill(skill)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.skillChipText, selected && styles.skillChipTextSelected]}>{skill}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Text style={styles.skillHint}>Select the skill you'll teach in return</Text>

                <Text style={styles.messageInputLabel}>ADD A MESSAGE (optional)</Text>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Introduce yourself and explain why you'd be a great swap partner..."
                  placeholderTextColor={theme.textMuted}
                  value={requestMessage}
                  onChangeText={setRequestMessage}
                  multiline
                  maxLength={300}
                />

                <TouchableOpacity
                  style={[styles.sendButton, !selectedOfferSkill && styles.sendButtonDisabled]}
                  onPress={handleSendRequest}
                  disabled={!selectedOfferSkill || requestLoading}
                  activeOpacity={0.85}
                >
                  {requestLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.sendButtonText}>Send Request →</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ListingDetailScreen;
