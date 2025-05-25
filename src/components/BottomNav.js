import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BottomNav = ({ navigation, currentScreen }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('Home')}
      >
        <Icon 
          name="home" 
          size={24} 
          color={currentScreen === 'Home' ? '#2A7B9B' : '#2E8B57'} 
        />
        <Text style={[styles.navText, currentScreen === 'Home' && styles.activeNavText]}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('Map')}
      >
        <Icon 
          name="map" 
          size={24} 
          color={currentScreen === 'Map' ? '#2A7B9B' : '#2E8B57'} 
        />
        <Text style={[styles.navText, currentScreen === 'Map' && styles.activeNavText]}>Map</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('ReportIncident')}
      >
        <Icon 
          name="add-circle" 
          size={24} 
          color={currentScreen === 'ReportIncident' ? '#2A7B9B' : '#2E8B57'} 
        />
        <Text style={[styles.navText, currentScreen === 'ReportIncident' && styles.activeNavText]}>Report</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Icon 
          name="notifications" 
          size={24} 
          color={currentScreen === 'Notifications' ? '#2A7B9B' : '#2E8B57'} 
        />
        <Text style={[styles.navText, currentScreen === 'Notifications' && styles.activeNavText]}>Alerts</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('Profile')}
      >
        <Icon 
          name="person" 
          size={24} 
          color={currentScreen === 'Profile' ? '#2A7B9B' : '#2E8B57'} 
        />
        <Text style={[styles.navText, currentScreen === 'Profile' && styles.activeNavText]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 10,
    paddingTop: 8,
    paddingBottom: 28,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  navText: {
    fontSize: 11,
    color: '#4a5c39',
    marginTop: 4,
    fontWeight: '600',
  },
  activeNavText: {
    color: '#27B9B',
  },
});

export default BottomNav; 