import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Change to your login screen name
    }, 3000);
   
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#f6efdc', '#6b7d5c', '#f6efdc']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Animatable.View
        animation="fadeInUp"
        duration={2000}
        style={styles.content}
      >
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>EcoTracker</Text>
        <Text style={styles.tagline}>Community Environmental Protection Platform</Text>
      </Animatable.View>
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '90%',
  },
  logo: {
    width: width * 0.7, // 70% of screen width
    height: width * 0.7,
    marginBottom: 30,
  },
  title: {
    color: '#3a4a2d',
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  tagline: {
    color: '#5a6a4a',
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
  },
});

export default SplashScreen; 