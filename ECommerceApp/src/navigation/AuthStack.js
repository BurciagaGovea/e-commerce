import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import TabNavigator from './TabNavigator'; // para Home (después del login)


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
    </Stack.Navigator>
  );
}
