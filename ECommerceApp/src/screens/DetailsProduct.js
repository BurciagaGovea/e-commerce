import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductDetails from '../components/ProductDetails';

const DetailsProduct = () => {
  const navigation = useNavigation(); // 🔹 Hook para navegar

  const productData = {
    id: 1,
    name: 'Chocolate Cake',
    rating: 4.9,
    reviewsCount: 102,
    basePrice: 22,
    imageUrl: 'https://example.com/chocolate-cake.jpg',
    description: 'Indulge in pure cocoa bliss...',
    allergens: 'Gluten, egg, dairy',
    sizes: [
      { label: '16 cm', extraCost: 0 },
      { label: '20 cm', extraCost: 3 },
      { label: '22 cm', extraCost: 5 },
      { label: '24 cm', extraCost: 7 },
    ],
  };

  // Estados locales
  const [selectedSize, setSelectedSize] = useState(productData.sizes.length > 0 ? productData.sizes[0] : null);
  const [customText, setCustomText] = useState('');

  // Función para agregar al carrito
  const handleAddToCart = (product, size, text) => {
    console.log('Producto:', product);
    console.log('Tamaño seleccionado:', size);
    console.log('Texto personalizado:', text);
    
    // 🚀 Simulación de agregar al carrito y redirección
    navigation.navigate('Cart');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
      <ProductDetails
        product={productData}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        customText={customText}
        setCustomText={setCustomText}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
};

export default DetailsProduct;
