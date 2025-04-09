import React from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const wishlistItems = [
  {
    id: '1',
    name: 'Brownies',
    price: 12,
    imageUrl: 'https://i.pinimg.com/736x/29/2f/52/292f522da15bcda6c1797abf7ab96e88.jpg',
  },
  {
    id: '2',
    name: 'Blackberry Pie',
    price: 12,
    imageUrl: 'https://i.pinimg.com/736x/c2/ab/69/c2ab698f8160ba745a20338a58d357f2.jpg',
  },
  {
    id: '3',
    name: 'Strawberry cake',
    price: 12,
    imageUrl: 'https://i.pinimg.com/736x/44/1b/7e/441b7eda7a6e54885aec61136047e701.jpg',
  },
  {
    id: '4',
    name: 'Matcha Cupcake',
    price: 12,
    imageUrl: 'https://i.pinimg.com/736x/88/f7/6d/88f76de884ad7115eda4a029c29d9a1d.jpg',
  },
];

export default function WishList() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="close" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Wishlist</Text>

      {/* Grid List */}
      <FlatList
        data={wishlistItems}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: {
    height: 100,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  itemName: {
    marginTop: 10,
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },
  itemPrice: {
    marginTop: 4,
    color: '#D88E88',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});
