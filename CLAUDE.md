@AGENTS.md

# Screens status

- ProfileScreen: ✅ fully built (hero, stats, skills, appearance toggle, listings/reviews preview, quick actions, sign out, skeleton loading)
- EditProfileScreen: ✅ built (`src/screens/stack/EditProfileScreen.js`) — uses the `getStyles(theme)` pattern, updates both Firebase Auth (`displayName`, `photoURL`) and the Firestore `users` doc
- ListingDetailScreen: ✅ fully built — has a request modal with skill selector + duplicate-request check, own-listing detection (Edit/Pause vs Request Swap), and a similar-listings section. Uses `getStyles(theme)`, SVG icons for the views/requests stat chips (emoji don't render reliably on iOS), and the no-photo hero fallback shows an avatar circle + skill name rather than a giant single letter (a lone "I" rendered as a broken-looking vertical line)

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

- Screens use `SafeAreaView` for top-inset handling; headers use a fixed `paddingTop` (e.g. 12) rather than adding `insets.top` on top of it — doing both double-counts the safe area and creates excess top spacing (was a bug in ProfileScreen and MyListingsScreen, now fixed). `PostListingScreen` and `ListingDetailScreen` are the exceptions: neither uses `SafeAreaView` (the latter needs an edge-to-edge hero image behind the status bar), so both correctly add `insets.top`/`insets.bottom` manually via `useSafeAreaInsets()`.
