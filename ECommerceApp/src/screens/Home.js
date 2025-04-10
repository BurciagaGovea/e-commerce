import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get_categories, get_products } from '../postman_routes/constants';

const Home = ({ navigation }) => {
  const [bestSelling, setBestSelling] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('TOKEN');
        if (!token) {
          console.error('No token found');
          return;
        }

        const productRes = await axios.get(get_products, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const categoryRes = await axios.get(get_categories, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const shuffled = productRes.data.products.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);

        setBestSelling(selected);
        setCategories(categoryRes.data.categories);
      } catch (error) {
        console.error('Error loading Home data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#D19793" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff', marginTop: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginTop: 15 }}>Hi there!</Text>
      <Text style={{ color: '#666', marginVertical: 6 }}>What are you looking for today?</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Search')} activeOpacity={0.9}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#f3f3f3',
          paddingHorizontal: 10,
          borderRadius: 40,
          marginVertical: 10
        }}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput placeholder="Search cake, cookies, anything..." style={{ marginLeft: 10, flex: 1, padding: 10 }} />
        </View>
      </TouchableOpacity>

      <Image
        source={{ uri: 'https://i.pinimg.com/736x/40/50/ab/4050ab9eb9c75e7cd9ba675e40b98a48.jpg' }}
        style={{ width: '100%', height: 150, borderRadius: 10, marginVertical: 10 }}
        resizeMode="cover"
      />

      <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 20 }}>Our Best Selling</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={bestSelling}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ width: 140, marginRight: 15, marginTop: 10 }}>
            <Image
              source={{ uri: item.url || 'https://via.placeholder.com/150' }}
              style={{ width: '100%', height: 100, borderRadius: 10 }}
            />
            <Text style={{ marginTop: 8, fontWeight: '500' }}>{item.name}</Text>
            <Text style={{ color: '#D19793' }}>${item.price}</Text>
          </View>
        )}
      />

      <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 30 }}>Explore Categories</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 }}>
        {categories.map(cat => (
          <View key={cat.id} style={{
            width: '48%',
            backgroundColor: '#f3f3f3',
            borderRadius: 10,
            padding: 15,
            marginBottom: 10
          }}>
            <Text style={{ fontWeight: '600', fontSize: 16 }}>{cat.name}</Text>
            <Text style={{ color: '#555', marginTop: 5 }}>{cat.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Home;
