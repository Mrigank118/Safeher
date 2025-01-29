import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Terms = ({ navigation }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Terms Image */}
      <Image source={require('./assets/terms.png')} style={styles.image} />

      <Text style={styles.title}>Terms & Conditions</Text>
      <Text style={styles.text}>
        By using this app, you agree to our Terms & Conditions. Please read them carefully.
      </Text>
      
      <Text style={styles.text}>
        1. You must be at least 18 years old to use this service. {'\n'}
        2. We do not share your personal data with third parties. {'\n'}
        3. Any violation of our terms may result in account suspension. {'\n'}
        4. The app requires access to your camera for security features. {'\n'}
        5. Location data is used to enhance your safety and will not be shared. {'\n'}
        6. Contact information access allows emergency alerts to be sent quickly. {'\n'}
      </Text>

      {/* Agree Checkbox */}
      <TouchableOpacity 
        style={styles.checkboxContainer} 
        onPress={() => setAgreed(!agreed)}
      >
        <View style={[styles.checkbox, agreed && styles.checked]} />
        <Text style={styles.checkboxText}>I agree to the Terms & Conditions</Text>
      </TouchableOpacity>

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.button, !agreed && styles.disabledButton]}
        disabled={!agreed}
        onPress={() => navigation.navigate('Registration')}  // ✅ Updated navigation target
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Pure white background
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200, // Adjust height as needed
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 5,
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#000',
  },
  checkboxText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Terms;
