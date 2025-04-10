import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { decode as atob } from 'base-64';
import axios from 'axios';

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
  const [orderId, setOrderId] = useState(null);
  const [userId, setUserId] = useState(null);

  // Cargar datos del usuario y carrito
  useEffect(() => {
    const initCart = async () => {
      const token = await AsyncStorage.getItem('TOKEN');
      const decoded = parseJwt(token);
      const clientId = decoded?.id || decoded?.sub || decoded?.user_id;
      setUserId(clientId);

      const existingCart = await AsyncStorage.getItem('CART_ITEMS');
      const parsedCart = existingCart ? JSON.parse(existingCart) : [];
      setCartItems(parsedCart);

      const res = await axios.post('http://192.168.1.72:8082/esb/orders/create', {
        client_id: clientId,
        products: parsedCart.map(p => ({
          product_id: p.id,
          quantity: "1"
        })),
      });

      setOrderId(res.data.order.id);
    };

    initCart();
  }, []);

  // Guardar en AsyncStorage para persistencia
  const updateCartStorage = async (newItems) => {
    setCartItems(newItems);
    await AsyncStorage.setItem('CART_ITEMS', JSON.stringify(newItems));
  };

  const handleIncrease = async (item) => {
    const updated = cartItems.map((p) =>
      p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
    );
    await updateCartStorage(updated);

    await axios.post('http://192.168.1.72:8082/esb/orders/add', {
      client_id: userId,
      product: [
        {
          product_id: item.id,
          quantity: "1"
        }
      ]
    });
  };

  const handleDecrease = async (item) => {
    if (item.quantity === 1) return;
    const updated = cartItems.map((p) =>
      p.id === item.id ? { ...p, quantity: p.quantity - 1 } : p
    );
    await updateCartStorage(updated);
  };

  const handleRemove = async (id) => {
    const updated = cartItems.filter((p) => p.id !== id);
    await updateCartStorage(updated);
  };

  const handleOrder = async () => {
    try {
      if (!orderId) return Alert.alert('Error', 'No hay una orden activa.');
      await axios.put(`http://192.168.1.72:8082/esb/orders/pay/${orderId}`);
      Alert.alert('Orden realizada', '¡Gracias por tu compra!');
      await updateCartStorage([]);
      await AsyncStorage.removeItem('CART_ITEMS');
    } catch (e) {
      Alert.alert('Error', 'No se pudo realizar la orden.');
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
          <View style={styles.quantityControls}>
            <TouchableOpacity style={styles.qtyButton} onPress={() => handleDecrease(item)}>
              <Text style={styles.qtySymbol}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity style={styles.qtyButton} onPress={() => handleIncrease(item)}>
              <Text style={styles.qtySymbol}>＋</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.removeIcon} onPress={() => handleRemove(item.id)}>
        <Text style={{ fontSize: 18, color: '#999' }}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Cart</Text>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />

      <View style={styles.summary}>
        <Text style={styles.lineItem}>
          Sub Total <Text style={styles.lineValue}>${subtotal.toFixed(1)}</Text>
        </Text>
        <Text style={[styles.lineItem, { fontWeight: 'bold' }]}>
          Total <Text style={[styles.lineValue, styles.totalValue]}>${subtotal.toFixed(1)}</Text>
        </Text>
        <TouchableOpacity style={styles.orderBtn} onPress={handleOrder}>
          <Text style={styles.orderText}>Order</Text>
        </TouchableOpacity>
      </View>
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
  itemImage: { width: 60, height: 60, resizeMode: 'contain', marginRight: 12 },
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
  quantityControls: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: {
    borderWidth: 1, borderColor: '#C37A74', borderRadius: 20,
    width: 28, height: 28, justifyContent: 'center', alignItems: 'center', marginHorizontal: 6,
  },
  qtySymbol: { color: '#C37A74', fontSize: 16, fontWeight: '600' },
  qty: { fontSize: 16 },
  price: { fontSize: 18, fontWeight: '600' },
  removeIcon: { position: 'absolute', top: 10, right: 10 },
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
