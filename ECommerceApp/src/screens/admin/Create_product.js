import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
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
import Icon from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { TOKEN, create_product, get_categories } from "../../postman_routes/constants";

export default function Create_Product() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);

  const navigation = useNavigation();

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const file = result.assets[0];

      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.mimeType)) {
        Alert.alert("Tipo inválido", "Solo se permiten imágenes JPEG o PNG");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: {
          uri: file.uri,
          type: file.mimeType,
          name: file.fileName || "product.jpg",
        },
      }));
    }
  };

  useEffect(() => {
    axios
      .get(get_categories, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      })
      .then((res) => setCategories(res.data.categories))
      .catch((err) => {
        console.error("Error fetching categories:", err.message);
      });
  }, []);

  const handleSubmit = () => {
    const { name, price, description, category, image } = formData;
  
    if (!name || !price || !description || !category || !image) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
  
    Alert.alert(
      "Confirmar creación",
      "¿Estás seguro de que deseas crear este producto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, crear",
          style: "destructive",
          onPress: async () => {
            const data = new FormData();
            data.append("name", name);
            data.append("description", description);
            data.append("price", price);
            data.append("category_id", category);
            data.append("image", {
              uri: image.uri,
              type: image.type,
              name: image.name,
            });
  
            try {
              await axios.post(create_product, data, {
                headers: {
                  Authorization: `Bearer ${TOKEN}`,
                  "Content-Type": "multipart/form-data",
                },
              });
              Alert.alert("Éxito", "Producto creado correctamente");
              navigation.navigate("Admin_menu");
            } catch (err) {
              console.error(err.response?.data || err.message);
              Alert.alert("Error", "No se pudo crear el producto.");
            }
          },
        },
      ]
    );
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Admin_menu")}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Product</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.subtitle}>Fill all the characteristics</Text>

      {formData.image && (
        <Image
          source={{ uri: formData.image.uri }}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>
          {formData.image ? "Change Image" : "Select Image"}
        </Text>
      </TouchableOpacity>

      <EditableField
        label="Name"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <EditableField
        label="Price"
        value={formData.price}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("price", text)}
      />
      <EditableField
        label="Description"
        value={formData.description}
        onChangeText={(text) => handleChange("description", text)}
      />

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.category}
          onValueChange={(value) => handleChange("category", value)}
          style={styles.picker}
        >
          <Picker.Item label="Select a category" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id.toString()} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Product</Text>
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
  image: {
    resizeMode:'cover',
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#F1F4FF",
    padding: 12,
    borderRadius: 17,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadButtonText: {
    fontWeight: "500",
    color: "#444",
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
  pickerWrapper: {
    backgroundColor: "#F1F4FF",
    borderRadius: 18,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: "#F6CEC8",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 30,
    width:250,
    alignSelf:'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
