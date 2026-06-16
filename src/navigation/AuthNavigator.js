import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen   from '../screens/auth/SplashScreen';
import LoginScreen    from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash"    component={SplashScreen} />
    <Stack.Screen name="Login"     component={LoginScreen} />
    <Stack.Screen name="Register"  component={RegisterScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
