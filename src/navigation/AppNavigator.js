import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen       from '../screens/auth/SplashScreen';
import LoginScreen        from '../screens/auth/LoginScreen';
import RegisterScreen     from '../screens/auth/RegisterScreen';

import TabNavigator       from './TabNavigator';

import ListingDetailScreen from '../screens/stack/ListingDetailScreen';
import PostListingScreen   from '../screens/stack/PostListingScreen';
import UserProfileScreen   from '../screens/stack/UserProfileScreen';
import ChatRoomScreen      from '../screens/stack/ChatRoomScreen';
import LeaveReviewScreen   from '../screens/stack/LeaveReviewScreen';
import SettingsScreen      from '../screens/stack/SettingsScreen';
import MyListingsScreen    from '../screens/stack/MyListingsScreen';
import EditProfileScreen   from '../screens/stack/EditProfileScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* Auth flow */}
    <Stack.Screen name="Splash"   component={SplashScreen} />
    <Stack.Screen name="Login"    component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />

    {/* Main app — tabs live here; LoginScreen calls navigation.replace('Main') */}
    <Stack.Screen name="Main" component={TabNavigator} />

    {/* Stack screens reachable from any tab */}
    <Stack.Screen name="ListingDetail" component={ListingDetailScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PostListing"   component={PostListingScreen} />
    <Stack.Screen name="UserProfile"   component={UserProfileScreen} />
    <Stack.Screen name="ChatRoom"      component={ChatRoomScreen} />
    <Stack.Screen name="LeaveReview"   component={LeaveReviewScreen} />
    <Stack.Screen name="Settings"      component={SettingsScreen} />
    <Stack.Screen name="MyListings"    component={MyListingsScreen} />
    <Stack.Screen name="EditProfile"   component={EditProfileScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export default AppNavigator;
