import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import IncidentDetails from './src/screens/IncidentDetails';
import ReportIncident from './src/screens/ReportIncident';
import * as SplashScreen from 'expo-splash-screen';
import splashScreen from './src/screens/splashScreen';
import { AuthProvider } from './src/AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();

      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="splashScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="splashScreen" component={splashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="IncidentDetails" component={IncidentDetails} />
          <Stack.Screen name="ReportIncident" component={ReportIncident} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
