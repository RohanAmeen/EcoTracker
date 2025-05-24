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

const { height, width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    navigation.navigate('Home');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.outerContainer}
    >
      <SafeAreaView style={styles.outerContainer}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
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
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.divider} />
            </View>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adminLink}>
              <Text style={styles.adminLinkText}>Login as Administrator</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    height: height * 0.35,
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
  loginButton: {
    backgroundColor: '#6b7a5e',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
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
  signupButton: {
    borderWidth: 1.5,
    borderColor: '#6b7a5e',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  signupButtonText: {
    color: '#6b7a5e',
    fontSize: 17,
    fontWeight: 'bold',
  },
  adminLink: {
    alignItems: 'center',
    marginTop: 18,
  },
  adminLinkText: {
    color: '#6b7a5e',
    fontSize: 15,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default LoginScreen; 