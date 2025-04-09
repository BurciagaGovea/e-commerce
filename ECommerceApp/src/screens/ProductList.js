import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ProductCard from "../components/ProductCard"; // Importar el componente

const products = [
  {
    id: 1,
    name: "Chocolate Chip Cookies",
    price: "$5.00",
    rating: "4.9",
    imageUrl: "https://example.com/cookie1.jpg",
  },
  {
    id: 2,
    name: "Rainbow Cookies",
    price: "$6.00",
    rating: "4.9",
    imageUrl: "https://example.com/cookie2.jpg",
  },
  {
    id: 3,
    name: "Waffle Cookies",
    price: "$4.50",
    rating: "4.9",
    imageUrl: "https://example.com/cookie3.jpg",
  },
  {
    id: 4,
    name: "Matcha Cookies",
    price: "$7.00",
    rating: "4.9",
    imageUrl: "https://example.com/cookie4.jpg",
  },
];

const ProductList = () => {
  const handleAddToCart = (product) => {
    console.log("Producto agregado:", product.name);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Found</Text>
        <Text style={styles.resultsCount}>{products.length} Results</Text>
      </View>

      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} onAddToCart={handleAddToCart} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Muestra dos productos por fila
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  resultsCount: {
    fontSize: 18,
    color: "#666",
  },
  listContent: {
    paddingBottom: 24,
    justifyContent: "center",
  },
});

export default ProductList;
