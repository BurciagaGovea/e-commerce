import React from 'react';
import { View, Text, FlatList, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const categories = [
    { id: '1', title: 'Choose cookies', imageUrl: 'https://ejemplo.com/cookie.jpg' },
    { id: '2', title: 'Cheesecake', imageUrl: 'https://ejemplo.com/cheesecake.jpg' },
    { id: '3', title: 'CUPCAKES', imageUrl: 'https://ejemplo.com/cupcake.jpg' },
];

const bestSelling = [
    { 
        id: "1", 
        title: "Cupcakes", 
        price: 33, 
        imageUrl: "https://ejemplo.com/cupcake.jpg",
        description: "Delicious cupcakes with frosting.",
        rating: 4.8,
        reviewsCount: 89,
        basePrice: 33,
        allergens: "Gluten, dairy, eggs",
    },
    { 
        id: "2", 
        title: "Cheesecake", 
        price: 41, 
        imageUrl: "https://ejemplo.com/cheesecake.jpg",
        description: "Creamy and tasty cheesecake.",
        rating: 4.9,
        reviewsCount: 120,
        basePrice: 41,
        allergens: "Gluten, dairy, eggs",
    },
];

const Home = () => {
    const navigation = useNavigation();

    const handleProductPress = (product) => {
        navigation.navigate('DetailsProduct', { product });
    };

    // Función para ir a la pantalla de búsqueda
    const handleSearchPress = () => {
        navigation.navigate('SearchPage');
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>CUPCAKES ALL THE TIME</Text>
            </View>

            {/* Search Bar */}
            <TouchableOpacity style={styles.searchContainer} onPress={handleSearchPress}>
                <Text style={styles.searchText}>Search code cookies, anything...</Text>
            </TouchableOpacity>

            {/* Best Selling Section */}
            <Text style={styles.sectionTitle}>Our Best Selling</Text>
            <FlatList 
                data={bestSelling}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bestSellingContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.bestSellingCard}
                        onPress={() => handleProductPress(item)}
                    >
                        <Image 
                            source={{ uri: item.imageUrl }} 
                            style={styles.bestSellingImage} 
                        />
                        <Text style={styles.bestSellingTitle}>{item.title}</Text>
                        <Text style={styles.price}>M ${item.price}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
            />

            {/* Categories Section */}
            <Text style={styles.sectionTitle}>Explore Categories</Text>
            <FlatList 
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.categoryCard}>
                        <Image 
                            source={{ uri: item.imageUrl }} 
                            style={styles.categoryImage} 
                        />
                        <Text style={styles.categoryTitle}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
            />

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <Text style={styles.navTextActive}>Home</Text>
                <Text style={styles.navText}>Walike</Text>
                <Text style={styles.navText}>Profile</Text>
                <Text style={styles.navText}>Cart</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        backgroundColor: '#000',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    searchContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    searchText: {
        color: '#888',
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        marginLeft: 8,
    },
    bestSellingContainer: {
        paddingLeft: 8,
        paddingBottom: 24,
    },
    bestSellingCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginRight: 16,
        width: 160,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    bestSellingImage: {
        width: '100%',
        height: 140,
        borderRadius: 8,
        marginBottom: 8,
    },
    bestSellingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    categoriesContainer: {
        paddingLeft: 8,
        paddingBottom: 24,
    },
    categoryCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginRight: 16,
        width: 140,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ff4d4d',
        alignItems: 'center',
    },
    categoryImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 16,
    },
    navText: {
        fontSize: 16,
        color: '#888',
        fontWeight: '500',
    },
    navTextActive: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
});

export default Home;
