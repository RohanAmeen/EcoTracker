import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { incidentsAPI } from '../services/api';
import { useAuth } from '../AuthContext';
import { SafeAreaView as RNSafeAreaViewContext } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';

const ReportsScreen = ({ navigation }) => {
  const { isLoggedIn, signOut } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await incidentsAPI.getMyIncidents();
      console.log('Fetched reports:', data);
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to fetch reports. Please try again.',
        [
          { 
            text: 'Retry', 
            onPress: () => fetchReports() 
          },
          { 
            text: 'OK',
            style: 'cancel'
          }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="description" size={64} color="#b7c9a8" />
      <Text style={styles.emptyTitle}>No Reports Yet</Text>
      <Text style={styles.emptyText}>
        You haven't submitted any environmental reports yet. Start by reporting an incident in your area!
      </Text>
      <TouchableOpacity 
        style={styles.reportButton}
        onPress={() => navigation.navigate('ReportIncident')}
      >
        <Text style={styles.reportButtonText}>Report an Incident</Text>
      </TouchableOpacity>
    </View>
  );

  const renderReportItem = ({ item }) => (
    <View style={styles.reportItem}>
      <View style={styles.reportHeader}>
        <View style={styles.titleContainer}>
          <View style={styles.typeContainer}>
            <Icon 
              name={
                item.type === 'trash' ? 'delete' :
                item.type === 'air' ? 'air' :
                item.type === 'water' ? 'water-drop' :
                item.type === 'noise' ? 'volume-up' :
                'warning'
              } 
              size={20} 
              color="#4a5c39" 
              style={styles.typeIcon}
            />
            <Text style={styles.typeTitle}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.reportDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      
      <Text style={styles.reportDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="location-on" size={16} color="#6b7a5e" style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.locationDetails || 'Location not specified'}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="schedule" size={16} color="#6b7a5e" style={styles.detailIcon} />
            <Text style={styles.detailText}>
              Reported {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.statusContainer}>
        <View style={styles.statusIndicator}>
          <Icon 
            name={getStatusIcon(item.status)} 
            size={16} 
            color={getStatusColor(item.status)} 
            style={styles.statusIcon}
          />
          <Text style={[styles.statusLabel, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
        <View style={styles.badgeContainer}>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
            <Icon 
              name={
                item.severity === 'low' ? 'arrow-downward' :
                item.severity === 'medium' ? 'remove' :
                'arrow-upward'
              } 
              size={14} 
              color="#fff" 
              style={styles.badgeIcon}
            />
            <Text style={styles.severityText}>{item.severity}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'new':
        return '#b7c9a8';
      case 'pending':
        return '#ff9800';
      case 'approved':
        return '#4caf50';
      case 'completed':
        return '#2196f3';
      case 'rejected':
        return '#ff4444';
      default:
        return '#b7c9a8';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'fiber-new';
      case 'pending':
        return 'pending';
      case 'approved':
        return 'check-circle';
      case 'completed':
        return 'done-all';
      default:
        return 'info';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return '#4caf50';
      case 'medium':
        return '#ff9800';
      case 'high':
        return '#f44336';
      default:
        return '#4caf50';
    }
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

  if (loading && !refreshing) {
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6b7a5e" />
        </View>
      </RNSafeAreaViewContext>
    );
  }

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
                  navigation.navigate('Login');
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
                  navigation.navigate('Profile');
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

      <FlatList
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      <BottomNav navigation={navigation} currentScreen="Reports" />
    </RNSafeAreaViewContext>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8f3',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4b5e3c',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7a5e',
    textAlign: 'center',
    marginBottom: 24,
  },
  reportButton: {
    backgroundColor: '#6b7a5e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reportItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e4da',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4a5c39',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeIcon: {
    marginRight: 6,
  },
  reportDate: {
    fontSize: 13,
    color: '#6b7a5e',
    backgroundColor: '#f6f8f3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reportDescription: {
    fontSize: 15,
    color: '#4b5e3c',
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 20,
  },
  detailsContainer: {
    marginTop: 12,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e4da',
  },
  detailRow: {
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7a5e',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e4da',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f8f3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeIcon: {
    marginRight: 4,
  },
  severityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f0ede3',
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

export default ReportsScreen; 