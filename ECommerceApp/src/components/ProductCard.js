import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>{product.price}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => onAddToCart(product)}>
        <Text style={styles.addButtonText}>Agregar al carrito</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F0F0F0', // Gris claro
    borderRadius: 10,
    margin: 10,
    padding: 10,
    width: 160, // Tamaño fijo
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2, // Contorno negro sólido
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#000', // Negro
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProductCard;
