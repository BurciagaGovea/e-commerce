import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob } from 'base-64';
import axios from 'axios';
import moment from 'moment';
import { get_orders } from '../postman_routes/constants';

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

        const filtered = res.data.orders.filter(order =>
          order.client_id === userId &&
          (order.status === 'pending' || order.status === 'completed')
        );

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
    const isPending = item.status === 'pending';
    const statusColor = isPending ? '#D1F1D1' : '#EAEAEA';
    const statusText = isPending ? 'Pending' : 'Completed';
    const createdDate = moment(item.createdAt).format('LLL'); // Ej: April 10, 2025 10:33 AM

    return (
      <View style={[styles.orderCard, { backgroundColor: statusColor }]}>
        <Text style={styles.orderTitle}>Order #{item.id}</Text>
        <Text style={styles.detail}>Total: ${parseFloat(item.total_price).toFixed(2)}</Text>
        <Text style={styles.detail}>Status: {statusText}</Text>
        <Text style={styles.date}>{createdDate}</Text>
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
        <Text style={styles.headerTitle}>Your Orders</Text>
        <View style={{ width: 24 }} /> {/* Espaciador */}
      </View>

      <Text style={styles.subTitle}>Pending and completed orders</Text>

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
  detail: {
    fontSize: 15,
    marginTop: 4,
    color: '#444',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    textAlign: 'right',
  },
});
