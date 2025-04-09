import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/736x/3d/b8/b5/3db8b544375edb31c502eb352dd1a04b.jpg' }} // Puedes cambiar la imagen
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Discover Your Taste</Text>
        <Text style={styles.subtitle}>
          Explore all the existing desserts that you deserve
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    background: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    overlay: {
      backgroundColor: 'rgba(255,255,255,0.85)',
      padding: 30,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 15,
      color: '#333',
    },
    subtitle: {
      fontSize: 15,
      textAlign: 'center',
      color: '#555',
      marginBottom: 30,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 30,
    },
    loginButton: {
      backgroundColor: '#F6CEC8',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 16,
      elevation: 2,
    },
    loginText: {
      fontWeight: '600',
      color: '#fff',
    },
    registerButton: {
      backgroundColor: '#fff',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#F4D9D7',
    },
    registerText: {
      fontWeight: '600',
      color: '#F6CEC8',
    },
  });
  