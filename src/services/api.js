import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.100.177:5001/api';

// Helper function to get auth token
const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Authentication API calls
const authAPI = {
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

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
};

// Incidents API calls
const incidentsAPI = {
  createIncident: async (incidentData) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/incidents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(incidentData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create incident error:', error);
      throw error;
    }
  },

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
};

const usersAPI = {
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

  updateProfile: async (profileData) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
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

// Single export statement for all APIs
export { authAPI, incidentsAPI, usersAPI }; 