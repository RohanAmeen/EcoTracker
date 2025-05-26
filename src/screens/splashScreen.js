import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeIn"
        duration={1500}
        style={styles.content}
      >
        <Animatable.Image
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          duration={2000}
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Animatable.Text
          animation="fadeInUp"
          delay={500}
          duration={1000}
          style={styles.title}
        >
          EcoTracker
        </Animatable.Text>
        <Animatable.Text
          animation="fadeInUp"
          delay={800}
          duration={1000}
          style={styles.tagline}
        >
          Community Environmental Protection Platform
        </Animatable.Text>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4a5c39',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 0,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#e0e4da',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default SplashScreen; 