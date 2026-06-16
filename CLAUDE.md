@AGENTS.md

# Screens status

- ProfileScreen: ✅ fully built (hero, stats, skills, appearance toggle, listings/reviews preview, quick actions, sign out, skeleton loading)
- EditProfileScreen: ✅ built (`src/screens/stack/EditProfileScreen.js`) — uses the `getStyles(theme)` pattern, updates both Firebase Auth (`displayName`, `photoURL`) and the Firestore `users` doc

# Stack screens

- ListingDetail, PostListing, UserProfile, ChatRoom, LeaveReview, Settings, MyListings, EditProfile

# Theme system

- `src/theme/ThemeContext.js` — DARK/LIGHT palettes, persisted via AsyncStorage (`theme_preference`), exposes `useTheme()` → `{ theme, isDark, toggleTheme }`
- Toggle UI lives in ProfileScreen's Appearance card
- Style pattern: `getStyles(theme)` function exported from `*.styles.js`, called with `theme` from `useTheme()` — every screen and `CityPicker` use this pattern now
- `src/theme/colors.js` (the old static `BRAND` palette) was removed — fully replaced by ThemeContext. `src/components/Logo.js` keeps its own small embedded color constant since the logo mark is brand-locked artwork, not theme-driven
- Elements sitting on a constant-color surface (e.g. white text/icon on a purple button or avatar, or Google's brand-locked white sign-in button) use hardcoded `#FFFFFF`/brand colors instead of `theme.textPrimary`, since that surface's color doesn't change between themes
- Each screen sets its own `<StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />` — there's no global StatusBar

# Layout

- Screens use `SafeAreaView` for top-inset handling; headers use a fixed `paddingTop` (e.g. 12) rather than adding `insets.top` on top of it — doing both double-counts the safe area and creates excess top spacing (was a bug in ProfileScreen and MyListingsScreen, now fixed). `PostListingScreen` is the exception: it has no `SafeAreaView`, so it correctly adds `insets.top` manually.
