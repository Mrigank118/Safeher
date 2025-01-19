import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
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
      <Text style={styles.title}>Registration</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        keyboardType="numeric"
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        keyboardType="phone-pad"
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Emergency Contact"
        value={emergencyContact}
        keyboardType="phone-pad"
        onChangeText={setEmergencyContact}
      />
      <TextInput
        style={styles.input}
        placeholder="Medical Information (Optional)"
        value={medicalInfo}
        onChangeText={setMedicalInfo}
      />
      <TextInput
        style={styles.input}
        placeholder="Codeword"
        value={codeword}
        onChangeText={setCodeword}
      />
      <Button title="Register" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default RegistrationScreen;
