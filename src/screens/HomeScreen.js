import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Image,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { useAuth } from '../AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView as RNSafeAreaViewContext } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { incidentsAPI, usersAPI } from '../services/api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { requestNotificationPermissions, sendLocalNotification } from '../services/notifications';

/**
 * HomeScreenContent Component
 * Main content component for the home screen
 * Handles all the UI and functionality for the home screen
 */
const HomeScreenContent = ({ navigation }) => {
  // Authentication context
  const { isLoggedIn, signOut, setNavigation } = useAuth();

  // State for map region (default centered on Pakistan)
  const [region, setRegion] = useState({
    latitude: 30.3753,  // Center of Pakistan
    longitude: 69.3451, // Center of Pakistan
    latitudeDelta: 8,   // Closer zoom level to show Pakistan
    longitudeDelta: 8,  // Closer zoom level to show Pakistan
  });

  // UI state management
  const [isReportPressed, setIsReportPressed] = useState(false);
  const [isViewReportsPressed, setIsViewReportsPressed] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  // Data state management
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  // Refs for map and scroll view
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);

  /**
   * Effect to fetch data when screen is focused
   * Only runs if user is logged in
   */
  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        return;
      }
      fetchRecentIncidents();
      fetchLeaderboard();
    }, [isLoggedIn])
  );

  /**
   * Effect to request location permissions and get current location
   * Runs once when component mounts
   */
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

  /**
   * Effect to request notification permissions
   * Runs once when component mounts
   */
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  /**
   * Fetches recent environmental incidents from the API
   * Updates the recentIncidents state with the fetched data
   */
  const fetchRecentIncidents = async () => {
    try {
      setLoading(true);
      const response = await incidentsAPI.getRecentIncidents();
      if (response.error) {
        console.error('Error fetching incidents:', response.error);
        return;
      }

      // Filter out invalid incidents
      const validIncidents = response.filter(incident => {
        return incident.location && 
               incident.location.coordinates && 
               Array.isArray(incident.location.coordinates) && 
               incident.location.coordinates.length === 2;
      });

      setRecentIncidents(validIncidents);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches leaderboard data from the API
   * Updates the leaderboardData state with the fetched data
   */
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

  // Don't render anything if user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  /**
   * Helper function to get the appropriate icon for each incident type
   * @param {string} type - The type of incident
   * @returns {string} - The name of the icon to use
   */
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'trash':
        return 'delete';
      case 'air':
        return 'air';
      case 'water':
        return 'water-drop';
      case 'noise':
        return 'volume-up';
      default:
        return 'warning';
    }
  };

  /**
   * Helper function to get the color for incident types
   * Currently returns a consistent color for all types
   */
  const getTypeColor = (type) => {
    return '#4a5c39';  // Always return logo color
  };

  /**
   * Handlers for various user interactions
   */
  const handleMarkerPress = (incident) => {
    navigation.navigate('IncidentDetails', { incident });
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

  /**
   * Formats timestamp into a readable date string
   * @param {string} timestamp - The timestamp to format
   * @returns {string} - Formatted date string
   */
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

  /**
   * Renders the marker for an incident on the map
   * @param {Object} incident - The incident to render
   * @returns {JSX.Element} - The marker component
   */
  const renderIncidentMarker = (incident) => {
    const iconName = getTypeIcon(incident.type);
    return (
      <View style={styles.markerContainer}>
        <Icon name={iconName} size={24} color="#fff" />
      </View>
    );
  };

  /**
   * Handles map press to toggle zoom level
   * Scrolls to map section and animates zoom
   */
  const handleMapPress = () => {
    // Scroll to map section
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
    
    // Toggle between zoomed in and zoomed out states
    if (mapRef.current) {
      const newZoomLevel = !isZoomedIn;
      setIsZoomedIn(newZoomLevel);
      
      if (Platform.OS === 'android') {
        // Use animateCamera for Android
        mapRef.current.animateCamera({
          center: {
            latitude: region.latitude,
            longitude: region.longitude,
          },
          zoom: newZoomLevel ? 15 : 10,
          altitude: 1000,
          heading: 0,
          pitch: 0,
        }, { duration: 1000 });
      } else {
        // Use animateToRegion for iOS
        mapRef.current.animateToRegion({
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: newZoomLevel ? 0.005 : 0.0922,
          longitudeDelta: newZoomLevel ? 0.005 : 0.0421,
        }, 1000);
      }
    }
  };

  /**
   * Handles notification button press
   * Sends a local notification to the user
   */
  const handleNotificationPress = async () => {
    try {
      await sendLocalNotification(
        'EcoTracker Alert',
        'Thank you for helping keep our environment clean!'
      );
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', 'Failed to send notification');
    }
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
            style={styles.notificationButton}
            onPress={handleNotificationPress}
          >
            <Icon name="notifications" size={24} color="#4a5c39" />
          </TouchableOpacity>
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

      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={region}
            showsUserLocation
            showsMyLocationButton
            onRegionChangeComplete={(newRegion) => {
              // Only update region if not animating
              if (!isZoomedIn) {
                setRegion(newRegion);
              }
            }}
          >
            {recentIncidents.map((incident) => (
              <Marker
                key={incident._id}
                coordinate={{
                  latitude: incident.location.coordinates[1],
                  longitude: incident.location.coordinates[0],
                }}
                onPress={() => handleMarkerPress(incident)}
              >
                {renderIncidentMarker(incident)}
                <Callout>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{incident.type}</Text>
                    <Text style={styles.calloutText}>
                      {formatTime(incident.createdAt)}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4a5c39" />
            </View>
          )}
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
                        color="#4a5c39"
                      />
                      <Text style={[styles.incidentType, { color: '#4a5c39' }]}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.incidentTime}>
                      {formatTime(item.createdAt)}
                    </Text>
                  </View>
                  <View style={[styles.incidentCardDivider, { backgroundColor: '#4a5c39' + '20' }]} />
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
      <BottomNav 
        navigation={navigation} 
        currentScreen="Home"
        onMapPress={handleMapPress}
      />
    </RNSafeAreaViewContext>
  );
};

const HomeScreen = (props) => {
  if (!props.navigation) {
    return null;
  }
  return <HomeScreenContent {...props} />;
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
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
  notificationButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
  menuButtonActive: {
    backgroundColor: '#f0ede3',
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
    paddingBottom: 32,
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
  markerContainer: {
    backgroundColor: '#4a5c39',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  markerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ translateY: -1 }],
  },
  calloutContainer: {
    padding: 8,
    minWidth: 120,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3a22',
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 14,
    color: '#4a5c39',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen; 