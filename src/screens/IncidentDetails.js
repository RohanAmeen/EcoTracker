import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';

const { width } = Dimensions.get('window');

const IncidentDetails = ({ route, navigation }) => {
  const { incident } = route.params;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#ff4444';
      case 'medium':
        return '#ffbb33';
      case 'low':
        return '#00C851';
      default:
        return '#4a5c39';
    }
  };

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return '#4a5c39';
      case 'pending':
        return '#ff9800';
      case 'approved':
        return '#4caf50';
      case 'completed':
        return '#2196f3';
      case 'rejected':
        return '#ff4444';
      default:
        return '#4a5c39';
    }
  };

  const renderHeader = () => (
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
    </View>
  );

  const renderIncidentInfo = () => (
    <View style={styles.incidentInfoContainer}>
      <View style={styles.typeContainer}>
        <View style={styles.typeIconContainer}>
          <Icon 
            name={getTypeIcon(incident.type)} 
            size={32} 
            color="#4a5c39" 
          />
        </View>
        <View style={styles.typeTextContainer}>
          <Text style={styles.typeLabel}>Type</Text>
          <Text style={styles.typeValue}>
            {incident.type ? incident.type.charAt(0).toUpperCase() + incident.type.slice(1) : 'Unknown'}
          </Text>
        </View>
      </View>

      <View style={styles.infoDivider} />

      <View style={styles.dateContainer}>
        <View style={styles.dateIconContainer}>
          <Icon name="event" size={32} color="#4a5c39" />
        </View>
        <View style={styles.dateTextContainer}>
          <Text style={styles.dateLabel}>Reported On</Text>
          <Text style={styles.dateValue}>
            {new Date(incident.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.timeValue}>
            {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>

      <View style={styles.infoDivider} />

      <View style={styles.statusContainer}>
        <View style={styles.statusIconContainer}>
          <Icon name="info" size={32} color="#4a5c39" />
        </View>
        <View style={styles.statusTextContainer}>
          <Text style={styles.statusLabel}>Status</Text>
        </View>
        <View style={styles.statusBadgeContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(incident.status) }]}>
            <Text style={styles.statusValue}>
              {incident.status ? incident.status.toUpperCase() : 'NEW'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.infoDivider} />

      <View style={styles.locationContainer}>
        <View style={styles.locationIconContainer}>
          <Icon name="location-on" size={32} color="#4a5c39" />
        </View>
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationLabel}>Location</Text>
          <Text style={styles.locationValue}>
            {incident.locationDetails || 'Location coordinates available'}
          </Text>
          {incident.location && incident.location.coordinates && (
            <View style={styles.coordinatesContainer}>
              <Text style={styles.coordinateText}>
                Lat: {incident.location.coordinates[1].toFixed(6)}
              </Text>
              <Text style={styles.coordinateText}>
                Long: {incident.location.coordinates[0].toFixed(6)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderIncidentInfo()}
      </ScrollView>
      <BottomNav navigation={navigation} currentScreen="IncidentDetails" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0ede3',
  },
  scrollView: {
    flex: 1,
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
  incidentInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f6f8f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  typeTextContainer: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 14,
    color: '#6b7a5e',
    marginBottom: 4,
  },
  typeValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3a22',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#e8ebe3',
    marginVertical: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dateIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f6f8f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#6b7a5e',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3a22',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 14,
    color: '#6b7a5e',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f6f8f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    color: '#6b7a5e',
    marginBottom: 4,
  },
  statusBadgeContainer: {
    marginLeft: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusValue: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f6f8f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    color: '#6b7a5e',
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 16,
    color: '#2d3a22',
    marginBottom: 8,
  },
  coordinatesContainer: {
    backgroundColor: '#f6f8f3',
    padding: 12,
    borderRadius: 8,
  },
  coordinateText: {
    fontSize: 14,
    color: '#4a5c39',
    marginBottom: 4,
  },
});

export default IncidentDetails; 