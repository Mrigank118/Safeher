import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; // Firebase Authentication
import { db } from '../firebase'; // Firestore
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import { useNavigation } from '@react-navigation/native'; // Navigation

const RegistrationScreen = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [medicalInfo, setMedicalInfo] = useState('');
  const [codeword, setCodeword] = useState('');
  const [email, setEmail] = useState(''); // Add state for email
  const [password, setPassword] = useState(''); // Add state for password

  const navigation = useNavigation(); // Initialize navigation

  const handleSubmit = async () => {
    if (!name || !age || !phone || !emergencyContact || !codeword || !email || !password) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    const auth = getAuth(); // Initialize Firebase Authentication

    try {
      // Create user using Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);

      // Save additional data to Firestore
      await addDoc(collection(db, "users"), {
        name,
        age,
        phone,
        emergencyContact,
        medicalInfo,
        codeword,
        email, // Store email in Firestore as well
        timestamp: new Date(),
      });

      // Navigate to the VoiceRecognitionScreen after successful registration
      navigation.replace('VoiceRecognition'); // Use `replace` to navigate to VoiceRecognitionScreen and remove this screen from the stack
    } catch (error) {
      console.error("Firebase Error: ", error);
      Alert.alert('Error', 'There was an issue registering your account.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Age" value={age} keyboardType="numeric" onChangeText={setAge} />
      <TextInput style={styles.input} placeholder="Phone Number" value={phone} keyboardType="phone-pad" onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Emergency Contact" value={emergencyContact} keyboardType="phone-pad" onChangeText={setEmergencyContact} />
      <TextInput style={styles.input} placeholder="Medical Information (Optional)" value={medicalInfo} onChangeText={setMedicalInfo} />
      <TextInput style={styles.input} placeholder="Codeword" value={codeword} onChangeText={setCodeword} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9fafb', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 30, fontWeight: 'bold', color: '#4B5563', marginBottom: 20, textAlign: 'center' },
  input: { width: '80%', height: 45, borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 12, marginBottom: 15, paddingLeft: 15, fontSize: 16, backgroundColor: '#ffffff' },
  button: { width: '80%', backgroundColor: '#D1006E', borderRadius: 30, paddingVertical: 15, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default RegistrationScreen;
