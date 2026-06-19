import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useTheme } from '../../theme/ThemeContext';
import getStyles from './LeaveReviewScreen.styles';

const RATING_HINTS = {
  0: 'Tap a star to rate',
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Excellent',
};

const LeaveReviewScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);
  const {
    requestId,
    chatId, // eslint-disable-line no-unused-vars
    toUserId,
    toUserName,
    canReviewWithoutConfirmation = false,
  } = route.params || {};

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reviewee = toUserName && toUserName !== 'Anonymous' ? toUserName : 'this user';

  const handleSubmit = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    if (!toUserId) {
      Alert.alert('Error', 'Missing the person to review.');
      return;
    }
    if (rating < 1) {
      Alert.alert('Add a rating', 'Please tap a star to rate your swap experience.');
      return;
    }

    setSubmitting(true);
    try {
      // Early reviews (other party hasn't confirmed yet) are held as
      // 'pending_confirmation'; confirmed swaps publish immediately.
      const reviewStatus = canReviewWithoutConfirmation ? 'pending_confirmation' : 'published';

      await addDoc(collection(db, 'reviews'), {
        fromUserId: currentUser.uid,
        fromUserName: currentUser.displayName || 'User',
        fromUserPhoto: currentUser.photoURL || '',
        toUserId,
        toUserName: toUserName || '',
        requestId: requestId || '',
        rating,
        comment: comment.trim(),
        status: reviewStatus,
        createdAt: serverTimestamp(),
      });

      // Mark on the request that this user has reviewed (drives the
      // "✓ You left a review" state in ChatRoom / Requests).
      if (requestId) {
        try {
          await updateDoc(doc(db, 'barterRequests', requestId), {
            [`reviewLeft_${currentUser.uid}`]: true,
          });
        } catch (flagErr) {
          console.error('Review flag update error:', flagErr);
        }
      }

      // Only published reviews count toward the public aggregate rating.
      if (reviewStatus === 'published') {
        try {
          const snap = await getDocs(
            query(collection(db, 'reviews'), where('toUserId', '==', toUserId)),
          );
          const ratings = snap.docs
            .filter(d => (d.data().status || 'published') === 'published')
            .map(d => d.data().rating)
            .filter(r => typeof r === 'number');
          const count = ratings.length;
          const avg = count ? ratings.reduce((a, b) => a + b, 0) / count : rating;
          await updateDoc(doc(db, 'users', toUserId), {
            rating: Math.round(avg * 10) / 10,
            reviewCount: count,
          });
        } catch (aggErr) {
          // Review is saved; failing to update the aggregate is non-fatal.
          console.error('Rating aggregate update error:', aggErr);
        }
      }

      if (canReviewWithoutConfirmation) {
        Alert.alert(
          'Review saved!',
          `Your review will be published once ${reviewee} confirms the swap is complete.`,
          [{ text: 'OK', onPress: () => navigation.navigate('Main') }],
        );
      } else {
        Alert.alert(
          'Review published!',
          `Thank you! Your review is now live on ${reviewee}'s profile.`,
          [{ text: 'Done', onPress: () => navigation.navigate('Main') }],
        );
      }
    } catch (err) {
      console.error('Submit review error:', err);
      Alert.alert('Error', 'Could not submit your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave a Review</Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Early-review / confirmed banners */}
          {canReviewWithoutConfirmation ? (
            <View style={styles.infoBanner}>
              <Text style={styles.infoIcon}>ⓘ</Text>
              <View style={styles.infoTextWrap}>
                <Text style={styles.infoTitle}>You're leaving an early review</Text>
                <Text style={styles.infoBody}>
                  This swap is still pending confirmation from {reviewee}. Your review will be posted
                  once the swap is confirmed, or after 48 hours automatically.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.successBanner}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successText}>
                Swap confirmed complete! Leave {reviewee} a review.
              </Text>
            </View>
          )}

          <Text style={styles.prompt}>How was your swap with</Text>
          <Text style={styles.revieweeName}>{reviewee}?</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
                style={styles.starButton}
              >
                <Text style={[styles.star, star <= rating ? styles.starFilled : styles.starEmpty]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingHint}>{RATING_HINTS[rating]}</Text>

          <Text style={styles.label}>YOUR REVIEW (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Share details about your skill swap experience..."
            placeholderTextColor={theme.textMuted}
            value={comment}
            onChangeText={setComment}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[styles.submitButton, (rating < 1 || submitting) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={rating < 1 || submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Review</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LeaveReviewScreen;
