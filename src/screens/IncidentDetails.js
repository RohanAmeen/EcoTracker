import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/400x200' }} // Replace with actual image
          style={styles.image}
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{incident.title}</Text>
        
        {/* Status and Severity */}
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
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{incident.description}</Text>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.locationText}>
            Latitude: {incident.coordinate.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Longitude: {incident.coordinate.longitude.toFixed(6)}
          </Text>
        </View>

        {/* Additional Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
            {[1, 2, 3].map((item) => (
              <Image
                key={item}
                source={{ uri: 'https://via.placeholder.com/150' }}
                style={styles.galleryImage}
              />
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share" size={24} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="flag" size={24} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: Dimensions.get('window').width,
    height: 200,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  imageGallery: {
    flexDirection: 'row',
    marginTop: 10,
  },
  galleryImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
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
    color: '#4CAF50',
    marginTop: 5,
    fontSize: 14,
  },
});

export default IncidentDetails; 