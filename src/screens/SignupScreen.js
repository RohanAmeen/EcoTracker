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
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.outerContainer}
    >
      <SafeAreaView style={styles.outerContainer}>
        <LinearGradient
          colors={["#b7c9a8", "#8ca982"]}
          style={styles.gradientHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appTitle}>EcoTracker</Text>
          <Text style={styles.subtitle}>Protecting Our Environment Together</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={styles.welcome}>Create Account</Text>
          <View style={styles.flexGrowFields}>
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
          </View>

          {/* Buttons always visible at the bottom */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.orText}>Already have an account?</Text>
              <View style={styles.divider} />
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f6f8f3',
  },
  gradientHeader: {
    width: '100%',
    height: height * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
    paddingBottom: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  logo: {
    width: 56,
    height: 56,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 26,
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
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 16,
    backgroundColor: 'transparent',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  flexGrowFields: {
    flexGrow: 1,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4b5e3c',
    marginBottom: 18,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#6b7a5e',
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
  bottomButtons: {
    marginTop: 12,
  },
  signupButton: {
    backgroundColor: '#6b7a5e',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e4da',
  },
  orText: {
    marginHorizontal: 10,
    color: '#6b7a5e',
    fontSize: 13,
  },
  loginButton: {
    borderWidth: 1.5,
    borderColor: '#6b7a5e',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loginButtonText: {
    color: '#6b7a5e',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default SignupScreen; 