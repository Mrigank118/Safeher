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

  useEffect(() => {
    console.log('useEffect: Fetching username and codeword from AsyncStorage...');
    const getData = async () => {
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

    getData();

    console.log('useEffect: Requesting location permissions...');
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(`Location permission status: ${status}`);

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permissions are required for this app to function.');
        console.error('Location permission denied.');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      console.log(`Fetched location: ${loc.coords.latitude}, ${loc.coords.longitude}`);
      setLocation(loc.coords);
    })();
  }, []);

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

  const sendEmergencyAlert = async () => {
    try {
      if (!location) {
        console.error('Cannot send alert: Location data unavailable.');
        Alert.alert('Error', 'Location data is unavailable. Please enable location services and try again.');
        return;
      }

      console.log('Preparing emergency alert...');
      const emergencyMessage = `EMERGENCY ALERT: ${username} is in danger. Location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

      // Replace with your Twilio API details
      const TWILIO_ACCOUNT_SID = 'AC184abd08ee8734eda4e49b26ead7c704';
      const TWILIO_AUTH_TOKEN = '85f18fcadd57d57917ca8189adec7111';
      const TWILIO_PHONE_NUMBER = '+14066417660';
      const RECEIVER_PHONE_NUMBER = '+916392617261';

      // Twilio Messaging API URL
      const messageUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

      // Twilio Calls API URL
      const callUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`;

      // Send SMS
      const messageData = new URLSearchParams();
      messageData.append('To', RECEIVER_PHONE_NUMBER);
      messageData.append('From', TWILIO_PHONE_NUMBER);
      messageData.append('Body', emergencyMessage);

      const messageResponse = await axios.post(messageUrl, messageData, {
        auth: {
          username: TWILIO_ACCOUNT_SID,
          password: TWILIO_AUTH_TOKEN,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('SMS sent successfully:', messageResponse.data);

      // Make a Voice Call
      const callData = new URLSearchParams();
      callData.append('To', RECEIVER_PHONE_NUMBER);
      callData.append('From', TWILIO_PHONE_NUMBER);
      callData.append('Url', 'http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical'); // Use Twilio's hosted XML for call content

      const callResponse = await axios.post(callUrl, callData, {
        auth: {
          username: TWILIO_ACCOUNT_SID,
          password: TWILIO_AUTH_TOKEN,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('Call initiated successfully:', callResponse.data);
      Alert.alert('Alert Sent', 'Emergency alert and call sent successfully!');
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
