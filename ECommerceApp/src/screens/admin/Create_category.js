import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import { get_categories, post_category } from "../../postman_routes/constants";

export default function Create_Category() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem("TOKEN");
        if (!token) return;

        const res = await axios.get(get_categories, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCategories(res.data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err.message);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = () => {
    const { name, description } = formData;

    if (!name || !description) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    Alert.alert("Confirmar creación", "¿Estás seguro de que deseas crear esta categoría?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, crear",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("TOKEN");
            if (!token) return;

            await axios.post(
              post_category,
              { name, description },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            Alert.alert("Éxito", "Categoría creada correctamente");
            navigation.navigate("Admin_profile");
          } catch (err) {
            console.error(err.response?.data || err.message);
            Alert.alert("Error", "No se pudo crear la categoría.");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff" }} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Admin_profile")}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Category</Text>
        <View style={{ width: 24 }} />
      </View>
  
      <Text style={styles.subtitle}>Existing Categories</Text>
  
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Text style={styles.categoryText}>{item.name}</Text>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginBottom: 20 }}
      />
  
      <Text style={styles.subtitle}>Fill all the fields</Text>
  
      <EditableField
        label="Name"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <EditableField
        label="Description"
        value={formData.description}
        onChangeText={(text) => handleChange("description", text)}
      />
  
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Category</Text>
      </TouchableOpacity>
    </ScrollView>
  );
  
}

function EditableField({ label, value, onChangeText, keyboardType = "default" }) {
  const isMultiline = label.toLowerCase() === "description";
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isMultiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={`${label}...`}
        multiline={isMultiline}
        numberOfLines={isMultiline ? 4 : 1}
        textAlignVertical={isMultiline ? "top" : "center"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
  },
  categoryItem: {
    backgroundColor: "#F1F4FF",
    padding: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  categoryText: {
    fontWeight: "500",
    color: "#555",
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderRadius: 17,
    padding: 12,
    backgroundColor: "#F1F4FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  multilineInput: {
    height: 100,
    paddingTop: 10,
  },
  button: {
    backgroundColor: "#F6CEC8",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 30,
    width: 250,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
