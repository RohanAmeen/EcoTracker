import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
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
    switch (type) {
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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Environmental Incident Report: ${incident.title}\nLocation: ${incident.locationDetails}\nSeverity: ${incident.severity}\nStatus: ${incident.status}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={['#2A7B9B', '#57C785']}
        style={styles.gradientHeader}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Incident Details</Text>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Icon name="share" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.incidentHeader}>
        <View style={styles.titleContainer}>
          <Icon 
            name={getTypeIcon(incident.type)} 
            size={28} 
            color={getSeverityColor(incident.severity)} 
            style={styles.typeIcon}
          />
          <Text style={styles.title}>{incident.title}</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(incident.severity) }]}>
            <Text style={styles.severityText}>{incident.severity.toUpperCase()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: incident.status === 'new' ? '#4a5c39' : '#2A7B9B' }]}>
            <Text style={styles.statusText}>{incident.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderImageGallery = () => (
    <View style={styles.imageGallery}>
      <Text style={styles.sectionTitle}>Photos</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageGalleryContent}
      >
        {incident.images.map((image, index) => (
          <Image 
            key={index}
            source={{ uri: image }}
            style={styles.incidentImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderDetails = () => (
    <View style={styles.detailsContainer}>
      <View style={styles.detailSection}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{incident.description}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={20} color="#4a5c39" />
          <Text style={styles.locationText}>{incident.locationDetails}</Text>
        </View>
        <View style={styles.coordinatesContainer}>
          <Text style={styles.coordinateText}>
            Latitude: {incident.coordinate.latitude.toFixed(6)}
          </Text>
          <Text style={styles.coordinateText}>
            Longitude: {incident.coordinate.longitude.toFixed(6)}
          </Text>
        </View>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.sectionTitle}>Report Details</Text>
        <View style={styles.reportInfo}>
          <View style={styles.infoRow}>
            <Icon name="person" size={20} color="#4a5c39" />
            <Text style={styles.infoText}>Reported by: {incident.reportedBy}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="event" size={20} color="#4a5c39" />
            <Text style={styles.infoText}>Date: {incident.date}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderUpdates = () => (
    <View style={styles.updatesContainer}>
      <Text style={styles.sectionTitle}>Updates</Text>
      {incident.updates.map((update, index) => (
        <View key={update.id} style={styles.updateItem}>
          <View style={styles.updateHeader}>
            <Icon 
              name={update.status === 'new' ? 'fiber-new' : 'update'} 
              size={20} 
              color={update.status === 'new' ? '#4a5c39' : '#2A7B9B'} 
            />
            <Text style={styles.updateDate}>{update.date}</Text>
          </View>
          <Text style={styles.updateText}>{update.text}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderImageGallery()}
        {renderDetails()}
        {renderUpdates()}
      </ScrollView>
      <BottomNav navigation={navigation} currentScreen="IncidentDetails" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2ed',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  gradientHeader: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  shareButton: {
    padding: 8,
  },
  incidentHeader: {
    padding: 16,
    backgroundColor: '#fff',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIcon: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3a22',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  severityText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  imageGallery: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3a22',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  imageGalleryContent: {
    paddingHorizontal: 16,
  },
  incidentImage: {
    width: width * 0.7,
    height: 200,
    borderRadius: 12,
    marginRight: 12,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginBottom: 12,
  },
  detailSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#4a5c39',
    lineHeight: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#4a5c39',
    marginLeft: 8,
    flex: 1,
  },
  coordinatesContainer: {
    backgroundColor: '#e8ebe3',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  coordinateText: {
    fontSize: 14,
    color: '#4a5c39',
    marginBottom: 4,
  },
  reportInfo: {
    backgroundColor: '#e8ebe3',
    padding: 12,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#4a5c39',
    marginLeft: 8,
  },
  updatesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginBottom: 80,
  },
  updateItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  updateDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  updateText: {
    fontSize: 16,
    color: '#4a5c39',
    lineHeight: 22,
  },
});

export default IncidentDetails; 