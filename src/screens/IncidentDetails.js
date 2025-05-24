import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomNav from '../components/BottomNav';

const IncidentDetails = ({ route, navigation }) => {
  const { incident } = route.params;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#FF4444';
      case 'medium':
        return '#FFBB33';
      case 'low':
        return '#00C851';
      default:
        return '#4CAF50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return '#FF4444';
      case 'in-progress':
        return '#FFBB33';
      case 'fixed':
        return '#00C851';
      default:
        return '#4CAF50';
    }
  };

  const renderHeader = () => (
    <>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: incident.images && incident.images.length > 0 ? incident.images[0] : 'https://via.placeholder.com/400x200' }}
          style={styles.image}
        />
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Photos Section */}
      <View style={styles.photosContainer}>
        <Text style={styles.sectionTitle}>Photos</Text>
        {incident.images && incident.images.length > 0 ? (
          <FlatList
            horizontal
            data={incident.images}
            keyExtractor={(item, index) => `photo-${index}`}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.galleryImage} />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageGallery}
          />
        ) : (
          <Text style={styles.noDataText}>No additional photos available.</Text>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{incident.title}</Text>

        {/* Date and Reported By */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date:</Text>
          <Text style={styles.infoText}>{incident.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Reported By:</Text>
          <Text style={styles.infoText}>{incident.reportedBy}</Text>
        </View>

        {/* Status, Severity, and Type */}
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: getStatusColor(incident.status) }]}>
            <Text style={styles.badgeText}>
              {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: getSeverityColor(incident.severity) }]}>
            <Text style={styles.badgeText}>
              {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)} Severity
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#03A9F4' }]}>
            <Text style={styles.badgeText}>
              {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{incident.description}</Text>
        </View>

        {/* Location Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          {incident.locationDetails ? (
            <Text style={styles.description}>{incident.locationDetails}</Text>
          ) : (
            <Text style={styles.noDataText}>No specific location details provided.</Text>
          )}
        </View>

        {/* Location Coordinates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coordinates</Text>
          <Text style={styles.locationText}>
            Latitude: {incident.coordinate.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Longitude: {incident.coordinate.longitude.toFixed(6)}
          </Text>
        </View>
      </View>
    </>
  );

  const renderUpdate = ({ item }) => (
    <View style={styles.updateItem}>
      <Text style={styles.updateDate}>{item.date}: </Text>
      <Text style={styles.updateText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={incident.updates || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUpdate}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="share" size={24} color="#4a5c39" />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="flag" size={24} color="#4a5c39" />
              <Text style={styles.actionButtonText}>Report</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      <BottomNav navigation={navigation} currentScreen="IncidentDetails" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0ede3',
  },
  listContent: {
    paddingBottom: 100, // Add padding for bottom nav
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: Dimensions.get('window').width,
    height: 250, // Slightly larger image
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 20,
    zIndex: 1, // Ensure button is clickable
  },
  photosContainer: {
    backgroundColor: '#fff', // Match card background
    marginHorizontal: 16, // Match card horizontal margin
    marginTop: -140, // Use a larger negative margin to pull it up further. ADJUST AS NEEDED.
    marginBottom: 20, // Space below photos section
    borderRadius: 12, // Match card border radius
    paddingTop: 15, // Padding inside the card
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3a22', // Dark green
    marginBottom: 10,
    paddingHorizontal: 15, // Add horizontal padding to title within photos container
  },
  imageGallery: {
    paddingHorizontal: 15, // Add horizontal padding to the FlatList content
  },
  galleryImage: {
    width: 160,
    height: 160,
    borderRadius: 10,
    marginRight: 12,
    resizeMode: 'cover',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 15, // Add horizontal padding
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 0, // Remove top margin here as photos are above
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  locationText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  updateItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  updateDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  updateText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#4a5c39', // Dark green
    marginTop: 5,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default IncidentDetails; 