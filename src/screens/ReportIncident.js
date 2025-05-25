import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView as RNSafeAreaViewContext } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';

const { width } = Dimensions.get('window');

const ReportIncident = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [severity, setSeverity] = useState('');
  const [images, setImages] = useState([]);
  const [locationDetails, setLocationDetails] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [isOtherType, setIsOtherType] = useState(false);
  const [otherTypeValue, setOtherTypeValue] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setImages(prevImages => [...prevImages, ...result.assets.map(asset => asset.uri)]);
    }
  };

  const removeImage = (uriToRemove) => {
    setImages(images.filter(uri => uri !== uriToRemove));
  };

  const handleTypeSelect = (option) => {
    setType(option);
    if (option === 'other') {
      setIsOtherType(true);
      setOtherTypeValue('');
    } else {
      setIsOtherType(false);
      setOtherTypeValue('');
    }
  };

  const handleSubmit = () => {
    if (
      !title ||
      !description ||
      !severity ||
      (!type && !isOtherType) ||
      (isOtherType && !otherTypeValue.trim())
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];

    const incidentTypeToSubmit = isOtherType ? otherTypeValue.trim() : type;

    console.log('Submitting incident:', {
      title,
      description,
      type: incidentTypeToSubmit,
      severity,
      images,
      locationDetails,
      reportedBy: reportedBy || 'Anonymous',
      date: currentDate,
      status: 'new',
    });

    Alert.alert(
      'Success',
      'Incident reported successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <RNSafeAreaViewContext style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <LinearGradient
        colors={["#2A7B9B", "#57C785", "#2A7B9B"]}
        style={styles.gradientHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Incident</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.typeSection}>
            <Text style={styles.sectionTitle}>What type of incident?</Text>
            <View style={styles.typeContainer}>
              {['trash', 'air', 'water', 'noise', 'other'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.typeButton,
                    type === option && styles.typeButtonSelected,
                  ]}
                  onPress={() => handleTypeSelect(option)}
                >
                  <Icon 
                    name={
                      option === 'trash' ? 'delete' :
                      option === 'air' ? 'air' :
                      option === 'water' ? 'water-drop' :
                      option === 'noise' ? 'volume-up' :
                      'more-horiz'
                    } 
                    size={20} 
                    color={type === option ? '#fff' : '#4a5c39'} 
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === option && styles.typeButtonTextSelected,
                    ]}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {isOtherType && (
            <View style={styles.otherInputContainer}>
              <TextInput
                style={[styles.input, styles.otherInput]}
                value={otherTypeValue}
                onChangeText={setOtherTypeValue}
                placeholder="Specify incident type"
                placeholderTextColor="#888"
              />
            </View>
          )}

          <View style={styles.severitySection}>
            <Text style={styles.sectionTitle}>How severe is it?</Text>
            <View style={styles.severityContainer}>
              {['low', 'medium', 'high'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.severityButton,
                    severity === option && styles.severityButtonSelected,
                    severity === option && { backgroundColor: getSeverityColor(option) }
                  ]}
                  onPress={() => setSeverity(option)}
                >
                  <View style={styles.severityButtonContent}>
                    <Icon 
                      name={
                        option === 'low' ? 'arrow-downward' :
                        option === 'medium' ? 'remove' :
                        'arrow-upward'
                      } 
                      size={24} 
                      color={severity === option ? '#fff' : '#4a5c39'} 
                    />
                    <Text
                      style={[
                        styles.severityButtonText,
                        severity === option && styles.severityButtonTextSelected,
                      ]}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Incident Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Brief description of the issue"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Detailed description of the issue"
                placeholderTextColor="#888"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location Details</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={locationDetails}
                onChangeText={setLocationDetails}
                placeholder="e.g., 'Near Oak Street and Pine Avenue'"
                placeholderTextColor="#888"
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reported By</Text>
              <TextInput
                style={styles.input}
                value={reportedBy}
                onChangeText={setReportedBy}
                placeholder="Your Name (Optional)"
                placeholderTextColor="#888"
              />
            </View>
          </View>

          <View style={styles.photosSection}>
            <Text style={styles.sectionTitle}>Add Photos</Text>
            <View style={styles.imagePreviewContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((uri, index) => (
                  <View key={index} style={styles.imagePreviewWrapper}>
                    <Image source={{ uri }} style={styles.imagePreview} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(uri)}>
                      <Icon name="close" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                  <Icon name="add-a-photo" size={24} color="#4a5c39" />
                  <Text style={styles.addImageButtonText}>Add Photo</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} currentScreen="ReportIncident" />
    </RNSafeAreaViewContext>
  );
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'low':
      return '#8ca982';
    case 'medium':
      return '#6b7a5e';
    case 'high':
      return '#4a5c39';
    default:
      return '#8ca982';
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f8f3',
  },
  gradientHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerContent: {
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
  scrollViewContent: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3a22',
    marginBottom: 16,
    
  },
  typeSection: {
    marginBottom: 95,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e4da',
  },
  typeButtonSelected: {
    backgroundColor: '#4a5c39',
    borderColor: '#4a5c39',
  },
  typeButtonText: {
    marginTop: 6,
    fontSize: 13,
    color: '#4a5c39',
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  severitySection: {
    marginBottom: 24,
  },
  severityContainer: {
    gap: 8,
  },
  severityButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e4da',
  },
  severityButtonSelected: {
    backgroundColor: '#4a5c39',
    borderColor: '#4a5c39',
  },
  severityButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  severityButtonText: {
    fontSize: 16,
    color: '#4a5c39',
    fontWeight: '500',
  },
  severityButtonTextSelected: {
    color: '#fff',
  },
  detailsSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4a5c39',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#2d3a22',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  otherInputContainer: {
    marginBottom: 24,
  },
  otherInput: {
    marginTop: 8,
  },
  photosSection: {
    marginBottom: 24,
  },
  imagePreviewContainer: {
    marginTop: 8,
  },
  imagePreviewWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e4da',
    borderStyle: 'dashed',
    marginRight: 12,
  },
  addImageButtonText: {
    marginTop: 8,
    fontSize: 12,
    color: '#4a5c39',
  },
  submitButton: {
    backgroundColor: '#4a5c39',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
    marginBottom: 48,
    flexDirection: 'row',
    gap: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default ReportIncident; 