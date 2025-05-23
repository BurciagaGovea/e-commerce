// src/navigation/TabNavigator.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

// Pantallas reales
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Cart from "../screens/Cart";
import Charge from "../screens/Charge";
import SearchPage from "../screens/SearchPage";
import OrdersScreen from "../screens/OrdersScreen";
import ProductDetail from "../screens/DetailsProduct";

// Stack para el tab "Home"
const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={Home} />
    <HomeStack.Screen name="Search" component={SearchPage} />
  </HomeStack.Navigator>
);

// Stack para el tab "Profile"
const ProfileStack = createNativeStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileTab" component={Profile} />
    <ProfileStack.Screen name="Orders" component={OrdersScreen} />
  </ProfileStack.Navigator>
);

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <Charge />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color, focused }) => {
          let iconName;

          if (route.name === "HomeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Cart") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarStyle: {
          height: 80,
          backgroundColor: "#fff",
          borderTopWidth: 0.5,
          position: "absolute", 
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarActiveTintColor: "#D19793",
        tabBarInactiveTintColor: "#000",
        headerShown: false,
      })}
    >

      <Tab.Screen name="HomeTab" component={HomeStackScreen} />
      <Tab.Screen name="Search" component={SearchPage} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>

  
  );
};

export default TabNavigator;