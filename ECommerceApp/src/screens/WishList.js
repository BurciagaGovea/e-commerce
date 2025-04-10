import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob } from 'base-64';

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

export default function WishList({ navigation }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = await AsyncStorage.getItem('TOKEN');
        if (!token) {
          console.warn('No token found');
          return;
        }

        const decoded = parseJwt(token);
        const id = decoded?.id || decoded?.sub || decoded?.user_id;
        if (!id) {
          console.warn('User ID not found in token');
          return;
        }

        setUserId(id);
        const url = `http://192.168.1.72:8081/esb/wishlist/${id}`;
        const wishlistRes = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const wishlist = wishlistRes.data.wishlist;
        if (!wishlist || wishlist.length === 0) {
          setWishlistItems([]);
          return;
        }

        const detailedItems = await Promise.all(
          wishlist.map(async (item) => {
            try {
              const productRes = await axios.get(
                `http://192.168.1.72:8081/esb/products/get_products/${item.product_id}`
              );
              const product = productRes.data.product;
              return {
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                imageUrl: product.url || 'https://via.placeholder.com/150',
              };
            } catch (productError) {
              console.warn('Error fetching product details:', productError);
              return null;
            }
          })
        );

        setWishlistItems(detailedItems.filter(Boolean)); // Elimina nulls
      } catch (err) {
        console.error('❌ Error cargando la wishlist:', err);
        Alert.alert('Error', 'No se pudo cargar la wishlist.');
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (product_id) => {
    try {
      if (!userId) return;

      await axios.put(`http://192.168.1.72:8081/esb/wishlist/remove`, {
        user_id: userId,
        product_id: product_id,
      });

      setWishlistItems((prev) => prev.filter((item) => item.id !== product_id));
      Alert.alert('Eliminado', 'Producto eliminado de tu wishlist');
    } catch (err) {
      console.error('Error al eliminar de wishlist:', err);
      Alert.alert('Error', 'No se pudo eliminar el producto');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wishlist</Text>

      {wishlistItems.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
          No hay productos en tu wishlist.
        </Text>
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.deleteTag}
                onPress={() => removeFromWishlist(item.id)}
              >
                <Text style={styles.deteleTxt}>x</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { item })}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 5,
    marginTop: 15,
    marginBottom: 20,
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
  deleteTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#D19793',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 10,
    zIndex: 10,
  },
  deteleTxt: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
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
