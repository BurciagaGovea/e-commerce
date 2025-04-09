import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { TOKEN, get_clients, get_orders, get_products, order_details } from '../../postman_routes/constants';

export default function Past_orders() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, clientsRes, productsRes] = await Promise.all([
          axios.get(get_orders, { headers: { Authorization: `Bearer ${TOKEN}` } }),
          axios.get(get_clients, { headers: { Authorization: `Bearer ${TOKEN}` } }),
          axios.get(get_products, { headers: { Authorization: `Bearer ${TOKEN}` } })
        ]);

        setOrders(ordersRes.data.orders.filter(order => order.status === 'completed'));
        setClients(clientsRes.data);
        setProducts(productsRes.data.products);
      } catch (err) {
        console.error('Error fetching data:', err.message);
      }
    };
    fetchData();
  }, []);

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.middleName} ${client.lastName}` : 'Unknown Client';
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Product #${productId}`;
  };

  const openOrderModal = async (orderId) => {
    try {
      const res = await axios.get(order_details+orderId, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      setSelectedOrder(res.data.order);
      setOrderDetails(res.data.orderDetails);
      setModalVisible(true);
    } catch (err) {
      console.error('Error fetching order details:', err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Past Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.subtitle}>Review completed orders</Text>

      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openOrderModal(item.id)}
            style={[styles.orderCard, styles.completedCard]}
          >
            <View style={styles.orderTextContainer}>
              <Text style={styles.orderTitle}>{getClientName(item.client_id)}</Text>
              <Text style={styles.orderDetails}>Order ID: {item.id}</Text>
              <Text style={styles.orderDetails}>Total: ${parseFloat(item.total_price).toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Order Details</Text>
            {selectedOrder && (
              <>
                <Text style={styles.modalText}>Client: {getClientName(selectedOrder.client_id)}</Text>
                <Text style={styles.modalText}>Order ID: {selectedOrder.id}</Text>
                <Text style={styles.modalText}>Total: ${parseFloat(selectedOrder.total_price).toFixed(2)}</Text>
                <Text style={styles.modalSubTitle}>Items:</Text>
                {orderDetails.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.modalText}>{getProductName(item.product_id)}</Text>
                    <Text style={styles.modalText}>Qty: {item.quantity}</Text>
                    <Text style={styles.modalText}>Unit: ${item.unit_price}</Text>
                    <Text style={styles.modalText}>Subtotal: ${item.subtotal}</Text>
                  </View>
                ))}
              </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
  },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
  },
  completedCard: {
    backgroundColor: '#E8E8FF',
  },
  orderTextContainer: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderDetails: {
    fontSize: 14,
    color: '#555',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '85%',
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalSubTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 5,
  },
  modalText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  itemRow: {
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#F6CEC8',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});