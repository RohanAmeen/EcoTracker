import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ReportIncident" component={ReportIncident} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="IncidentDetails" component={IncidentDetails} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 