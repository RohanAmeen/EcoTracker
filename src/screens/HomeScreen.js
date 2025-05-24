import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
  TextInput,
  FlatList,
  SafeAreaView as RNSafeAreaView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { useAuth } from '../AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import { SafeAreaView as RNSafeAreaViewContext } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }) => {
  const { isLoggedIn } = useAuth();
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please allow location access to see issues near you.',
          [{ text: 'OK' }]
        );
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  // Dummy data for markers
  const markers = [
    {
      id: 1,
      coordinate: {
        latitude: 37.78825,
        longitude: -122.4324,
      },
      title: 'Illegal Dumping',
      description: 'Large pile of construction waste',
      type: 'trash',
      severity: 'high',
      status: 'new',
    },
  ];

  // Dummy data for recent incidents
  const recentIncidents = [
    { id: '1', title: 'Illegal Dumping', time: '2h ago', type: 'trash' },
    { id: '2', title: 'Air Pollution', time: '5h ago', type: 'air' },
    { id: '3', title: 'Water Contamination', time: '1d ago', type: 'water' },
  ];

  const handleMarkerPress = (marker) => {
    navigation.navigate('IncidentDetails', { incident: marker });
  };

  const handleQuickReport = () => {
    navigation.navigate('ReportIncident');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <RNSafeAreaViewContext style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      {/* Header */}
      <LinearGradient
        colors={["#b7c9a8", "#8ca982"]}
        style={styles.gradientHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>EcoTracker</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {!isLoggedIn && (
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.menuButton}>
              <Icon name="menu" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={22} color="#888" style={{ marginLeft: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search location..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity>
          <Icon name="my-location" size={22} color="#888" style={{ marginRight: 10 }} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              onPress={() => handleMarkerPress(marker)}
            />
          ))}
        </MapView>
        <Text style={styles.mapLabel}>[Interactive Map]</Text>
      </View>

      {/* Dashboard Buttons */}
      <View style={styles.dashboardButtons}>
        <TouchableOpacity style={styles.reportButton} onPress={handleQuickReport}>
          <Icon name="add" size={24} color="#2d3a22" />
          <Text style={styles.reportButtonText}>Report Environmental Incident</Text>
          <Icon name="chevron-right" size={22} color="#2d3a22" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.emergencyButton}>
          <Icon name="error" size={24} color="#fff" />
          <Text style={styles.emergencyButtonText}>Emergency Report</Text>
          <Icon name="chevron-right" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewReportsButton}>
          <Icon name="list" size={24} color="#2d3a22" />
          <Text style={styles.viewReportsButtonText}>View My Reports</Text>
          <Icon name="chevron-right" size={22} color="#2d3a22" />
        </TouchableOpacity>
      </View>

      {/* Recent Incidents */}
      <View style={styles.recentIncidentsContainer}>
        <Text style={styles.recentIncidentsTitle}>Recent Incidents</Text>
        <FlatList
          data={recentIncidents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.incidentItem}>
              <Icon name="delete" size={20} color="#4caf50" style={{ marginRight: 8 }} />
              <Text style={styles.incidentTitle}>{item.title}</Text>
              <Text style={styles.incidentTime}>{item.time}</Text>
            </View>
          )}
        />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#4caf50" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="map" size={24} color="#4caf50" />
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="add-circle" size={24} color="#4caf50" />
          <Text style={styles.navText}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="notifications" size={24} color="#4caf50" />
          <Text style={styles.navText}>Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleProfile}>
          <Icon name="person" size={24} color="#4caf50" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </RNSafeAreaViewContext>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f5ef',
  },
  gradientHeader: {
    padding: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  loginButton: {
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  loginButtonText: {
    color: '#8ca17a',
    fontWeight: 'bold',
    fontSize: 15,
  },
  menuButton: {
    padding: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
  },
  mapContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 140,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  mapLabel: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    color: '#6b6b6b',
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 0.5,
  },
  dashboardButtons: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
  },
  reportButtonText: {
    flex: 1,
    marginLeft: 8,
    color: '#2d3a22',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a5c39',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  emergencyButtonText: {
    flex: 1,
    marginLeft: 8,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  viewReportsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
  },
  viewReportsButtonText: {
    flex: 1,
    marginLeft: 8,
    color: '#2d3a22',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recentIncidentsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 12,
    marginBottom: 70,
    elevation: 1,
  },
  recentIncidentsTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 8,
    color: '#2d3a22',
  },
  incidentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  incidentTitle: {
    flex: 1,
    color: '#333',
    fontSize: 15,
  },
  incidentTime: {
    color: '#888',
    fontSize: 13,
    marginLeft: 8,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 10,
    paddingVertical: 6,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    color: '#4caf50',
    marginTop: 2,
  },
});

export default HomeScreen; 