import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications appear when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permissions for notifications
export const requestNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return false;
  }
  
  return true;
};

// Send a local notification
export const sendLocalNotification = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // null means show immediately
  });
};

// Get the push token for the device
export const getPushToken = async () => {
  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-expo-project-id', // You'll need to replace this with your Expo project ID
    });
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}; 