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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';

const { height, width } = Dimensions.get('window');

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    // TODO: Implement actual signup logic
    console.log('Signup attempt:', { name, email, password });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appTitle}>EcoTracker</Text>
            <Text style={styles.subtitle}>Protecting Our Environment Together</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.welcome}>Create Account</Text>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              placeholderTextColor="#b0b0b0"
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#b0b0b0"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#b0b0b0"
            />
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#b0b0b0"
            />
            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.divider} />
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginLink}>
              <Text style={styles.loginLinkText}>Already have an account?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNav navigation={navigation} currentScreen="Signup" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4a5c39',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
    backgroundColor: '#4a5c39',
  },
  logo: {
    width: 56,
    height: 56,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#f0f0f0',
    marginBottom: 0,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 24,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4a5c39',
    marginBottom: 18,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#4a5c39',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f6f8f3',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e4da',
    color: '#333',
  },
  signupButton: {
    backgroundColor: '#4a5c39',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e4da',
  },
  orText: {
    marginHorizontal: 10,
    color: '#b0b0b0',
    fontSize: 14,
  },
  loginButton: {
    borderWidth: 1.5,
    borderColor: '#4a5c39',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loginButtonText: {
    color: '#4a5c39',
    fontSize: 17,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  loginLinkText: {
    color: '#4a5c39',
    fontSize: 15,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default SignupScreen; 