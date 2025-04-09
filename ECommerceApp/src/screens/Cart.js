import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const cartItems = [
  {
    id: '1',
    name: 'Chocolate Chip',
    price: 9.8,
    quantity: 1,
    imageUrl: "https://i.pinimg.com/736x/75/94/e9/7594e99c7cf5eed21655953b9e7a3e7c.jpg",
  },
  {
    id: '2',
    name: 'Croissant',
    price: 6.0,
    quantity: 1,
    imageUrl: "https://i.pinimg.com/736x/76/15/16/761516543db4e3a85bbae9de0eeb0c75.jpg",
  },
];

const CartScreen = () => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 4;
  const total = subtotal - discount;

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
            <TouchableOpacity style={styles.qtyButton}>
              <Text style={styles.qtySymbol}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity style={styles.qtyButton}>
              <Text style={styles.qtySymbol}>＋</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.removeIcon}>
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
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />

      <View style={styles.summary}>
        <Text style={styles.lineItem}>
          Sub Total <Text style={styles.lineValue}>${subtotal.toFixed(1)}</Text>
        </Text>
        <Text style={styles.lineItem}>
          Promocode <Text style={styles.lineValue}>${discount.toFixed(2)}</Text>
        </Text>
        <Text style={styles.lineItem}>
          Delivery Charges <Text style={styles.lineValue}>Free</Text>
        </Text>
        <Text style={[styles.lineItem, { fontWeight: 'bold' }]}>
          Total <Text style={[styles.lineValue, styles.totalValue]}>${total.toFixed(1)}</Text>
        </Text>
        <TouchableOpacity style={styles.orderBtn}>
          <Text style={styles.orderText}>Order</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop:20,
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
  },
  closeBtn: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
    elevation: 3,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#ccc',
  },
  itemImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 8,
  },
  shipping: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shippingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    borderWidth: 1,
    borderColor: '#C37A74',
    borderRadius: 20,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  qtySymbol: {
    color: '#C37A74',
    fontSize: 16,
    fontWeight: '600',
  },
  qty: {
    fontSize: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
  },
  removeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  summary: {
    paddingHorizontal: 30,
    paddingVertical: 16,
  },
  lineItem: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  lineValue: {
    float: 'right',
    fontWeight: '500',
  },
  totalValue: {
    color: '#D19793',
    fontSize: 18,
  },
  orderBtn: {
    marginTop: 20,
    backgroundColor: '#F6CEC8',
    borderRadius: 40,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  orderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default CartScreen;
