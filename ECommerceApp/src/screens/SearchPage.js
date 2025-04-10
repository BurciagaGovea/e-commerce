// SearchPage.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, Image, TouchableOpacity,
  StyleSheet, Alert, Modal, Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import { Picker } from '@react-native-picker/picker';
import { get_products, get_categories } from '../postman_routes/constants';

export default function SearchPage({ navigation }) {
  const [allProducts, setAllProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [token, setToken] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [clientId, setClientId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchEverything = async () => {
        try {
          const storedToken = await AsyncStorage.getItem("TOKEN");
          if (!storedToken) return Alert.alert("Error", "Token no encontrado");

          setToken(storedToken);
          const decoded = jwtDecode(storedToken);
          const userId = decoded.id;

          const [productsRes, categoriesRes, clientsRes] = await Promise.all([
            axios.get(get_products, { headers: { Authorization: `Bearer ${storedToken}` } }),
            axios.get(get_categories, { headers: { Authorization: `Bearer ${storedToken}` } }),
            axios.get('https://eesb-production.up.railway.app/esb/clients', { headers: { Authorization: `Bearer ${storedToken}` } })
          ]);

          const client = clientsRes.data.find(c => c.userId === userId);
          if (!client) return Alert.alert("Error", "Cliente no encontrado para este usuario");

          const productsWithImage = productsRes.data.products.filter(p => p.url);

          setClientId(client.id);
          setAllProducts(productsWithImage);
          setVisibleProducts(getRandom8(productsWithImage));
          setAllCategories(categoriesRes.data.categories);
          setQuery('');
          setSuggestions([]);
        } catch (err) {
          console.error("Error cargando:", err.message);
          Alert.alert("Error", "No se pudo cargar la información");
        }
      };

      fetchEverything();
    }, [])
  );

  const getRandom8 = (array) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const matchedCategory = allCategories.find(c => c.name.toLowerCase() === query.toLowerCase());
      if (matchedCategory) {
        const res = await axios.get(`https://eesb-production.up.railway.app/esb/products/category/${matchedCategory.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVisibleProducts(res.data.products.filter(p => p.url));
      } else {
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
        setVisibleProducts(filtered);
      }
    } catch (err) {
      console.error("Error buscando:", err.message);
      Alert.alert("Error", "No se pudo completar la búsqueda.");
    }
  };

  const handleInputChange = (text) => {
    setQuery(text);
    if (!text.trim()) return setSuggestions([]);
    const possibleMatches = [
      ...allProducts.filter(p => p.name.toLowerCase().includes(text.toLowerCase())).map(p => p.name),
      ...allCategories.filter(c => c.name.toLowerCase().includes(text.toLowerCase())).map(c => c.name),
    ];
    setSuggestions([...new Set(possibleMatches)].slice(0, 5));
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setModalVisible(true);
  };

  const addToCart = async () => {
    try {
      await axios.post('https://eesb-production.up.railway.app/esb/orders/add', {
        client_id: clientId,
        product: [{ product_id: selectedProduct.id.toString(), quantity: quantity.toString() }]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert("Éxito", "Producto agregado al carrito");
      setModalVisible(false);
    } catch (err) {
      console.error("Error al agregar al carrito:", err.message);
      Alert.alert("Error", "No se pudo agregar al carrito");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Icon name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Search your Flavour</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}><Icon name="home-outline" size={24} /></TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Icon name="search-outline" size={20} color="#999" style={{ marginLeft: 10 }} />
        <TextInput
          placeholder="Search Cookies or Category"
          style={styles.input}
          value={query}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <View style={styles.filterButton}><Icon name="options-outline" size={20} color="#fff" /></View>
        </TouchableOpacity>
      </View>

      {suggestions.length > 0 && (
        <View style={styles.suggestionsBox}>
          {suggestions.map((item, index) => (
            <Text key={index} style={styles.suggestionItem} onPress={() => { setQuery(item); setSuggestions([]); }}>{item}</Text>
          ))}
        </View>
      )}

      <Text style={styles.resultsText}><Text style={{ fontWeight: 'bold' }}>Found</Text> {visibleProducts.length} Results</Text>

      <FlatList
        data={visibleProducts}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const categoryName = allCategories.find(c => c.id === item.category_id)?.name || `Category ${item.category_id}`;
          return (
            <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
              <View style={styles.priceTag}><Text style={styles.priceText}>${item.price}</Text></View>
              <Image source={{ uri: item.url }} style={styles.image} resizeMode="contain" />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.subtext}>{categoryName}</Text>
              <View style={styles.bottomRow}><Icon name="heart-outline" size={18} /><Text style={styles.rating}>★</Text></View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                <Image source={{ uri: selectedProduct.url }} style={{ width: 200, height: 200, alignSelf: 'center', borderRadius: 10 }} />
                <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 10 }}>{selectedProduct.name}</Text>
                <Text style={{ fontSize: 16, color: '#888', marginVertical: 10 }}>${selectedProduct.price}</Text>

                <Text style={{ marginBottom: 5 }}>Quantity</Text>
                <Picker
                  selectedValue={quantity}
                  style={{ height: 50, width: 150, alignSelf: 'center' }}
                  onValueChange={(itemValue) => setQuantity(itemValue)}
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <Picker.Item key={num} label={num.toString()} value={num} />
                  ))}
                </Picker>

                <TouchableOpacity onPress={addToCart} style={styles.addButton}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add to cart</Text>
                </TouchableOpacity>
                <Pressable onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}><Text style={{ color: '#999' }}>Cancel</Text></Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#F9F9F9', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '600' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 8, marginBottom: 10 },
  input: { flex: 1, paddingHorizontal: 10 },
  filterButton: { backgroundColor: '#D19793', padding: 8, borderRadius: 20, marginRight: 10 },
  resultsText: { fontSize: 16, marginBottom: 10 },
  row: { justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 20, padding: 10, marginBottom: 15, elevation: 2 },
  priceTag: { position: 'absolute', top: 0, right: 0, backgroundColor: '#FFE8E3', paddingHorizontal: 15, paddingVertical: 5, borderTopRightRadius: 15, borderBottomLeftRadius: 10 },
  priceText: { fontSize: 12, color: '#000' },
  image: { height: 100, width: 100, alignSelf: 'center', borderRadius: 10, marginVertical: 10 },
  name: { textAlign: 'center', fontWeight: '600', color: '#D19793' },
  subtext: { textAlign: 'center', color: '#999', fontSize: 12 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  rating: { fontWeight: '500' },
  suggestionsBox: { backgroundColor: '#FFF', borderRadius: 10, padding: 10, marginBottom: 10 },
  suggestionItem: { paddingVertical: 4, fontSize: 14, color: '#444' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 20, width: '85%', alignItems: 'center' },
  addButton: { backgroundColor: '#D19793', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 20, marginTop: 15 },
});
