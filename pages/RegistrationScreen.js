import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase'; // Ensure you have a correct firebase setup
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const RegistrationScreen = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [medicalInfo, setMedicalInfo] = useState('');
  const [codeword, setCodeword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!name || !age || !phone || !emergencyContact || !codeword || !email || !password) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    const auth = getAuth();

    try {
      console.log('Registering user...');
      await createUserWithEmailAndPassword(auth, email, password);

      console.log('Saving data to Firestore...');
      await addDoc(collection(db, 'users'), {
        name,
        age,
        phone,
        emergencyContact,
        medicalInfo,
        codeword,
        email,
        timestamp: new Date(),
      });

      console.log('Navigating to VoiceRecognition...');
      navigation.replace('VoiceRecognition');
    } catch (error) {
      console.error('Registration Error: ', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
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
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '80%', height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 15, paddingHorizontal: 10 },
  button: { backgroundColor: '#D1006E', padding: 15, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default RegistrationScreen;
