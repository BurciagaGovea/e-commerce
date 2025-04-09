import React from 'react';
import { View, Text, TextInput, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const bestSelling = [
  { id: '1', name: 'Choco cookies', price: '$33', imageUrl: 'https://i.pinimg.com/736x/74/06/cb/7406cb16ba13fe964ab6406703365328.jpg' },
  { id: '2', name: 'Cheesecake', price: '$41', imageUrl: 'https://i.pinimg.com/736x/46/0e/41/460e41dd5bb30432854f1881fa54d74a.jpg' },
];

const categories = [
  { id: '1', name: 'ROLL', image: 'https://i.pinimg.com/736x/f6/8c/16/f68c16a0d4ab255746454ee01b0b096d.jpg' },
  { id: '2', name: 'COOKIES', image: 'https://i.pinimg.com/736x/a3/66/dc/a366dc857b7b7335b8ef269fc549d229.jpg' },
];

const Home = () => {
  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', paddingTop: 30 }}>Hi there!</Text>
      <Text style={{ color: '#666', marginVertical: 6 }}>What are you looking for today?</Text>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        paddingHorizontal: 10,
        borderRadius: 10,
        marginVertical: 10
      }}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search cake, cookies, anything..."
          style={{ marginLeft: 10, flex: 1 }}
        />
      </View>

      <Image
        source={{ uri: 'https://i.pinimg.com/736x/40/50/ab/4050ab9eb9c75e7cd9ba675e40b98a48.jpg' }}
        style={{ width: '100%', height: 150, borderRadius: 10, marginVertical: 10 }}
        resizeMode="cover"
      />

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Our Best Selling</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={bestSelling}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ width: 140, marginRight: 15, marginTop: 10 }}>
            <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: 100, borderRadius: 10 }} />
            <Text style={{ marginTop: 8, fontWeight: '500' }}>{item.name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#D19793' }}>{item.price}</Text>
              <TouchableOpacity>
                <Ionicons name="add-circle-outline" size={24} color="#D19793" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 30 }}>Explore Categories</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        {categories.map(cat => (
          <TouchableOpacity key={cat.id} style={{ width: '48%' }}>
            <Image source={cat.image} style={{ width: '100%', height: 120, borderRadius: 10 }} />
            <Text style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              color: '#F9F9F9',
              fontWeight: 'bold',
              fontSize: 16,
              textShadowColor: 'rgba(0,0,0,0.5)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 5
            }}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default Home;
