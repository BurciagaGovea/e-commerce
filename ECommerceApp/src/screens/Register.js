import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Create an account so you can explore and purchase your favorite
        products.
      </Text>

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
        <TextInput
          placeholder="First Name"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="First Name"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.signUpText}>Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.haveAccount}>Already have an account</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    marginBottom: 32,
    marginLeft:12,
    marginRight:12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F7F7F7',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    marginLeft:12,
    marginRight:12,
  },
  signUpButton: {
    backgroundColor: '#F7CFCB',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#D6D6FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    alignItems: 'center',
    marginLeft:12,
    marginRight:12,
  },
  signUpText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  haveAccount: {
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

export default RegisterScreen;
