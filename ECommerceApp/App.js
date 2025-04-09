import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./src/navigation/TabNavigator";
import HomeScreen from "./src/screens/Home";
import Charge from "./src/screens/Charge";
import LoginScreen from "./src/screens/Login";
import Wishlist from "./src/screens/WishList";
import CartScreen from "./src/screens/Cart";
import Search from "./src/screens/SearchPage";
import ProductDetail from "./src/screens/DetailsProduct";
import OrdersScreen from "./src/screens/OrdersScreen";
import Profile from "./src/screens/Profile";
import ProfileScreen from "./src/screens/Profile";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import StackNavigator from "./src/navigation/StackNavigator";


export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator/>
      {/* <TabNavigator/> */}
      {/* <Charge /> */}
      {/* <LoginScreen/> */}
      {/* <Wishlist/> */}
      {/* <SignUpScreen/> */}
      {/* <CartScreen/> */}
      {/* <Search/> */}
      {/* <ProductDetail/> */}
      {/* <OrdersScreen/> */}
      {/* <ProfileScreen/> */}
      {/* <WelcomeScreen/> */}
    </NavigationContainer>
  );
};

