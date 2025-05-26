import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BottomNav = ({ navigation, currentScreen, onMapPress }) => {
  const navItems = [
    {
      name: 'Home',
      icon: 'home',
      screen: 'Home',
    },
    {
      name: 'Map',
      icon: 'map',
      screen: 'Home',
      onPress: () => {
        navigation.navigate('Home');
        if (onMapPress) {
          onMapPress();
        }
      },
    },
    {
      name: 'Report',
      icon: 'add-circle',
      screen: 'ReportIncident',
    },
    {
      name: 'Statistics',
      icon: 'bar-chart',
      screen: 'Statistics',
    },
    {
      name: 'Profile',
      icon: 'person',
      screen: 'Profile',
    },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.navItem}
          onPress={item.onPress || (() => navigation.navigate(item.screen))}
        >
          <Icon
            name={item.icon}
            size={24}
            color={currentScreen === item.screen ? '#4a5c39' : '#6b7a5e'}
          />
          <Text
            style={[
              styles.navText,
              currentScreen === item.screen && styles.activeNavText,
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 10,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 44 : 32,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopWidth: 1,
    borderTopColor: '#e0e4da',
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
    color: '#4a5c39',
  },
});

export default BottomNav; 