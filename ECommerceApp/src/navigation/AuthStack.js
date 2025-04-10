import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import TabNavigator from './TabNavigator'; // para Home (después del login)
import PendingOrders from '../screens/admin/Pending_orders';
import PastOrders from '../screens/admin/Past_orders';
import CanceledOrders from '../screens/admin/Canceled_orders';
import CreateProduct from '../screens/admin/Create_product';
import CreateCategory from '../screens/admin/Create_category';
import EditProduct from '../screens/admin/Edit_Product';



import Admin_Profile from '../screens/admin/Admin_profile';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Screen name="Admin_profile" component={Admin_Profile} />
      <Stack.Screen name="PendingOrders" component={PendingOrders} />
      <Stack.Screen name="PastOrders" component={PastOrders} />
      <Stack.Screen name="CanceledOrders" component={CanceledOrders} />
      <Stack.Screen name="Create_product" component={CreateProduct} />
      <Stack.Screen name="Create_category" component={CreateCategory} />
      <Stack.Screen name="EditProduct" component={EditProduct} />

    </Stack.Navigator>
  );
}
