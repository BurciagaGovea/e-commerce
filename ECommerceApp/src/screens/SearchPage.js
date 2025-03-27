import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
// o import Ionicons from 'react-native-vector-icons/Ionicons';

const mockData = [
  {
    id: '1',
    name: 'Chocolate Chip',
    category: 'Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1559076728-a076fc9fab60',
    price: 5,
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Rainbow',
    category: 'Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90',
    price: 5,
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Waffle',
    category: 'Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1588382519841-35fbbd6f6749',
    price: 5,
    rating: 4.9,
  },
  {
    id: '4',
    name: 'Matcha',
    category: 'Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684ce1e1f04',
    price: 5,
    rating: 4.9,
  },
  // Agrega más ítems si lo deseas
];

const Search = () => {
  const [searchText, setSearchText] = useState('');
  
  // Aquí podrías filtrar los datos con base en searchText
  const dataFiltered = mockData; // Simplificado, sin filtrar

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con ícono de menú y carrito (o cualquier otro ícono) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconLeft}>
          <Ionicons name="menu-outline" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Search your Flavour</Text>
        
        <TouchableOpacity style={styles.headerIconRight}>
          <Ionicons name="cart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#aaa" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Cookies"
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Resultados */}
      <Text style={styles.resultsText}>Found {dataFiltered.length} Results</Text>

      {/* Lista de productos en 2 columnas */}
      <FlatList
        data={dataFiltered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            {/* Imagen del producto */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              {/* Etiqueta de precio */}
              <View style={styles.priceTag}>
                <Text style={styles.priceText}>${item.price}</Text>
              </View>
            </View>
            
            {/* Nombre y categoría */}
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>

            {/* Parte inferior: ícono de favorito y rating */}
            <View style={styles.cardFooter}>
              <Ionicons name="heart-outline" size={20} color="#333" />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIconLeft: {
    marginRight: 10,
  },
  headerIconRight: {
    marginLeft: 'auto',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  /* SEARCH BAR */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  /* RESULTS TEXT */
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginVertical: 16,
  },
  /* GRID */
  flatListContent: {
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    borderRadius: 16,
    margin: 8,
    padding: 12,
    // Sombra (iOS) / Elevation (Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  priceTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F8E1E7', // un rosa claro
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
});
