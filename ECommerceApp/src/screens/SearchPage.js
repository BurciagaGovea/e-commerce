import React from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const products = [
  { id: '1', name: 'Chocolate Chip', price: 5, rating: 4.9, imageUrl: "https://i.pinimg.com/736x/3a/04/91/3a04911bb4ad05f374b7c5ae23dcf293.jpg" },
  { id: '2', name: 'Rainbow', price: 5, rating: 4.9, imageUrl: "https://i.pinimg.com/736x/d2/18/4a/d2184afbfda5a3c1f4694d9b3b375a9a.jpg" },
  { id: '3', name: 'Waffle', price: 5, rating: 4.9, imageUrl: "https://i.pinimg.com/736x/cb/35/41/cb3541fec49e6325580bdb3b88dca1be.jpg" },
  { id: '4', name: 'Matcha', price: 5, rating: 4.9, imageUrl: "https://i.pinimg.com/736x/8a/cf/2e/8acf2e1dc78f433674bd3f7780364fa5.jpg" },
];

export default function SearchPage({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}><Icon name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Search your Flavour</Text>
        <TouchableOpacity><Icon name="cart-outline" size={24} onPress={() => navigation.navigate('Wishlist')} /></TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Icon name="search-outline" size={20} color="#999" style={{ marginLeft: 10 }} />
        <TextInput placeholder="Search Cookies" style={styles.input} />
        <TouchableOpacity>
          <View style={styles.filterButton}>
            <Icon name="options-outline" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Results text */}
      <Text style={styles.resultsText}><Text style={{ fontWeight: 'bold' }}>Found</Text> 80 Results</Text>

      {/* Product Grid */}
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.priceTag}><Text style={styles.priceText}>${item.price}</Text></View>
            <Image source={{ uri:item.imageUrl }} style={styles.image} resizeMode="contain" />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.subtext}>Cookies</Text>
            <View style={styles.bottomRow}>
              <Icon name="heart-outline" size={18} />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F9F9F9',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 8,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
  },
  filterButton: {
    backgroundColor: '#D19793',
    padding: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  resultsText: {
    fontSize: 16,
    marginBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  priceTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFE8E3',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 10,
  },
  priceText: {
    fontSize: 12,
    color: '#000',
  },
  image: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  name: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#D19793',
  },
  subtext: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rating: {
    fontWeight: '500',
  },
});
