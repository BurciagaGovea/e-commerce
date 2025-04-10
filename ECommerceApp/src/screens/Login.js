import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../postman_routes/constants';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña.');
      return;
    }

    //http://192.168.1.16:8081/esb/users/login
  
    try {
      const res = await axios.post(login, {
        email,
        password,
      });
  
      const token = res.data.token;
  
      console.log('🔐 TOKEN recibido:\n', token); // 👈 Este es el que copiarás a jwt.io
  
      await AsyncStorage.setItem('TOKEN', token);
  
      Alert.alert('Bienvenido', res.data.message);
      navigation.navigate('Home');
    } catch (err) {
      console.error(err.response?.data || err.message);
      Alert.alert('Error', 'Credenciales incorrectas o fallo en el servidor.');
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login here</Text>
      <Text style={styles.subtitle}>Welcome back you’ve been missed!</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
          style={[styles.input, styles.inputWithBorder]}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.createText}>Create new account</Text>
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
    backgroundColor: '#F7F7F7',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
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
    marginLeft: 12,
    marginRight: 12,
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
});

export default LoginScreen;
