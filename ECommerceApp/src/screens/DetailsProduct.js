import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';

const cakeImage =
  'https://images.unsplash.com/photo-1611095973511-5bff60f7ff4b?auto=format&fit=crop&w=700&q=80';

const sizes = ['16 cm', '20 cm', '22 cm', '24 cm'];

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState('20 cm');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <FontAwesome name="heart-o" size={20} color="black" style={styles.icon} />
            <Feather name="shopping-cart" size={20} color="black" />
          </View>
        </View>

        {/* Cake Image */}
        <Image source={{ uri: "https://i.pinimg.com/736x/1c/a5/4a/1ca54a0b322ded0ba7fae8c45c764f4c.jpg" }} style={styles.image} />

        {/* Title + Price */}
        <View style={styles.content}>
          <View style={styles.rowBetween}>
            <Text style={styles.title}>Berry Wild Cake</Text>
            <Text style={styles.price}>$22</Text>
          </View>

          {/* Rating */}
          <View style={styles.row}>
            <Text style={styles.rating}>⭐ 4.9 </Text>
            <Text style={styles.reviewCount}>(102)</Text>
            <TouchableOpacity>
              <Text style={styles.reviewLink}>  See reviews</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            Indulge in pure cocoa bliss with our delectable Chocolate Cake! Moist layers of rich
            chocolate sponge with a delightful orange drizzle. Perfect for celebrating life's sweet
            moments or simply satisfying your chocolate cravings.
          </Text>

          <Text style={styles.allergen}>
            <Text style={{ fontStyle: 'italic' }}>Allergen: Gluten, egg, dairy</Text>
          </Text>

          {/* Sizes */}
          <View style={styles.sizeOptions}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.selectedSizeButton,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size && styles.selectedSizeText,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Extra ingredient */}
          <View style={styles.extraContainer}>
            <Feather name="edit-3" size={18} color="#888" />
            <Text style={styles.extraText}> Extra ingredient (optional)</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomBar}>
        <View style={styles.priceWrapper}>
          <Text style={styles.totalLabel}>Total price</Text>
          <Text style={styles.totalPrice}>$25</Text>
        </View>
        <TouchableOpacity style={styles.addToCartBtn}>
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
    paddingLeft:10,
    paddingRight:10
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
  reviewLink: {
    color: '#EB6F4E',
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
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
    borderRadius: 40,
  },
  sizeButton: {
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  selectedSizeButton: {
    backgroundColor: '#F6CEC8',
    borderColor: '#F6CEC8',
  },
  sizeText: {
    color: '#444',
  },
  selectedSizeText: {
    color: '#fff',
    fontWeight: '500',
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
