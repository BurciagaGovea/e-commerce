import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { get_orders } from "../../postman_routes/constants";

export default function Admin_Profile() {
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    completed: 0,
    canceled: 0,
  });

  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem("TOKEN");
        if (!token) {
          console.error("No token found in AsyncStorage");
          return;
        }

        const res = await axios.get(get_orders, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const orders = res.data.orders || [];
        const counts = { pending: 0, completed: 0, canceled: 0 };
        orders.forEach((order) => {
          if (order.status === "pending") counts.pending++;
          else if (order.status === "completed") counts.completed++;
          else if (order.status === "canceled") counts.canceled++;
        });
        setOrderStats(counts);
      } catch (err) {
        console.error("Error fetching orders:", err.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: "#fff" }}
      contentContainerStyle={{ ...styles.container, flexGrow: 1 }}
    >
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Profile</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Icon name="home-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>


      {/* Cards */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("PendingOrders")}>
        <Text style={styles.cardTitle}>Pending Orders</Text>
        <Text style={styles.cardNumber}>{orderStats.pending}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("PastOrders")}>
        <Text style={styles.cardTitle}>Past Orders</Text>
        <Text style={styles.cardNumber}>{orderStats.completed}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("CanceledOrders")}>
        <Text style={styles.cardTitle}>Canceled Orders</Text>
        <Text style={styles.cardNumber}>{orderStats.canceled}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Create_product")}>
        <Text style={styles.actionText}>Add product...</Text>
        <Icon name="add-circle-outline" size={24} color="#F6CEC8" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Create_category")}>
        <Text style={styles.actionText}>Add category...</Text>
        <Icon name="add-circle-outline" size={24} color="#F6CEC8" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("EditProduct")}>
        <Text style={styles.actionText}>Modify product...</Text>
        <Icon name="create-outline" size={24} color="#F6CEC8" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#F1F4FF",
    borderColor: "#D9A9A9",
    borderWidth: 1,
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 80,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#222",
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  actionButton: {
    backgroundColor: "#F1F4FF",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
});
