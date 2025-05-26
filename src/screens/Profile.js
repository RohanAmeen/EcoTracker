import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import { usersAPI } from '../services/api';
import { useAuth } from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
  const { user: authUser, signOut, setNavigation } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    username: '',
    profilePicture: null,
  });
  const [editedData, setEditedData] = useState({ ...userData });

  useEffect(() => {
    fetchUserProfile();
    setNavigation(navigation);
  }, [navigation]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getUserProfile();
      setUserData({
        name: data.name || data.username,
        email: data.email,
        username: data.username,
        profilePicture: data.profilePicture,
      });
      setEditedData({
        name: data.name || data.username,
        email: data.email,
        username: data.username,
        profilePicture: data.profilePicture,
      });
      setProfileImage(data.profilePicture);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

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
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...userData });
  };

  const handleSave = async () => {
    try {
      const updatedUser = await usersAPI.updateProfile(editedData, profileImage);
      setUserData({
        ...updatedUser,
        name: updatedUser.name || updatedUser.username,
      });
      setProfileImage(updatedUser.profilePicture);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
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
          onPress: async () => {
            try {
              setLoading(true);
              
              // Delete account
              await usersAPI.deleteAccount();
              
              // Show success message
              Alert.alert(
                'Success',
                'Your account has been deleted successfully.',
                [
                  {
                    text: 'OK',
                    onPress: async () => {
                      // Let signOut handle the navigation
                      await signOut();
                    },
                  },
                ],
                { cancelable: false }
              );
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert(
                'Error',
                error.message === 'No authentication token found'
                  ? 'Please log in again to delete your account.'
                  : 'Failed to delete account. Please try again.'
              );
            } finally {
              setLoading(false);
            }
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a5c39" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <ScrollView style={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <TouchableOpacity 
              style={styles.profileImageContainer} 
              onPress={isEditing ? pickImage : undefined}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Icon name="person" size={50} color="#4a5c39" />
                </View>
              )}
              {isEditing && (
                <View style={styles.editImageButton}>
                  <Icon name="edit" size={20} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.username}>@{userData.username}</Text>
          </View>

          {isEditing ? (
            <View style={styles.editModeContainer}>
              <View style={styles.editFieldsContainer}>
                {renderEditableField('Name', 'name', 'Enter your name')}
                {renderEditableField('Email', 'email', 'Enter your email')}
                {renderEditableField('Username', 'username', 'Enter your username')}
              </View>

              <View style={styles.editActionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
                  <View style={styles.actionButtonContent}>
                    <Icon name="lock" size={24} color="#4a5c39" />
                    <Text style={styles.actionButtonText}>Change Password</Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="#4a5c39" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDeleteAccount}>
                  <View style={styles.actionButtonContent}>
                    <Icon name="delete" size={24} color="#ff4444" />
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete Account</Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="#ff4444" />
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
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Icon name="email" size={20} color="#4a5c39" />
                    </View>
                    <View style={styles.infoTextContainer}>
                      <Text style={styles.infoLabel}>Email</Text>
                      <Text style={styles.infoText}>{userData.email}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.infoDivider} />
                  
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Icon name="person" size={20} color="#4a5c39" />
                    </View>
                    <View style={styles.infoTextContainer}>
                      <Text style={styles.infoLabel}>Username</Text>
                      <Text style={styles.infoText}>{userData.username}</Text>
                    </View>
                  </View>
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
    backgroundColor: '#f0ede3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    flex: 1,
  },
  profileContainer: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4a5c39',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e4da',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#4a5c39',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3a22',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#6b7a5e',
    marginBottom: 8,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f6f8f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7a5e',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#2d3a22',
    fontWeight: '500',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#e0e4da',
    marginVertical: 8,
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
  },
  editFieldsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  editActionsContainer: {
    width: '100%',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#4a5c39',
    fontWeight: '500',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  deleteButton: {
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  deleteButtonText: {
    color: '#ff4444',
  },
});

export default Profile; 