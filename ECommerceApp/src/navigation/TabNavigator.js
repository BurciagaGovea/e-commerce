import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Home from "../screens/Home";
import ProductList from "../screens/ProductList";
import Cart from "../screens/Cart";
import Profile from "../screens/Profile";
import Charge from "../screens/Charge"; // Asegúrate de que este componente es válido

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    if (isLoading) {
        return <Charge />; // Pantalla de carga mientras se inicia la app
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    const icons = {
                        Home: "home-outline",
                        ProductList: "list-outline",
                        Cart: "cart-outline",
                        Profile: "person-outline",
                    };
                    return <Ionicons name={icons[route.name]} size={size} color={color} />;
                },
                tabBarStyle: { backgroundColor: "#fff", height: 60 },
                tabBarActiveTintColor: "#007AFF",
                tabBarInactiveTintColor: "gray",
                headerShown: false, // Oculta los encabezados en todas las pestañas
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="ProductList" component={ProductList} />
            <Tab.Screen name="Cart" component={Cart} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
