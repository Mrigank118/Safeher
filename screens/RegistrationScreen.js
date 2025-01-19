import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firebase from '../firebase';

const RegistrationScreen = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [medicalInfo, setMedicalInfo] = useState('');
  const [codeword, setCodeword] = useState('');

  const handleSubmit = async () => {
    if (!name || !age || !phone || !emergencyContact || !codeword) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    try {
      // Store the data in Firebase Firestore
      await firebase.firestore().collection('users').add({
        name,
        age,
        phone,
        emergencyContact,
        medicalInfo,
        codeword,
      });

      Alert.alert('Success', 'Registration complete!');
    } catch (error) {
      Alert.alert('Error', 'There was an issue saving your data.');
    }
  };

  return (
    <View style={styles.container}>
     

      {/* Registration Form */}
      <Text style={styles.title}>Registration</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#A0A0A0"
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        keyboardType="numeric"
        onChangeText={setAge}
        placeholderTextColor="#A0A0A0"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        keyboardType="phone-pad"
        onChangeText={setPhone}
        placeholderTextColor="#A0A0A0"
      />
      <TextInput
        style={styles.input}
        placeholder="Emergency Contact"
        value={emergencyContact}
        keyboardType="phone-pad"
        onChangeText={setEmergencyContact}
        placeholderTextColor="#A0A0A0"
      />
      <TextInput
        style={styles.input}
        placeholder="Medical Information (Optional)"
        value={medicalInfo}
        onChangeText={setMedicalInfo}
        placeholderTextColor="#A0A0A0"
      />
      <TextInput
        style={styles.input}
        placeholder="Codeword"
        value={codeword}
        onChangeText={setCodeword}
        placeholderTextColor="#A0A0A0"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBar: {
    width: '100%',
    backgroundColor: '#D1006E',
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleBarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '40%',
    height: 45,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    transition: 'all 0.3s ease',
  },
  inputFocused: {
    borderColor: '#D1006E',
    shadowOpacity: 0.2,
  },
  button: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#D1006E',
    borderRadius: 30,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    transition: 'background-color 0.3s ease',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegistrationScreen;
