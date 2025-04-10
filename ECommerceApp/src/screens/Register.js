import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    birthDate: '',
    postCode: '',
    street: '',
    number: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const isFormComplete = () => {
    return Object.values(form).every((value) => value.trim() !== '');
  };

  const handleRegister = async () => {
    const payload = {
      user: {
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        phone: form.phone,
      },
      client: {
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        birthDate: form.birthDate,
        postCode: form.postCode,
        street: form.street,
        number: form.number,
      },
    };

    try {
      await axios.post(
        'https://eesb-production.up.railway.app/esb/users/create',
        payload
      );

      Alert.alert("Registro exitoso", "Tu cuenta ha sido creada correctamente.", [
        {
          text: "OK",
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo registrar el usuario.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleChange('birthDate', formattedDate);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Create an account so you can explore and purchase your favorite products.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput placeholder="Email" value={form.email} onChangeText={(v) => handleChange('email', v)} style={styles.input} />
            <TextInput placeholder="Password" value={form.password} onChangeText={(v) => handleChange('password', v)} secureTextEntry style={styles.input} />
            <TextInput placeholder="First Name" value={form.firstName} onChangeText={(v) => handleChange('firstName', v)} style={styles.input} />
            <TextInput placeholder="Middle Name" value={form.middleName} onChangeText={(v) => handleChange('middleName', v)} style={styles.input} />
            <TextInput placeholder="Last Name" value={form.lastName} onChangeText={(v) => handleChange('lastName', v)} style={styles.input} />
            <TextInput placeholder="Phone" value={form.phone} onChangeText={(v) => handleChange('phone', v)} keyboardType="phone-pad" style={styles.input} />

            {/* Birth Date Picker */}
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text style={{ color: form.birthDate ? '#000' : '#999' }}>
                {form.birthDate || 'Select Birth Date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={form.birthDate ? new Date(form.birthDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            <TextInput placeholder="Postal Code" value={form.postCode} onChangeText={(v) => handleChange('postCode', v)} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Street" value={form.street} onChangeText={(v) => handleChange('street', v)} style={styles.input} />
            <TextInput placeholder="Number" value={form.number} onChangeText={(v) => handleChange('number', v)} keyboardType="numeric" style={styles.input} />
          </View>

          <TouchableOpacity
            style={[styles.signUpButton, !isFormComplete() && styles.disabledButton]}
            onPress={handleRegister}
            disabled={!isFormComplete()}
          >
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.haveAccount}>Already have an account</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#FFF',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#C37A74',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F7F7F7',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  signUpButton: {
    backgroundColor: '#F7CFCB',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#D6D6FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowColor: 'transparent',
  },
  signUpText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  haveAccount: {
    marginTop: 24,
    textAlign: 'center',
    color: '#111',
    fontSize: 14,
  },
});

export default RegisterScreen;
