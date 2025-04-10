import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { decode as atob } from 'base-64';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { get_clients, get_orders, order_details, get_product_by_id, pay_order } from '../postman_routes/constants';

const parseJwt = (token) => {
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
    return null;
  }
};

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [clientId, setClientId] = useState(null);
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPendingOrder, setHasPendingOrder] = useState(true);

  const fetchCartFromPendingOrder = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('TOKEN');
      if (!token) throw new Error('Token no encontrado');
      const decoded = parseJwt(token);
      const userId = decoded?.id;
      if (!userId) throw new Error('ID de usuario no válido');

      const clientsRes = await axios.get(get_clients, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const client = clientsRes.data.find(c => c.userId === userId);
      if (!client) throw new Error('Cliente no encontrado');

      setClientId(client.id);

      const ordersRes = await axios.get(get_orders, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const pendingOrder = ordersRes.data.orders.find(order =>
        order.client_id === client.id && order.status === "pending"
      );

      if (!pendingOrder) {
        setCartItems([]);
        setHasPendingOrder(false);
        return;
      }

      setPendingOrderId(pendingOrder.id);
      setHasPendingOrder(true);

      const detailsRes = await axios.get(order_details+pendingOrder.id, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const details = detailsRes.data.orderDetails;

      const enrichedItems = await Promise.all(details.map(async (item) => {
        const productRes = await axios.get(get_product_by_id+item.product_id, {
          headers: { Authorization: `Bearer ${token}` }
        });

        return {
          id: item.product_id,
          name: productRes.data.name,
          price: parseFloat(item.unit_price),
          quantity: item.quantity,
          imageUrl: productRes.data.url
        };
      }));

      setCartItems(enrichedItems);
    } catch (err) {
      console.error("Error al cargar carrito:", err.message);
      Alert.alert("Error", "No se pudo cargar el carrito.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCartFromPendingOrder();
    }, [])
  );

  const handleOrder = async () => {
    try {
      if (!pendingOrderId) return Alert.alert('Error', 'No hay una orden pendiente activa.');

      const token = await AsyncStorage.getItem('TOKEN');
      if (!token) throw new Error('Token no encontrado');

      await axios.put(pay_order + clientId, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Pedido realizado con éxito', '¡Gracias por tu compra!', [
        { text: 'OK', onPress: () => fetchCartFromPendingOrder() }
      ]);
    } catch (e) {
      console.error('Error al realizar la orden:', e.message);
      Alert.alert('Error', 'No se pudo completar el pago.');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <View style={styles.row}>
          <Text style={styles.star}>⭐ 4.9</Text>
          <View style={styles.shipping}>
            <FontAwesome name="truck" size={14} color="black" />
            <Text style={styles.shippingText}> Free</Text>
          </View>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.qty}>Cantidad: {item.quantity}</Text>
          <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Cart</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#D88E88" style={{ marginTop: 30 }} />
      ) : !hasPendingOrder ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: '#999' }}>No tienes carritos activos.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />

          <View style={styles.summary}>
            <Text style={styles.lineItem}>
              Sub Total <Text style={styles.lineValue}>${subtotal.toFixed(2)}</Text>
            </Text>
            <Text style={[styles.lineItem, { fontWeight: 'bold' }]}>
              Total <Text style={[styles.lineValue, styles.totalValue]}>${subtotal.toFixed(2)}</Text>
            </Text>
            <TouchableOpacity style={styles.orderBtn} onPress={handleOrder}>
              <Text style={styles.orderText}>Order</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: 20, flex: 1, backgroundColor: '#F9F9F9' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between' },
  headerText: { fontSize: 24, fontWeight: '600' },
  itemCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 14, marginBottom: 16,
    flexDirection: 'row', alignItems: 'center', elevation: 2,
  },
  itemImage: { width: 60, height: 60, resizeMode: 'contain', marginRight: 12, borderRadius: 10 },
  itemInfo: { flex: 1 },
  itemTitle: { fontWeight: '600', fontSize: 16, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  star: { marginRight: 8 },
  shipping: { flexDirection: 'row', alignItems: 'center' },
  shippingText: { fontSize: 12, marginLeft: 4 },
  rowBetween: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 12,
  },
  qty: { fontSize: 15 },
  price: { fontSize: 18, fontWeight: '600' },
  summary: { paddingHorizontal: 30, paddingVertical: 16 },
  lineItem: { fontSize: 16, color: '#444', marginBottom: 6 },
  lineValue: { fontWeight: '500' },
  totalValue: { color: '#D19793', fontSize: 18 },
  orderBtn: {
    marginTop: 20, backgroundColor: '#F6CEC8', borderRadius: 40,
    paddingVertical: 14, alignItems: 'center', marginBottom: 14,
  },
  orderText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default CartScreen;