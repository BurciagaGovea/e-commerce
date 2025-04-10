import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { get_products, get_categories } from '../postman_routes/constants';

export default function SearchPage({ navigation }) {
  const [allProducts, setAllProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [token, setToken] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchProducts = async () => {
        try {
          const storedToken = await AsyncStorage.getItem("TOKEN");
          if (!storedToken) {
            Alert.alert("Error", "Token no encontrado");
            return;
          }
          setToken(storedToken);

          const [productsRes, categoriesRes] = await Promise.all([
            axios.get(get_products, { headers: { Authorization: `Bearer ${storedToken}` } }),
            axios.get(get_categories, { headers: { Authorization: `Bearer ${storedToken}` } }),
          ]);

          const productsWithImage = productsRes.data.products.filter(p => p.url);
          setAllProducts(productsWithImage);
          setVisibleProducts(getRandom8(productsWithImage));
          setAllCategories(categoriesRes.data.categories);
          setQuery('');
          setSuggestions([]);
        } catch (err) {
          console.error("Error loading products:", err.message);
          Alert.alert("Error", "No se pudieron cargar los productos.");
        }
      };

      fetchProducts();
    }, [])
  );

  const getRandom8 = (array) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      if (!token) return;

      const matchedCategory = allCategories.find(c => c.name.toLowerCase() === query.toLowerCase());
      if (matchedCategory) {
        const res = await axios.get(`https://eesb-production.up.railway.app/esb/products/category/${matchedCategory.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = res.data.products.filter(p => p.url);
        setVisibleProducts(filtered);
      } else {
        const filtered = allProducts.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );
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
            <Text
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                setQuery(item);
                setSuggestions([]);
              }}
            >{item}</Text>
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
            <View style={styles.card}>
              <View style={styles.priceTag}><Text style={styles.priceText}>${item.price}</Text></View>
              <Image source={{ uri: item.url }} style={styles.image} resizeMode="contain" />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.subtext}>{categoryName}</Text>
              <View style={styles.bottomRow}>
                <Icon name="heart-outline" size={18} />
                <Text style={styles.rating}>★</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#F9F9F9', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 15 },
  headerTitle: { fontSize: 24, fontWeight: '600' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 8, marginBottom: 10 },
  input: { flex: 1, paddingHorizontal: 10 },
  filterButton: { backgroundColor: '#D19793', padding: 8, borderRadius: 20, marginRight: 10 },
  resultsText: { fontSize: 16, marginBottom: 10 },
  row: { justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 20, padding: 10, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  priceTag: { position: 'absolute', top: 0, right: 0, backgroundColor: '#FFE8E3', paddingHorizontal: 15, paddingVertical: 5, borderTopRightRadius: 15, borderBottomLeftRadius: 10 },
  priceText: { fontSize: 12, color: '#000' },
  image: { height: 100, width: 100, alignSelf: 'center', borderRadius: 10, marginVertical: 10 },
  name: { textAlign: 'center', fontWeight: '600', color: '#D19793' },
  subtext: { textAlign: 'center', color: '#999', fontSize: 12 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  rating: { fontWeight: '500' },
  suggestionsBox: { backgroundColor: '#FFF', borderRadius: 10, padding: 10, marginBottom: 10 },
  suggestionItem: { paddingVertical: 4, fontSize: 14, color: '#444' },
});