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
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { useAuth } from '../AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import { SafeAreaView as RNSafeAreaViewContext } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import { CommonActions } from '@react-navigation/native';
import { incidentsAPI, usersAPI } from '../services/api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }) => {
  const { isLoggedIn, signOut, setNavigation } = useAuth();
  const [region, setRegion] = useState({
    latitude: 30.3753,  // Center of Pakistan
    longitude: 69.3451, // Center of Pakistan
    latitudeDelta: 8,   // Closer zoom level to show Pakistan
    longitudeDelta: 8,  // Closer zoom level to show Pakistan
  });
  const [search, setSearch] = useState('');
  const [isReportPressed, setIsReportPressed] = useState(false);
  const [isViewReportsPressed, setIsViewReportsPressed] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    setNavigation(navigation);
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

  useEffect(() => {
    if (!isLoggedIn) {
      // If user is not logged in, redirect to login
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchRecentIncidents();
    fetchLeaderboard();
  }, []);

  const fetchRecentIncidents = async () => {
    try {
      setLoading(true);
      const incidents = await incidentsAPI.getRecentIncidents();
      setRecentIncidents(incidents);
    } catch (error) {
      console.error('Error fetching recent incidents:', error);
      Alert.alert('Error', 'Failed to fetch recent incidents');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoadingLeaderboard(true);
      const data = await usersAPI.getLeaderboard();
      setLeaderboardData(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      Alert.alert('Error', 'Failed to fetch leaderboard data');
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  if (!isLoggedIn) {
    return null; // Don't render anything if not logged in
  }

  // Dummy data for markers
  const markers = [
    {
      id: 1,
      coordinate: {
        latitude: 24.8607,
        longitude: 67.0011,
      },
      title: 'Illegal Dumping',
      description: 'Large pile of construction waste',
      type: 'trash',
      severity: 'high',
      status: 'new',
      date: '2024-03-27',
      reportedBy: 'Anonymous',
      images: [
        'https://via.placeholder.com/300/b7c9a8/000000?text=Dumping+Photo+1',
        'https://via.placeholder.com/300/8ca982/ffffff?text=Dumping+Photo+2',
      ],
      locationDetails: 'Near Clifton Beach, Karachi',
      updates: [
        { id: 1, text: 'Report received and under review.', date: '2024-03-27', status: 'new' },
        { id: 2, text: 'Cleanup scheduled for next week.', date: '2024-03-30', status: 'in-progress' },
      ],
    },
    {
      id: 2,
      coordinate: {
        latitude: 31.5204,
        longitude: 74.3587,
      },
      title: 'Air Pollution',
      description: 'Strong odor from nearby factory',
      type: 'air',
      severity: 'medium',
      status: 'in-progress',
      date: '2024-03-26',
      reportedBy: 'Ali',
      images: [
        'https://via.placeholder.com/300/8ca982/ffffff?text=Air+Photo+1',
      ],
      locationDetails: 'Industrial Area, Lahore',
      updates: [
        { id: 1, text: 'Investigation started.', date: '2024-03-26', status: 'in-progress' },
      ],
    },
    {
      id: 3,
      coordinate: {
        latitude: 33.6844,
        longitude: 73.0479,
      },
      title: 'Water Contamination',
      description: 'Unusual color in the river',
      type: 'water',
      severity: 'high',
      status: 'new',
      date: '2024-03-25',
      reportedBy: 'Ahmed',
      images: [
        'https://via.placeholder.com/300/b7c9a8/000000?text=Water+Photo+1',
        'https://via.placeholder.com/300/8ca982/ffffff?text=Water+Photo+2',
        'https://via.placeholder.com/300/b7c9a8/000000?text=Water+Photo+3',
      ],
      locationDetails: 'Rawal Lake, Islamabad',
      updates: [
        { id: 1, text: 'Sample collected for testing.', date: '2024-03-25', status: 'new' },
      ],
    },
    {
      id: 4,
      coordinate: {
        latitude: 25.3792,
        longitude: 68.3667,
      },
      title: 'Industrial Waste',
      description: 'Chemical waste being dumped into water body',
      type: 'water',
      severity: 'high',
      status: 'new',
      date: '2024-03-28',
      reportedBy: 'Sara',
      images: [
        'https://via.placeholder.com/300/b7c9a8/000000?text=Waste+Photo+1',
      ],
      locationDetails: 'Hyderabad Industrial Zone',
      updates: [
        { id: 1, text: 'Emergency response team dispatched.', date: '2024-03-28', status: 'new' },
      ],
    },
    {
      id: 5,
      coordinate: {
        latitude: 34.0150,
        longitude: 71.5805,
      },
      title: 'Air Quality Alert',
      description: 'Severe smog conditions in the area',
      type: 'air',
      severity: 'high',
      status: 'in-progress',
      date: '2024-03-27',
      reportedBy: 'Khan',
      images: [
        'https://via.placeholder.com/300/8ca982/ffffff?text=Smog+Photo+1',
        'https://via.placeholder.com/300/b7c9a8/000000?text=Smog+Photo+2',
      ],
      locationDetails: 'Peshawar City Center',
      updates: [
        { id: 1, text: 'Air quality monitoring in progress.', date: '2024-03-27', status: 'in-progress' },
      ],
    },
    {
      id: 6,
      coordinate: {
        latitude: 30.1979,
        longitude: 71.4697,
      },
      title: 'Plastic Pollution',
      description: 'Massive plastic waste accumulation',
      type: 'trash',
      severity: 'medium',
      status: 'new',
      date: '2024-03-29',
      reportedBy: 'Fatima',
      images: [
        'https://via.placeholder.com/300/b7c9a8/000000?text=Plastic+Photo+1',
      ],
      locationDetails: 'Multan City Park',
      updates: [
        { id: 1, text: 'Cleanup drive being organized.', date: '2024-03-29', status: 'new' },
      ],
    },
    {
      id: 7,
      coordinate: {
        latitude: 27.7000,
        longitude: 68.8667,
      },
      title: 'Noise Pollution',
      description: 'Excessive noise from construction site',
      type: 'noise',
      severity: 'medium',
      status: 'in-progress',
      date: '2024-03-28',
      reportedBy: 'Usman',
      images: [
        'https://via.placeholder.com/300/8ca982/ffffff?text=Noise+Photo+1',
      ],
      locationDetails: 'Larkana Residential Area',
      updates: [
        { id: 1, text: 'Authorities notified.', date: '2024-03-28', status: 'in-progress' },
      ],
    }
  ];

  const handleMarkerPress = (marker) => {
    navigation.navigate('IncidentDetails', { incident: marker });
  };

  const handleQuickReport = () => {
    navigation.navigate('ReportIncident');
  };

  const handleViewReports = () => {
    navigation.navigate('Reports');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleMenuPress = () => {
    setIsMenuVisible(true);
    setIsMenuClosing(false);
  };

  const handleMenuClose = () => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setIsMenuVisible(false);
      setIsMenuClosing(false);
    }, 200);
  };

  const handleSignOut = () => {
    handleMenuClose();
    signOut();
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'trash': return 'delete';
      case 'air': return 'air';
      case 'water': return 'water-drop';
      case 'noise': return 'volume-up';
      default: return 'warning';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'trash': return '#4a5c39';  // Login screen green
      case 'air': return '#4a5c39';    // Login screen green
      case 'water': return '#4a5c39';  // Login screen green
      case 'noise': return '#4a5c39';  // Login screen green
      default: return '#4a5c39';       // Login screen green
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <RNSafeAreaViewContext style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.headerContent}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.logoText}>EcoTracker</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            style={[styles.menuButton, isMenuVisible && styles.menuButtonActive]} 
            onPress={handleMenuPress}
          >
            <Icon name="menu" size={28} color="#4a5c39" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleMenuClose}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, isMenuClosing && styles.modalOverlayClosing]} 
          activeOpacity={1} 
          onPress={handleMenuClose}
        >
          <View style={[styles.slideMenu, isMenuClosing && styles.slideMenuClosing]}>
            <View style={styles.slideMenuHeader}>
              <Text style={styles.slideMenuTitle}>Menu</Text>
              <TouchableOpacity onPress={handleMenuClose}>
                <Icon name="close" size={24} color="#4a5c39" />
              </TouchableOpacity>
            </View>
            <View style={styles.slideMenuDivider} />
            {!isLoggedIn ? (
              <TouchableOpacity 
                style={styles.slideMenuItem} 
                onPress={() => {
                  handleMenuClose();
                  handleLogin();
                }}
              >
                <View style={styles.slideMenuItemContent}>
                  <Icon name="login" size={24} color="#4a5c39" />
                  <Text style={styles.slideMenuItemText}>Login</Text>
                </View>
                <Icon name="chevron-right" size={20} color="#4a5c39" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.slideMenuItem} 
                onPress={() => {
                  handleMenuClose();
                  handleProfile();
                }}
              >
                <View style={styles.slideMenuItemContent}>
                  <Icon name="person" size={24} color="#4a5c39" />
                  <Text style={styles.slideMenuItemText}>Profile</Text>
                </View>
                <Icon name="chevron-right" size={20} color="#4a5c39" />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.slideMenuItem} 
              onPress={() => {
                handleMenuClose();
                navigation.navigate('Settings');
              }}
            >
              <View style={styles.slideMenuItemContent}>
                <Icon name="settings" size={24} color="#4a5c39" />
                <Text style={styles.slideMenuItemText}>Settings</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#4a5c39" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.slideMenuItem, { borderBottomWidth: 0 }]} 
              onPress={handleSignOut}
            >
              <View style={styles.slideMenuItemContent}>
                <Icon name="logout" size={24} color="#4a5c39" />
                <Text style={styles.slideMenuItemText}>Sign Out</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#4a5c39" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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
          <TouchableOpacity 
            style={[
              styles.reportButton,
              isReportPressed && styles.buttonPressed
            ]} 
            onPress={handleQuickReport}
            onPressIn={() => setIsReportPressed(true)}
            onPressOut={() => setIsReportPressed(false)}
            activeOpacity={1}
          >
            <View style={styles.reportButtonContent}>
              <View style={styles.reportButtonLeft}>
                <View style={styles.reportIconContainer}>
                  <Icon name="add" size={24} color={isReportPressed ? "#fff" : "#2d3a22"} />
                </View>
                <View style={styles.reportTextContainer}>
                  <Text style={[styles.reportButtonTitle, isReportPressed && styles.buttonTextPressed]}>
                    Report Environmental Incident
                  </Text>
                  <Text style={[styles.reportButtonSubtitle, isReportPressed && styles.buttonTextPressed]}>
                    Help protect our environment
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color={isReportPressed ? "#fff" : "#2d3a22"} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.viewReportsButton,
              isViewReportsPressed && styles.buttonPressed
            ]} 
            onPress={handleViewReports}
            onPressIn={() => setIsViewReportsPressed(true)}
            onPressOut={() => setIsViewReportsPressed(false)}
            activeOpacity={1}
          >
            <View style={styles.reportButtonContent}>
              <View style={styles.reportButtonLeft}>
                <View style={styles.reportIconContainer}>
                  <Icon name="list-alt" size={24} color={isViewReportsPressed ? "#fff" : "#2d3a22"} />
                </View>
                <View style={styles.reportTextContainer}>
                  <Text style={[styles.reportButtonTitle, isViewReportsPressed && styles.buttonTextPressed]}>
                    View My Reports
                  </Text>
                  <Text style={[styles.reportButtonSubtitle, isViewReportsPressed && styles.buttonTextPressed]}>
                    Track your contributions
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color={isViewReportsPressed ? "#fff" : "#2d3a22"} />
            </View>
          </TouchableOpacity>
        </View>
        {/* Recent Incidents */}
        <View style={styles.recentIncidentsContainer}>
          <View style={styles.recentIncidentsHeader}>
            <View style={styles.recentIncidentsTitleContainer}>
              <Icon name="schedule" size={24} color="#4a5c39" />
              <Text style={styles.recentIncidentsTitle}>Recent Incidents</Text>
            </View>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={fetchRecentIncidents}
            >
              <Icon name="refresh" size={24} color="#4a5c39" />
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color="#4a5c39" />
            </View>
          ) : (
            <View style={styles.recentIncidentsList}>
              {recentIncidents.slice(0, 3).map((item) => (
                <View key={item._id} style={styles.incidentCard}>
                  <View style={styles.incidentCardHeader}>
                    <View style={styles.incidentTypeContainer}>
                      <Icon 
                        name={getTypeIcon(item.type)} 
                        size={24} 
                        color={getTypeColor(item.type)} 
                      />
                      <Text style={[styles.incidentType, { color: getTypeColor(item.type) }]}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.incidentTime}>
                      {formatTime(item.createdAt)}
                    </Text>
                  </View>
                  <View style={[styles.incidentCardDivider, { backgroundColor: getTypeColor(item.type) + '20' }]} />
                </View>
              ))}
            </View>
          )}
        </View>
        {/* Leaderboard */}
        <View style={styles.leaderboardSection}>
          <View style={styles.sectionTitleContainer}>
            <Icon name="emoji-events" size={24} color="#4a5c39" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Leaderboard</Text>
          </View>
          {loadingLeaderboard ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color="#4a5c39" />
            </View>
          ) : (
            <ScrollView 
              style={styles.leaderboardScrollView}
              contentContainerStyle={styles.leaderboardContent}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {leaderboardData.map((user, idx) => (
                <View
                  key={user._id}
                  style={[
                    styles.leaderboardItem,
                    idx === 0 && styles.goldRank,
                    idx === 1 && styles.silverRank,
                    idx === 2 && styles.bronzeRank,
                  ]}
                >
                  <Text style={styles.leaderboardRankText}>{idx + 1}</Text>
                  <Text style={styles.leaderboardName}>{user.name}</Text>
                  <Text style={styles.leaderboardPoints}>{user.reportCount} reports</Text>
                </View>
              ))}
            </ScrollView>
          )}
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e4da',
  },
  logoContainer: {
    backgroundColor: '#4a5c39',
    borderRadius: 16,
    padding: 4,
    marginRight: 8,
  },
  logo: {
    width: 32,
    height: 32,
    opacity: 1,
    tintColor: '#fff',
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#4a5c39',
    letterSpacing: 1,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
  menuButtonActive: {
    backgroundColor: '#f0ede3',
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
    borderRadius: 16,
    overflow: 'hidden',
    height: 250,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  mapLabel: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
    color: '#6b6b6b',
    fontSize: 18,
    fontWeight: 'bold',
    opacity: 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dashboardButtonsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  reportButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  buttonPressed: {
    backgroundColor: '#4a5c39',
  },
  reportButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  reportButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f6f8f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportTextContainer: {
    flex: 1,
  },
  reportButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3a22',
    marginBottom: 4,
  },
  reportButtonSubtitle: {
    fontSize: 13,
    color: '#6b7a5e',
    opacity: 0.8,
  },
  buttonTextPressed: {
    color: '#fff',
  },
  viewReportsButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  recentIncidentsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
  
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentIncidentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentIncidentsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recentIncidentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a5c39',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f6f8f3',
  },
  recentIncidentsList: {
    gap: 12,
  },
  incidentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8F4F8',
  },
  incidentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incidentTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  incidentType: {
    fontSize: 16,
    fontWeight: '600',
  },
  incidentTime: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  incidentCardDivider: {
    height: 1,
    marginTop: 12,
  },
  loaderContainer: {
    padding: 20,
    alignItems: 'center',
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
    height: 300, // Fixed height for the container
  },
  leaderboardScrollView: {
    flex: 1,
  },
  leaderboardContent: {
    paddingBottom: 8,
  },
  leaderboardList: {
    maxHeight: 215,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
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
    backgroundColor: '#e6d9b8',
  },
  silverRank: {
    backgroundColor: '#e0e0e0',
  },
  bronzeRank: {
    backgroundColor: '#e6d0c0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: 1,
  },
  modalOverlayClosing: {
    opacity: 0,
  },
  slideMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#f0ede3',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    opacity: 1,
  },
  slideMenuClosing: {
    opacity: 0,
  },
  slideMenuVisible: {
    transform: [{ translateX: 0 }],
  },
  slideMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: Platform.OS === 'ios' ? 50 : 40,
  },
  slideMenuTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4a5c39',
  },
  slideMenuDivider: {
    height: 1,
    backgroundColor: '#e0e4da',
    marginHorizontal: 20,
  },
  slideMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e4da',
  },
  slideMenuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slideMenuItemText: {
    fontSize: 16,
    color: '#4a5c39',
    marginLeft: 16,
    fontWeight: '500',
  },
});

export default HomeScreen; 