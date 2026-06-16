# SkillsSwap

A skill-bartering mobile app where people trade what they know — teach guitar, learn Spanish; teach cooking, learn coding. No money changes hands.

Built with React Native (Expo) and Firebase.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 56 / React Native 0.85 |
| Navigation | React Navigation v7 (Stack + Bottom Tabs) |
| Backend | Firebase v12 (Auth, Firestore, Storage) |
| State | Zustand + TanStack Query |
| UI | Custom dark-theme components, react-native-svg icons |
| Image uploads | Cloudinary (unsigned preset) |

---

## Features

- Email/password and Google sign-in
- Browse live skill listings with search and category filters
- Near Me tab — location-based listing discovery with radius slider
- Post a listing: offer one skill, request another
- Swap requests with real-time status updates
- In-app chat between matched users
- User profiles with skill tags and reviews

---

## Getting Started

### Prerequisites

- Node 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or the Expo Go app)

### 1. Clone and install

```bash
git clone https://github.com/your-username/SkillsSwap.git
cd SkillsSwap
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in your Cloudinary credentials in `.env`. Firebase config lives directly in `src/config/firebase.js` (Firebase Web SDK keys are intentionally public — security is enforced through Firestore Rules).

### 3. Run

```bash
# Start Metro
npx expo start

# Open on device
# Press i → iOS Simulator
# Press a → Android Emulator
# Scan QR → Expo Go on a physical device
```

---

## Project Structure

```
src/
├── config/         # Firebase init
├── navigation/     # AppNavigator, TabNavigator
├── screens/
│   ├── auth/       # Splash, Login, Register
│   ├── main/       # Browse, Near Me, Chats, Requests, Profile
│   └── stack/      # ListingDetail, PostListing, UserProfile, …
├── components/     # Avatar, ListingCard, StarRating, …
├── hooks/          # useAuth, useListings
├── services/       # Cloudinary upload helper
├── store/          # Zustand stores
└── theme/          # colors.js
```

---

## Firestore Collections

| Collection | Purpose |
|---|---|
| `listings` | Skill swap posts (`offerSkill`, `wantSkill`, `active`, `createdAt`) |
| `barterRequests` | Swap requests between users (`status: pending/accepted/rejected`) |
| `users` | Profile data, skill tags, city, rating |
| `chats` | Chat rooms (subcollection `messages`) |
| `reviews` | Post-swap reviews |
