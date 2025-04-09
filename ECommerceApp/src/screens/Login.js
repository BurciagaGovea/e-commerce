import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const LoginScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login here</Text>
      <Text style={styles.subtitle}>Welcome back you’ve been missed!</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={[styles.input, styles.inputWithBorder]}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signInButton}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.createText}>Create new account</Text>
      </TouchableOpacity>

      <Text style={styles.orContinue}>Or continue with</Text>

      <View style={styles.socialContainer}>
        <View style={styles.socialIcon}>
          <FontAwesome name="google" size={20} color="#111" />
        </View>
        <View style={styles.socialIcon}>
          <FontAwesome name="facebook" size={20} color="#111" />
        </View>
        <View style={styles.socialIcon}>
          <FontAwesome name="apple" size={20} color="#111" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#C37A74',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  input: {
    backgroundColor: '#F8F8FF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  inputWithBorder: {
    borderColor: '#C37A74',
    borderWidth: 1.5,
  },
  forgotText: {
    color: '#C37A74',
    alignSelf: 'flex-end',
    marginTop: 4,
    fontSize: 13,
  },
  signInButton: {
    backgroundColor: '#F7CFCB',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#D6D6FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    alignItems: 'center',
  },
  signInText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  createText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#111',
    fontSize: 14,
  },
  orContinue: {
    textAlign: 'center',
    color: '#C37A74',
    fontSize: 14,
    marginVertical: 24,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialIcon: {
    backgroundColor: '#F1F1F1',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 6,
  },
});

export default LoginScreen;
