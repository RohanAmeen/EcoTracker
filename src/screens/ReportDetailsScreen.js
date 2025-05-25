import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { incidentsAPI } from '../services/api';

const { width } = Dimensions.get('window');

const ReportDetailsScreen = ({ route, navigation }) => {
  const { report } = route.params;
  const [loading, setLoading] = React.useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return '#ff4444';
      case 'in-progress':
        return '#ffbb33';
      case 'resolved':
        return '#00C851';
      default:
        return '#4a5c39';
    }
  };

  const getTypeIcon = (type) => {
    if (!type) return 'warning';
    
    switch (type.toLowerCase()) {
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

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low':
        return '#00C851';
      case 'medium':
        return '#ffbb33';
      case 'high':
        return '#ff4444';
      default:
        return '#4a5c39';
    }
  };

  const renderImages = () => {
    if (!report.images || report.images.length === 0) {
      return (
        <View style={styles.noImagesContainer}>
          <Icon name="image" size={32} color="#b7c9a8" />
          <Text style={styles.noImagesText}>No images provided</Text>
        </View>
      );
    }

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.imagesContainer}
      >
        {report.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    );
  };

  const handleStatusChange = async (status) => {
    try {
      setLoading(true);
      await incidentsAPI.updateIncidentStatus(report._id, status);
      navigation.goBack();
    } catch (error) {
      alert('Failed to update status: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await incidentsAPI.deleteIncident(report._id);
      navigation.goBack();
    } catch (error) {
      alert('Failed to delete incident: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Report Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.typeContainer}>
            <Icon 
              name={getTypeIcon(report.type)} 
              size={24} 
              color="#4a5c39" 
              style={styles.typeIcon}
            />
            <Text style={styles.typeTitle}>
              {report.type ? report.type.charAt(0).toUpperCase() + report.type.slice(1) : 'Unknown'}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
              <Text style={styles.statusText}>
                {report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : 'Unknown'}
              </Text>
            </View>
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(report.severity) }]}>
              <Text style={styles.severityText}>
                {report.severity ? report.severity.charAt(0).toUpperCase() + report.severity.slice(1) : 'Unknown'} Severity
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {report.description || 'No description provided'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          {renderImages()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationContainer}>
            <Icon name="location-on" size={20} color="#666" />
            <Text style={styles.location}>
              {report.location ? 
                `Latitude: ${report.location.latitude}\nLongitude: ${report.location.longitude}` : 
                'No location provided'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reporter Information</Text>
          <View style={styles.reporterInfo}>
            <Icon name="person" size={20} color="#666" />
            <Text style={styles.reporterText}>
              Username: {report.reportedBy?.username || 'Unknown'}
            </Text>
          </View>
          <View style={styles.reporterInfo}>
            <Icon name="email" size={20} color="#666" />
            <Text style={styles.reporterText}>
              Email: {report.reportedBy?.email || 'No email provided'}
            </Text>
          </View>
          <View style={styles.reporterInfo}>
            <Icon name="badge" size={20} color="#666" />
            <Text style={styles.reporterText}>
              User ID: {report.reportedBy?._id || 'Unknown'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timestamps</Text>
          <View style={styles.timestamp}>
            <Icon name="schedule" size={20} color="#666" />
            <Text style={styles.timestampText}>
              Created: {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'Unknown'}
            </Text>
          </View>
          <View style={styles.timestamp}>
            <Icon name="update" size={20} color="#666" />
            <Text style={styles.timestampText}>
              Last Updated: {report.updatedAt ? new Date(report.updatedAt).toLocaleString() : 'Unknown'}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ffbb33' }]}
          onPress={() => handleStatusChange('in-progress')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>In Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ff4444' }]}
          onPress={() => handleStatusChange('rejected')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#00C851' }]}
          onPress={() => handleStatusChange('resolved')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Resolved</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIcon: {
    marginRight: 8,
  },
  typeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a5c39',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  severityText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  imagesContainer: {
    marginTop: 8,
  },
  image: {
    width: width * 0.7,
    height: 200,
    borderRadius: 8,
    marginRight: 12,
  },
  noImagesContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noImagesText: {
    color: '#666',
    marginTop: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  location: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  reporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reporterText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  timestamp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestampText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ReportDetailsScreen; 