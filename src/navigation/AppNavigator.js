import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import ProfileSetup1 from '../screens/auth/ProfileSetup1';
import ProfileSetup2 from '../screens/auth/ProfileSetup2';
import ProfileSetup3 from '../screens/auth/ProfileSetup3';
import MainTabNavigator from './MainTabNavigator';
import MemberDirectoryScreen from '../screens/MemberDirectoryScreen';
// import MemberProfileScreen from '../screens/MemberProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Splash"        component={SplashScreen} />
      <Stack.Screen name="Onboarding"    component={OnboardingScreen} />
      <Stack.Screen name="Login"         component={LoginScreen} />
      <Stack.Screen name="OTP"           component={OTPScreen} />
      <Stack.Screen name="ProfileSetup1" component={ProfileSetup1} />
      <Stack.Screen name="ProfileSetup2" component={ProfileSetup2} />
      <Stack.Screen name="ProfileSetup3" component={ProfileSetup3} />
      <Stack.Screen name="Main"            component={MainTabNavigator} />
      <Stack.Screen name="MemberDirectory" component={MemberDirectoryScreen} />
      {/* <Stack.Screen name="MemberProfile"   component={MemberProfileScreen} /> */}
    </Stack.Navigator>
  );
}
