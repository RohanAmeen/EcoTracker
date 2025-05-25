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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';

const Profile = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    address: '123 Main Street, City, Country',
    bio: 'Environmental enthusiast and community activist',
  });
  const [editedData, setEditedData] = useState({ ...userData });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...userData });
  };

  const handleSave = () => {
    setUserData(editedData);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...userData });
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Add account deletion logic here
            Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  const renderEditableField = (label, key, placeholder) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={editedData[key]}
        onChangeText={(text) => setEditedData({ ...editedData, [key]: text })}
        placeholder={placeholder}
        placeholderTextColor="#888"
        editable={isEditing}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <LinearGradient
        colors={["#2A7B9B", "#57C785", "#2A7B9B"]}
        style={styles.gradientHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name="person" size={50} color="#4a5c39" />
              </View>
            )}
            <View style={styles.editImageButton}>
              <Icon name="edit" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          {isEditing ? (
            <View style={styles.editModeContainer}>
              <View style={styles.editFieldsContainer}>
                {renderEditableField('Name', 'name', 'Enter your name')}
                {renderEditableField('Email', 'email', 'Enter your email')}
                {renderEditableField('Phone', 'phone', 'Enter your phone number')}
                {renderEditableField('Address', 'address', 'Enter your address')}
                {renderEditableField('Bio', 'bio', 'Tell us about yourself')}
              </View>

              <View style={styles.editActionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
                  <Icon name="lock" size={24} color="#4a5c39" />
                  <Text style={styles.actionButtonText}>Change Password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDeleteAccount}>
                  <Icon name="delete" size={24} color="#ff4444" />
                  <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete Account</Text>
                </TouchableOpacity>

                <View style={styles.editButtonsContainer}>
                  <TouchableOpacity style={[styles.editButton, styles.cancelButton]} onPress={handleCancel}>
                    <Text style={[styles.editButtonText, styles.cancelButtonText]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.editButton, styles.saveButton]} onPress={handleSave}>
                    <Text style={styles.editButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{userData.name}</Text>
                <Text style={styles.bio}>{userData.bio}</Text>
                
                <View style={styles.infoRow}>
                  <Icon name="email" size={20} color="#4a5c39" />
                  <Text style={styles.infoText}>{userData.email}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Icon name="phone" size={20} color="#4a5c39" />
                  <Text style={styles.infoText}>{userData.phone}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Icon name="location-on" size={20} color="#4a5c39" />
                  <Text style={styles.infoText}>{userData.address}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Icon name="edit" size={20} color="#fff" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} currentScreen="Profile" />
    </SafeAreaView>
  );
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
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollViewContent: {
    flex: 1,
  },
  profileContainer: {
    padding: 16,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e4da',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4a5c39',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3a22',
    textAlign: 'center',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#4a5c39',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#4a5c39',
    marginLeft: 12,
    flex: 1,
  },
  inputGroup: {
    width: '100%',
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
  editModeContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
  },
  editFieldsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  editActionsContainer: {
    width: '100%',
    gap: 16,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  editButton: {
    backgroundColor: '#4a5c39',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#4a5c39',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4a5c39',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#4a5c39',
  },
  actionButtonsContainer: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#4a5c39',
    fontWeight: '500',
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  deleteButtonText: {
    color: '#ff4444',
  },
});

export default Profile; 