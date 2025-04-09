import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const orders = [
  { id: '1', name: 'Chocolate Cookie', status: 'Active', time: '18 hr' },
  { id: '2', name: 'Matcha Cookie', status: 'Active', time: '18 hr' },
  { id: '3', name: 'Brownies', status: 'Inactive', time: '1 week ago' },
  { id: '4', name: 'Cinammom Roll', status: 'Inactive', time: '1 month ago' },
];

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>View Orders</Text>
        <View style={{ width: 24 }} /> {/* Espacio para balancear íconos */}
      </View>

      <Text style={styles.subtitle}>Find your orders here</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isActive = item.status === 'Active';
          return (
            <View style={[styles.orderCard, isActive ? styles.activeCard : styles.inactiveCard]}>
              <View style={styles.orderTextContainer}>
                <Text style={styles.orderTitle}>{item.name}</Text>
                <View style={styles.orderStatus}>
                  <Icon name="flag-outline" size={14} color="#999" style={{ marginRight: 4 }} />
                  <Text style={{ color: '#777' }}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.orderTime}>{item.time}</Text>
            </View>
          );
        }}
      />
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
    },
    title: {
      fontSize: 20,
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
    activeCard: {
      backgroundColor: '#D9F8E5',
    },
    inactiveCard: {
      backgroundColor: '#F1F1F1',
    },
    orderTextContainer: {
      flex: 1,
    },
    orderTitle: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 4,
    },
    orderStatus: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    orderTime: {
      fontSize: 13,
      color: '#888',
    },
  });
  