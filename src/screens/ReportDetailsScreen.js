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
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { incidentsAPI } from '../services/api';

const { width, height } = Dimensions.get('window');

const ReportDetailsScreen = ({ route, navigation }) => {
  const { report } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress':
        return '#FFA000';
      case 'rejected':
        return '#D32F2F';
      case 'resolved':
        return '#2E7D32';
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

  const handleImagePress = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
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
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / (width * 0.85));
          setCurrentImageIndex(newIndex);
        }}
      >
        {report.images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImagePress(image, index)}
          >
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
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
          <Icon name="arrow-back-ios" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Report Details</Text>
          <Text style={styles.incidentId}>#{report._id?.slice(-6) || '000000'}</Text>
        </View>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Images</Text>
            {report.images && report.images.length > 0 && (
              <View style={styles.imageCountBadge}>
                <Text style={styles.imageCountText}>
                  {currentImageIndex + 1}/{report.images.length}
                </Text>
              </View>
            )}
          </View>
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

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#D32F2F' }]}
            onPress={() => handleStatusChange('rejected')}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FFA000' }]}
            onPress={() => handleStatusChange('in-progress')}
            disabled={loading}
          >
            <Text style={styles.buttonText}>In Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#2E7D32' }]}
            onPress={() => handleStatusChange('resolved')}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Resolved</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {currentImageIndex + 1} / {report.images.length}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedImage(null)}
            >
              <Icon name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={report.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={currentImageIndex}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(newIndex);
            }}
            renderItem={({ item }) => (
              <View style={styles.fullImageContainer}>
                <Image
                  source={{ uri: item }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#2c3e50',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  incidentId: {
    color: '#2c3e50',
    fontSize: 24,
    fontWeight: '700',
    opacity: 0.7,
    marginTop: 4,
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
    width: width * 0.85,
    height: 250,
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
    marginBottom: 120,
    marginHorizontal: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    transform: [{ scale: 1 }],
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  closeButton: {
    padding: 10,
  },
  imageCounter: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fullImageContainer: {
    width: width,
    height: height * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: height * 0.9,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  imageCountBadge: {
    paddingHorizontal: 8,
  },
  imageCountText: {
    color: '#4a5c39',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ReportDetailsScreen; 