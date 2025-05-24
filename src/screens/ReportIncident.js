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
          <Text style={styles.sectionTitle}>Incident Details</Text>

          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Brief description of the issue"
            placeholderTextColor="#888"
          />

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

          <Text style={styles.label}>Reported By</Text>
          <TextInput
            style={styles.input}
            value={reportedBy}
            onChangeText={setReportedBy}
            placeholder="Your Name (Optional)"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Type *</Text>
          <View style={styles.optionsContainer}>
            {['trash', 'air', 'water', 'noise', 'other'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  type === option && styles.optionButtonSelected,
                ]}
                onPress={() => handleTypeSelect(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    type === option && styles.optionTextSelected,
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
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

          <Text style={styles.label}>Severity *</Text>
          <View style={styles.optionsContainer}>
            {['low', 'medium', 'high'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  severity === option && styles.optionButtonSelected,
                ]}
                onPress={() => setSeverity(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    severity === option && styles.optionTextSelected,
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Photos</Text>
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
      </ScrollView>
      <BottomNav navigation={navigation} currentScreen="ReportIncident" />
    </RNSafeAreaViewContext>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0ede3',
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  gradientHeader: {
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3a22',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  otherInputContainer: {
    marginBottom: 15,
  },
  otherInput: {
    borderColor: '#8ca982',
    backgroundColor: '#eaf3e6',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionButtonSelected: {
    backgroundColor: '#8ca982',
    borderColor: '#8ca982',
  },
  optionText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#fff',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreviewWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    borderRadius: 10,
    padding: 2,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addImageButtonText: {
    fontSize: 10,
    color: '#4a5c39',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#4a5c39',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReportIncident; 