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
import BottomNav from '../components/BottomNav';

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
      date: '2023-10-27',
      reportedBy: 'Anonymous',
      images: [
        'https://via.placeholder.com/300/b7c9a8/000000?text=Dumping+Photo+1',
        'https://via.placeholder.com/300/8ca982/ffffff?text=Dumping+Photo+2',
      ],
      locationDetails: 'Near Oak Street and Pine Avenue',
      updates: [
        { id: 1, text: 'Report received and under review.', date: '2023-10-27', status: 'new' },
        { id: 2, text: 'Cleanup scheduled for next week.', date: '2023-10-30', status: 'in-progress' },
      ],
    },
    {
      id: 2,
      coordinate: {
        latitude: 37.79525,
        longitude: -122.4434,
      },
      title: 'Air Pollution',
      description: 'Strong odor from nearby factory',
      type: 'air',
      severity: 'medium',
      status: 'in-progress',
      date: '2023-10-26',
      reportedBy: 'Alice',
      images: [
        'https://via.placeholder.com/300/8ca982/ffffff?text=Air+Photo+1',
      ],
      locationDetails: 'Industrial Zone A',
      updates: [
        { id: 1, text: 'Investigation started.', date: '2023-10-26', status: 'in-progress' },
      ],
    },
     {
      id: 3,
      coordinate: {
        latitude: 37.77525,
        longitude: -122.4184,
      },
      title: 'Water Contamination',
      description: 'Unusual color in the river',
      type: 'water',
      severity: 'high',
      status: 'new',
      date: '2023-10-25',
      reportedBy: 'Bob',
      images: [
        'https://via.placeholder.com/300/b7c9a8/000000?text=Water+Photo+1',
        'https://via.placeholder.com/300/8ca982/ffffff?text=Water+Photo+2',
         'https://via.placeholder.com/300/b7c9a8/000000?text=Water+Photo+3',
      ],
      locationDetails: 'Downtown Riverwalk',
      updates: [
        { id: 1, text: 'Sample collected for testing.', date: '2023-10-25', status: 'new' },
      ],
    },
  ];

  // Dummy data for recent incidents
  const recentIncidents = [
    { id: '1', title: 'Illegal Dumping', time: '2h ago', type: 'trash' },
    { id: '2', title: 'Air Pollution', time: '5h ago', type: 'air' },
    { id: '3', title: 'Water Contamination', time: '1d ago', type: 'water' },
  ];

  // Add dummy leaderboard data
  const leaderboardData = [
    { id: '1', name: 'Alice', points: 1200 },
    { id: '2', name: 'Bob', points: 1100 },
    { id: '3', name: 'Charlie', points: 1050 },
    { id: '4', name: 'Diana', points: 950 },
    { id: '5', name: 'Ethan', points: 900 },
    { id: '6', name: 'Fiona', points: 850 },
    { id: '7', name: 'George', points: 800 },
    { id: '8', name: 'Hannah', points: 780 },
    { id: '9', name: 'Ivan', points: 760 },
    { id: '10', name: 'Julia', points: 750 },
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
        colors={["#2A7B9B", "#57C785", "#2A7B9B"]}
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
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={22} color="#888" style={{ marginLeft: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search location..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.searchIconRight}>
            <Icon name="my-location" size={22} color="#888" />
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
        <View style={styles.dashboardButtonsContainer}>
          <TouchableOpacity style={styles.reportButton} onPress={handleQuickReport}>
            <Icon name="add" size={24} color="#2d3a22" style={styles.buttonLeadingIcon} />
            <Text style={styles.reportButtonText}>Report Environmental Incident</Text>
            <Icon name="chevron-right" size={24} color="#2d3a22" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.emergencyButton}>
            <Icon name="error-outline" size={24} color="#fff" style={styles.buttonLeadingIcon} />
            <Text style={styles.emergencyButtonText}>Emergency Report</Text>
            <Icon name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewReportsButton}>
            <Icon name="list-alt" size={24} color="#2d3a22" style={styles.buttonLeadingIcon} />
            <Text style={styles.viewReportsButtonText}>View My Reports</Text>
            <Icon name="chevron-right" size={24} color="#2d3a22" />
          </TouchableOpacity>
        </View>
        {/* Recent Incidents */}
        <View style={styles.recentIncidentsSection}>
          <Text style={styles.sectionTitle}>Recent Incidents</Text>
          <FlatList
            data={recentIncidents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.incidentItem}>
                <Icon name="delete" size={20} color="#8ca982" style={{ marginRight: 8 }} />
                <Text style={styles.incidentTitle}>{item.title}</Text>
                <Text style={styles.incidentTime}>{item.time}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.incidentSeparator} />}
          />
        </View>
        {/* Leaderboard */}
        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          {leaderboardData.map((user, idx) => (
            <View
              key={user.id}
              style={[
                styles.leaderboardItem,
                idx === 0 && styles.goldRank,
                idx === 1 && styles.silverRank,
                idx === 2 && styles.bronzeRank,
              ]}
            >
              <Text style={styles.leaderboardRankText}>{idx + 1}</Text>
              <Text style={styles.leaderboardName}>{user.name}</Text>
              <Text style={styles.leaderboardPoints}>{user.points} pts</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} currentScreen="Home" />
    </RNSafeAreaViewContext>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0ede3',
  },
  scrollViewContent: {
    paddingBottom: 90,
    paddingTop: 0,
  },
  gradientHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
    opacity: 0.8,
  },
  logoText: {
    fontSize: 20,
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
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  searchIconRight: {
    padding: 6,
  },
  mapContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 180,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapLabel: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
    color: '#6b6b6b',
    fontSize: 18,
    fontWeight: 'bold',
    opacity: 0.6,
  },
  dashboardButtonsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportButtonText: {
    flex: 1,
    marginLeft: 10,
    color: '#2d3a22',
    fontWeight: '600',
    fontSize: 16,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a5c39',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emergencyButtonText: {
    flex: 1,
    marginLeft: 10,
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  viewReportsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewReportsButtonText: {
    flex: 1,
    marginLeft: 10,
    color: '#2d3a22',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonLeadingIcon: {
    marginRight: 6,
  },
  recentIncidentsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leaderboardSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2d3a22',
    marginBottom: 12,
  },
  incidentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  incidentTitle: {
    flex: 1,
    color: '#333',
    fontSize: 15,
  },
  incidentTime: {
    color: '#888',
    fontSize: 13,
  },
  incidentSeparator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 4,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  leaderboardRankText: {
    width: 30,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2d3a22',
    textAlign: 'center',
  },
  leaderboardName: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 8,
  },
  leaderboardPoints: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#4a5c39',
  },
  goldRank: {
    backgroundColor: '#fff9e6',
  },
  silverRank: {
    backgroundColor: '#f2f2f2',
  },
  bronzeRank: {
    backgroundColor: '#f4ebe3',
  },
});

export default HomeScreen; 