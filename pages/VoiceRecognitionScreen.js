import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // For making API requests

const VoiceRecognitionScreen = () => {
  const [location, setLocation] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [username, setUsername] = useState('');
  const [codeword, setCodeword] = useState('');

  // Fetch user data and request location permissions on mount
  useEffect(() => {
    console.log('useEffect: Initializing...');

    const initializeData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedCodeword = await AsyncStorage.getItem('codeword');
        console.log(`Fetched username: ${storedUsername}, codeword: ${storedCodeword}`);

        if (storedUsername) setUsername(storedUsername);
        if (storedCodeword) setCodeword(storedCodeword);
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };

    const requestLocationPermissions = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log(`Location permission status: ${status}`);

        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permissions are required for this app to function.');
          console.error('Location permission denied.');
          return;
        }

        fetchLocation();
      } catch (error) {
        console.error('Error requesting location permissions:', error);
      }
    };

    initializeData();
    requestLocationPermissions();
  }, []);

  // Function to fetch location
  const fetchLocation = async () => {
    try {
      let loc = await Location.getCurrentPositionAsync({});
      console.log(`Fetched location: ${loc.coords.latitude}, ${loc.coords.longitude}`);
      setLocation(loc.coords);
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Unable to fetch location. Please enable location services.');
    }
  };

  // Set up speech recognition
  useEffect(() => {
    console.log('useEffect: Initializing Speech Recognition...');
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'en-US';
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim().toLowerCase();
        console.log(`Speech Recognition Result: ${transcript}`);

        if (transcript.includes(codeword.toLowerCase())) {
          console.log(`${codeword} detected! Triggering emergency alert...`);
          sendEmergencyAlert();
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
        Alert.alert('Error', `Speech recognition error: ${event.error}`);
      };

      recognitionInstance.onend = () => {
        console.log('Speech Recognition ended.');
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
      console.log('Speech Recognition Initialized. Ready to start...');
    } else {
      alert('Speech Recognition is not supported in your browser.');
    }
  }, [codeword]);

  const toggleListening = () => {
    if (isListening) {
      console.log('Stopping Speech Recognition...');
      recognition.stop();
      setIsListening(false);
    } else {
      console.log('Starting Speech Recognition...');
      recognition.start();
      setIsListening(true);
    }
  };
  const sendEmergencyAlert = async () => {
    try {
      let currentLocation = location;
  
      // If location is not available, attempt to fetch it
      if (!currentLocation) {
        console.log('Location not available. Retrying...');
        const fetchedLocation = await Location.getCurrentPositionAsync({});
        console.log(`Fetched location after retry: ${fetchedLocation.coords.latitude}, ${fetchedLocation.coords.longitude}`);
        currentLocation = fetchedLocation.coords;
      }
  
      // If still no location, exit with an error
      if (!currentLocation) {
        console.error('Location still unavailable after retry.');
        Alert.alert('Error', 'Location data is unavailable. Please enable location services and try again.');
        return;
      }
  
      const emergencyMessage = `EMERGENCY ALERT: ${username} is in danger. Location: https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
  
      const TWILIO_ACCOUNT_SID = 'AC184abd08ee8734eda4e49b26ead7c704';
      const TWILIO_AUTH_TOKEN = '85f18fcadd57d57917ca8189adec7111';
      const TWILIO_PHONE_NUMBER = '+14066417660';
      const RECEIVER_PHONE_NUMBER = '+916392617261';
  
      // Send SMS
      const messageUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
      const messageData = new URLSearchParams();
      messageData.append('To', RECEIVER_PHONE_NUMBER);
      messageData.append('From', TWILIO_PHONE_NUMBER);
      messageData.append('Body', emergencyMessage);
  
      await axios.post(messageUrl, messageData, {
        auth: {
          username: TWILIO_ACCOUNT_SID,
          password: TWILIO_AUTH_TOKEN,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      console.log('SMS sent successfully.');
  
      // Make a call
      const callUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`;
  
      const callData = new URLSearchParams();
      callData.append('To', RECEIVER_PHONE_NUMBER);
      callData.append('From', TWILIO_PHONE_NUMBER);
      callData.append('Twiml', `<Response><Say>${emergencyMessage}</Say></Response>`);
  
      const callResponse = await axios.post(callUrl, callData, {
        auth: {
          username: TWILIO_ACCOUNT_SID,
          password: TWILIO_AUTH_TOKEN,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      console.log('Call placed successfully:', callResponse.data);
      Alert.alert('Alert Sent', 'Emergency alert sent successfully!');
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      Alert.alert('Error', 'Failed to send emergency alert.');
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SafeHer</Text>
      <Text style={styles.username}>Welcome, {username}</Text>
      <Text style={styles.codeword}>Codeword: {codeword}</Text>

      <TouchableOpacity
        style={[styles.sosButton, isListening ? styles.listening : null]}
        onPress={toggleListening}
      >
        <Text style={styles.sosButtonText}>
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sosButton} onPress={sendEmergencyAlert}>
        <Text style={styles.sosButtonText}>SOS</Text>
      </TouchableOpacity>

      <Text style={styles.location}>
        {location ? `Current Location: ${location.latitude}, ${location.longitude}` : 'Fetching location...'}
      </Text>

      <Text style={styles.listeningStatus}>
        {isListening ? 'Listening for codeword...' : 'Not listening.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  codeword: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  },
  sosButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  sosButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  listening: {
    backgroundColor: '#4caf50', // Green when listening
  },
  location: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
  listeningStatus: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  },
});

export default VoiceRecognitionScreen;
