import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob } from 'base-64';
import axios from 'axios';
import moment from 'moment'; // Para mostrar "1 week ago", "18 hr", etc.
import { get_orders } from '../postman_routes/constants';


export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decode token manualmente
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c =>
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('TOKEN');
        if (!token) throw new Error('Token no encontrado');

        const decoded = parseJwt(token);
        const userId = decoded?.id || decoded?.sub || decoded?.user_id;

        const res = await axios.get(get_orders, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const filtered = res.data.orders.filter(order => order.client_id === userId);
        setOrders(filtered);
      } catch (err) {
        console.error('Error al obtener órdenes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderItem = ({ item }) => {
    const isActive = item.status === 'pending' || item.status === 'processing';
    const statusColor = isActive ? '#D1F1D1' : '#EAEAEA';
    const timeAgo = moment(item.createdAt).fromNow();

    return (
      <View style={[styles.orderCard, { backgroundColor: statusColor }]}>
        <Text style={styles.orderTitle}>Order #{item.id}</Text>
        <Text style={styles.statusText}>{isActive ? 'Active' : 'Inactive'}</Text>
        <Text style={styles.timeText}>{timeAgo}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Orders</Text>
        <View style={{ width: 24 }} /> {/* Espaciador */}
      </View>

      <Text style={styles.subTitle}>Find your orders here</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#D88E88" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  orderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  statusText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
});
