import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Icon name="heart-outline" size={22} style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="cart-outline" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile image */}
      <Image
        source={{ uri: 'https://randomuser.me/api/portraits/women/65.jpg' }}
        style={styles.profileImage}
      />

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Icon name="person" size={20} style={styles.icon} />
          <View>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>Amy Young</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon name="business" size={20} style={styles.icon} />
          <View>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>Home 24 st 232</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon name="call" size={20} style={styles.icon} />
          <View>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>+98 1245560090</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon name="mail" size={20} style={styles.icon} />
          <View>
            <Text style={styles.label}>E-Mail</Text>
            <Text style={styles.value}>amyyoung@random.com</Text>
          </View>
        </View>
      </View>

      {/* View orders button */}
      <TouchableOpacity style={styles.button}>
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
    fontSize: 20,
    fontWeight: '600',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
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
