import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Base API URL for all endpoints
const API_URL = 'http://192.168.100.156:5001/api';

/**
 * Helper function to retrieve authentication token from AsyncStorage
 * @returns {Promise<string|null>} The stored token or null if not found
 */
const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Authentication API endpoints
 * Handles user registration, login, logout, and password reset
 */
const authAPI = {
  /**
   * Register a new user
   * @param {string} username - User's username
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Response containing token and user data
   */
  register: async (username, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login an existing user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Response containing token and user data
   */
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logout the current user
   * Removes token and user data from AsyncStorage
   */
  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Request password reset for a user
   * @param {string} email - User's email
   * @returns {Promise<Object>} Response from the server
   */
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },
};

/**
 * Incidents API endpoints
 * Handles CRUD operations for environmental incidents
 */
const incidentsAPI = {
  /**
   * Create a new incident report
   * @param {Object} incidentData - Incident details including title, description, type, etc.
   * @returns {Promise<Object>} Created incident data
   */
  createIncident: async (incidentData) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create FormData object for multipart/form-data
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', incidentData.title);
      formData.append('description', incidentData.description);
      formData.append('type', incidentData.type);
      formData.append('severity', incidentData.severity);
      formData.append('status', incidentData.status);
      formData.append('location', JSON.stringify(incidentData.location));

      // Add images with proper formatting
      if (incidentData.images && incidentData.images.length > 0) {
        incidentData.images.forEach((uri, index) => {
          const filename = uri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';
          
          formData.append('images', {
            uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
            name: filename,
            type
          });
        });
      }

      const response = await fetch(`${API_URL}/incidents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create incident error:', error);
      throw error;
    }
  },

  /**
   * Get incidents reported by the current user
   * @returns {Promise<Array>} Array of user's incidents
   */
  getMyIncidents: async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.error('No token found in AsyncStorage');
        throw new Error('No authentication token found');
      }

      console.log('Making request to:', `${API_URL}/incidents`);
      console.log('With headers:', {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      });

      const response = await fetch(`${API_URL}/incidents`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid content type:', contentType);
        throw new Error('Server did not return JSON');
      }

      const data = await response.json();
      console.log('Received incidents data:', data);
      
      if (!Array.isArray(data)) {
        console.error('Expected array of incidents, got:', typeof data);
        throw new Error('Invalid response format');
      }

      return data;
    } catch (error) {
      console.error('Get incidents error:', error);
      if (error.message.includes('No authentication token found')) {
        throw new Error('Please log in to view your reports');
      }
      throw error;
    }
  },

  /**
   * Get recent incidents (public endpoint)
   * @returns {Promise<Array>} Array of recent incidents
   */
  getRecentIncidents: async () => {
    try {
      const response = await fetch(`${API_URL}/incidents/recent`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid content type:', contentType);
        throw new Error('Server did not return JSON');
      }

      const data = await response.json();
      console.log('Received recent incidents data:', data);
      
      if (!Array.isArray(data)) {
        console.error('Expected array of incidents, got:', typeof data);
        throw new Error('Invalid response format');
      }

      return data;
    } catch (error) {
      console.error('Get recent incidents error:', error);
      throw error;
    }
  },

  /**
   * Get all incidents (admin only)
   * @returns {Promise<Array>} Array of all incidents
   */
  getAllIncidents: async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/incidents/admin/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get all incidents error:', error);
      throw error;
    }
  },

  /**
   * Update incident status
   * @param {string} incidentId - ID of the incident to update
   * @param {string} status - New status to set
   * @returns {Promise<Object>} Updated incident data
   */
  updateIncidentStatus: async (incidentId, status) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`${API_URL}/incidents/${incidentId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Update incident status error:', error);
      throw error;
    }
  },

  /**
   * Delete an incident
   * @param {string} incidentId - ID of the incident to delete
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteIncident: async (incidentId) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`${API_URL}/incidents/${incidentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Delete incident error:', error);
      throw error;
    }
  },
};

/**
 * Users API endpoints
 * Handles user profile and leaderboard operations
 */
const usersAPI = {
  /**
   * Get the leaderboard data
   * @returns {Promise<Array>} Array of users sorted by points
   */
  getLeaderboard: async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/users/leaderboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  /**
   * Get current user's profile
   * @returns {Promise<Object>} User profile data
   */
  getUserProfile: async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @param {string} profilePicture - URI of new profile picture
   * @returns {Promise<Object>} Updated profile data
   */
  updateProfile: async (profileData, profilePicture) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      
      // Add text fields
      Object.keys(profileData).forEach(key => {
        formData.append(key, profileData[key]);
      });

      // Add profile picture if provided
      if (profilePicture) {
        formData.append('profilePicture', {
          uri: profilePicture,
          type: 'image/jpeg',
          name: 'profile-picture.jpg'
        });
      }

      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Delete user account
   * Removes user data and authentication tokens
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteAccount: async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Deleting account with token:', token); // Debug log

      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      // Clear local storage after successful deletion
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');

      return await response.json();
    } catch (error) {
      console.error('Error deleting account:', error);
      // Don't clear storage on error
      throw error;
    }
  },
};

// Export all API services
export { authAPI, incidentsAPI, usersAPI }; 