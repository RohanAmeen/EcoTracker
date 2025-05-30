import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../AuthContext';
import { authAPI } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

/**
 * LoginScreen Component
 * Handles user authentication and login functionality
 * Provides a form for email and password input
 * Includes forgot password and signup options
 */
const LoginScreen = () => {
  // Get authentication context functions
  const { setIsLoggedIn, setUser, setIsAdmin } = useAuth();
  
  // Form state management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Navigation hook
  const navigation = useNavigation();

  /**
   * Handles the login process
   * Validates input fields
   * Makes API call to authenticate user
   * Updates authentication context on success
   */
  const handleLogin = async () => {
    // Validate input fields
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      
      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }

      if (!response.token || !response.user) {
        Alert.alert('Error', 'Invalid response from server');
        return;
      }

      // Check if user is admin based on email domain
      const isAdminUser = email.endsWith('@admin.com');
      setIsAdmin(isAdminUser);

      // Update authentication context
      setUser(response.user);
      setIsLoggedIn(true);

      // Navigation will be handled by the AppNavigator based on isAdmin state
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles forgot password functionality
   * Validates email input
   * Shows success message (actual password reset would be implemented in the API)
   */
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address first');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    Alert.alert(
      'Success',
      'Password reset instructions have been sent to your email account',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appTitle}>EcoTracker</Text>
          <Text style={styles.subtitle}>Protecting Our Environment Together</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.formContainer}>
            <Text style={styles.welcome}>Welcome</Text>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#b0b0b0"
              editable={!loading}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#b0b0b0"
              editable={!loading}
            />
            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.disabledButton]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.divider} />
            </View>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => navigation.navigate('Signup')}
              disabled={loading}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
      <View style={styles.footer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4a5c39',
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
    backgroundColor: '#4a5c39',
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: Platform.OS === 'ios' ? 100 : 32,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 0,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4a5c39',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 15,
    color: '#4a5c39',
    marginBottom: 8,
    marginTop: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    color: '#4a5c39',
  },
  loginButton: {
    backgroundColor: '#4a5c39',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 12,
  },
  forgotPasswordText: {
    color: '#4a5c39',
    fontSize: 15,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  orText: {
    marginHorizontal: 12,
    color: '#6c757d',
    fontSize: 15,
    fontWeight: '500',
  },
  signupButton: {
    borderWidth: 1.5,
    borderColor: '#4a5c39',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  signupButtonText: {
    color: '#4a5c39',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  footer: {
    backgroundColor: '#fff',
    height: Platform.OS === 'ios' ? 100 : 50,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});

export default LoginScreen; 