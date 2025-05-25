import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../AuthContext';
import { CommonActions } from '@react-navigation/native';

import SplashScreen from '../screens/splashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ReportIncident from '../screens/ReportIncident';
import Profile from '../screens/Profile';
import ChangePassword from '../screens/ChangePassword';
import IncidentDetails from '../screens/IncidentDetails';
import ReportsScreen from '../screens/ReportsScreen';

const Stack = createStackNavigator();

// Stack for authenticated screens
const AuthenticatedStack = () => {
  const { isLoggedIn, user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isLoggedIn || !user) {
      // If user is not logged in or user data is missing, reset the navigation state and redirect to login
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    }
  }, [isLoggedIn, user, navigation]);

  if (!isLoggedIn || !user) {
    return null; // Don't render anything if not logged in or user data is missing
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ReportIncident" component={ReportIncident} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="IncidentDetails" component={IncidentDetails} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
    </Stack.Navigator>
  );
};

// Stack for unauthenticated screens
const UnauthenticatedStack = () => {
  const { isLoggedIn, user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isLoggedIn && user) {
      // If user is logged in and has user data, redirect to home
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
    }
  }, [isLoggedIn, user, navigation]);

  if (isLoggedIn && user) {
    return null; // Don't render anything if logged in and has user data
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { isLoggedIn, user, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn && user ? <AuthenticatedStack /> : <UnauthenticatedStack />}
    </NavigationContainer>
  );
};

export default AppNavigator; 