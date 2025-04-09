import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import DetailsProduct from "../screens/DetailsProduct";
import SearchPage from "../screens/SearchPage";
import WelcomeScreen from "../screens/WelcomeScreen";   
import LoginScreen from "../screens/Login";
import OrdersScreen from "../screens/OrdersScreen";
import RegisterScreen from "../screens/Register";
import HomeScreen from "../screens/Home";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            {/* TabNavigator con las pestañas principales */}
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="Home" component={HomeScreen} />
            
            {/* Otras pantallas que se abren con botones */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
            <Stack.Screen name="DetailsProduct" component={DetailsProduct} />
            <Stack.Screen name="SearchPage" component={SearchPage} />
        </Stack.Navigator>
    );
};

export default StackNavigator;
