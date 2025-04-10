import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { decode as atob } from 'base-64';
import { get_userbyid } from '../postman_routes/constants';

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map((c) =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    return null;
  }
}

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('TOKEN');
        if (!token) throw new Error('Token no encontrado');

        const decoded = parseJwt(token);
        if (!decoded) throw new Error('Token inválido');

        const userId = decoded.id || decoded.sub || decoded.user_id;
        if (!userId) throw new Error('ID de usuario no encontrado en el token');

        const res = await axios.get(`${get_userbyid}${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('TOKEN');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      Alert.alert('Error', 'No se pudo cerrar sesión.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#D88E88" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Error cargando los datos del usuario.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile image */}
      <Image
        source={require('../media/bread.jpg')}
        style={styles.profileImage}
      />

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Icon name="person" size={20} style={styles.icon} />
          <View>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{`${user.firstName} ${user.middleName} ${user.lastName}`}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon name="business" size={20} style={styles.icon} />
          <View>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>Not provided</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon name="call" size={20} style={styles.icon} />
          <View>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{user.phone}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon name="mail" size={20} style={styles.icon} />
          <View>
            <Text style={styles.label}>E-Mail</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
        </View>
      </View>

      {/* View orders button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Orders')}>
        <Text style={styles.buttonText}>View orders</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    marginTop: 15,
    marginLeft: 5,
    fontSize: 24,
    fontWeight: '600',
  },
  logoutText: {
    marginTop: 15,
    fontSize: 14,
    color: '#D19793',
    fontWeight: '600',
    padding: 6,
    paddingHorizontal: 10,
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginVertical: 20,
  },
  infoContainer: {
    marginTop: 50,
    marginBottom: 50,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  icon: {
    marginRight: 12,
    marginTop: 3,
    color: '#D88E88',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D19793',
  },
  value: {
    fontSize: 15,
    color: '#000',
  },
  button: {
    backgroundColor: '#F6CEC8',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
});
