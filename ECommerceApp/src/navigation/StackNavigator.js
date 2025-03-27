import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import DetailsProduct from "../screens/DetailsProduct";
import SearchPage from "../screens/SearchPage";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* TabNavigator con las pestañas principales */}
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            
            {/* Otras pantallas que se abren con botones */}
            <Stack.Screen name="DetailsProduct" component={DetailsProduct} />
            <Stack.Screen name="SearchPage" component={SearchPage} />
        </Stack.Navigator>
    );
};

export default StackNavigator;
