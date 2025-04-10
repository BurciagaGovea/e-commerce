import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJidXJjaWFnYWVkc29uQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NDI0NDkxMiwiZXhwIjoxNzQ0MjQ4NTEyfQ.pnqFkinLZpPmke4ct5DBUbinJSXHuAiQleRmSbcKHxM';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://192.168.1.72:8081/esb/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const commentsRes = await axios.get(`http://192.168.1.72:8081/esb/comments/product/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProduct(res.data.product);
        setComments(commentsRes.data.comments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      const body = {
        client_id: 3,
        product: [{ product_id: productId.toString(), quantity: "1" }]
      };

      await axios.post("http://192.168.1.72:8081/esb/orders/add", body, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert("Success", "Product added to cart!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to add product to cart.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#D19793" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <FontAwesome name="heart-o" size={20} color="black" style={styles.icon} />
            <Feather name="shopping-cart" size={20} color="black" />
          </View>
        </View>

        <Image
          source={{ uri: product.url || "https://via.placeholder.com/400x300.png?text=No+Image" }}
          style={styles.image}
        />

        <View style={styles.content}>
          <View style={styles.rowBetween}>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rating}>⭐ {comments.length > 0 ? comments[0].rating : 'No rating'} </Text>
            <Text style={styles.reviewCount}>({comments.length})</Text>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.allergen}>
            <Text style={{ fontStyle: 'italic' }}>Allergen: Gluten, egg, dairy</Text>
          </Text>

          <View style={styles.extraContainer}>
            <Feather name="edit-3" size={18} color="#888" />
            <Text style={styles.extraText}> Extra ingredient (optional)</Text>
          </View>

          {/* Comentarios */}
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Reviews:</Text>
          {comments.map((comment) => (
            <Text key={comment.id} style={{ color: '#444', marginBottom: 4 }}>
              ⭐ {comment.rating} - {comment.comment}
            </Text>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.priceWrapper}>
          <Text style={styles.totalLabel}>Total price</Text>
          <Text style={styles.totalPrice}>${product.price}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backArrow: {
    fontSize: 20,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  price: {
    fontSize: 20,
    color: '#D19793',
    fontWeight: '600',
  },
  rating: {
    fontSize: 14,
  },
  reviewCount: {
    color: '#999',
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginVertical: 12,
  },
  allergen: {
    fontSize: 12,
    color: '#777',
    marginBottom: 20,
  },
  extraContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  extraText: {
    marginLeft: 8,
    color: '#888',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  priceWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalPrice: {
    fontSize: 18,
    color: '#D19793',
    fontWeight: '600',
  },
  addToCartBtn: {
    backgroundColor: '#F6CEC8',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProductDetail;
