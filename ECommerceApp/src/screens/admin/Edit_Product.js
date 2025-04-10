import React, { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Ionicons";
import { get_products } from "../../postman_routes/constants";

export default function EditProduct() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
    description: "",
    category: "",
  });

  const navigation = useNavigation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await AsyncStorage.getItem('TOKEN');
        if (!token) return;

        const res = await axios.get(get_products, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching products:", err.message);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const product = products.find((p) => p.id === Number(selectedId));
    if (product) {
      setFormData({
        name: product.name,
        image: product.url,
        price: product.price,
        description: product.description,
        category: product.category_id.toString(),
      });
    }
  }, [selectedId]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedId) return;

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      url: formData.image,
      status: true,
      category_id: parseInt(formData.category),
    };

    try {
      const token = await AsyncStorage.getItem('TOKEN');
      if (!token) return;

      await axios.put(`${get_products}/${selectedId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Alert.alert("Éxito", "Producto actualizado correctamente");
    } catch (err) {
      console.error("Error actualizando:", err.message);
      Alert.alert("Error", "No se pudo actualizar el producto");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Admin_profile")}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Product</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.subtitle}>Selecciona un producto para editar</Text>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedId}
          onValueChange={(itemValue) => setSelectedId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona un producto" value={null} />
          {products.map((p) => (
            <Picker.Item key={p.id} label={p.name} value={p.id} />
          ))}
        </Picker>
      </View>

      {selectedId && (
        <>
          {formData.image && (
            <Image
              source={{ uri: formData.image }}
              style={styles.image}
              resizeMode="contain"
            />
          )}

          <EditableField label="Name" value={formData.name} onChangeText={(text) => handleChange("name", text)} />
          <EditableField label="Price" value={formData.price} keyboardType="numeric" onChangeText={(text) => handleChange("price", text)} />
          <EditableField label="Description" value={formData.description} onChangeText={(text) => handleChange("description", text)} />
          <EditableField label="Category ID" value={formData.category} keyboardType="numeric" onChangeText={(text) => handleChange("category", text)} />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Apply Changes</Text>
          </TouchableOpacity>
        </>
      )}
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
  container: { padding: 20, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12, marginTop: 40 },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  subtitle: { fontSize: 16, fontWeight: "500", textAlign: "center", marginBottom: 20 },
  pickerWrapper: { backgroundColor: "#F1F4FF", borderRadius: 18, marginBottom: 20, overflow: "hidden" },
  picker: { height: 50 },
  image: { resizeMode: "cover", width: "100%", height: 200, borderRadius: 15, marginBottom: 20 },
  fieldContainer: { marginBottom: 15 },
  label: { fontSize: 14, color: "#555", marginBottom: 5 },
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
  multilineInput: { height: 100, paddingTop: 10 },
  button: { backgroundColor: "#F6CEC8", paddingVertical: 15, borderRadius: 25, alignItems: "center", marginTop: 30 },
  buttonText: { fontSize: 16, fontWeight: "bold", color: "#ffffff" },
});
