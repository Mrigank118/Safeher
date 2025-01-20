import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Audio } from 'expo-av';

const VoiceRecognitionScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [username, setUsername] = useState('Loading...');
  const [codeword, setCodeword] = useState('Loading...');
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedCodeword = await AsyncStorage.getItem('codeword');

        setUsername(storedUsername || 'Guest');
        setCodeword(storedCodeword || 'Not Set');
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
        setUsername('Error');
        setCodeword('Error');
      }
    };

    const requestLocationPermissions = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permissions are required for this app to function.');
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

  const toggleRingtone = async () => {
    try {
      if (isPlaying) {
        await sound.stopAsync();
        setIsPlaying(false);
      } else {
        if (!sound) {
          const { sound: newSound } = await Audio.Sound.createAsync(require('./assets/one_plus_ringtone.mp3'));
          setSound(newSound);
          await newSound.playAsync();
          setIsPlaying(true);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error playing ringtone:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const fetchLocation = async () => {
    try {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Unable to fetch location. Please enable location services.');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'en-US';
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim().toLowerCase();
        if (transcript.includes(codeword.toLowerCase())) {
          sendEmergencyAlert();
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
        Alert.alert('Error', `Speech recognition error: ${event.error}`);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      alert('Speech Recognition is not supported in your browser.');
    }
  }, [codeword]);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const sendEmergencyAlert = async () => {
    try {
      let currentLocation = location;

      if (!currentLocation) {
        const fetchedLocation = await Location.getCurrentPositionAsync({});
        currentLocation = fetchedLocation.coords;
      }

      const emergencyMessage = `EMERGENCY ALERT: ${username} is in danger. Location: https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;

      const TWILIO_ACCOUNT_SID = 'ACd9a525e3d46a318e20264df2fc9d7291';
      const TWILIO_AUTH_TOKEN = '93375d0df340a400bfb4edd9369d6ec8';
      const TWILIO_PHONE_NUMBER = '+16203191461';
      const RECEIVER_PHONE_NUMBER = '+918009960450';

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

      const callUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`;

      const callData = new URLSearchParams();
      callData.append('To', RECEIVER_PHONE_NUMBER);
      callData.append('From', TWILIO_PHONE_NUMBER);
      callData.append('Twiml', `<Response><Say>${emergencyMessage}</Say></Response>`);

      await axios.post(callUrl, callData, {
        auth: {
          username: TWILIO_ACCOUNT_SID,
          password: TWILIO_AUTH_TOKEN,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      Alert.alert('Alert Sent', 'Emergency alert sent successfully!');
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      Alert.alert('Error', 'Failed to send emergency alert.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SafeHer</Text>
      <Text style={styles.username}>
        Welcome, {username ? username : 'Guest'}
      </Text>
      <Text style={styles.codeword}>
        Codeword: {codeword ? codeword : 'Not Set'}
      </Text>
      <TouchableOpacity style={styles.sosButton} onPress={sendEmergencyAlert}>
        <Image source={require('./assets/sos.png')} style={styles.sosIcon} />
      </TouchableOpacity>
      <Text style={styles.location}>
        {location ? `Current Location: ${location.latitude}, ${location.longitude}` : 'Fetching location...'}
      </Text>
      <Text style={styles.listeningStatus}>
        {isListening ? 'Listening for codeword...' : 'Not listening.'}
      </Text>
      <View style={styles.tray}>
        <TouchableOpacity style={styles.trayButton} onPress={toggleListening}>
          <Image
            source={require('./assets/mic.png')}
            style={[styles.trayIcon, isListening && { tintColor: '#4caf50' }]}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.trayButton}>
          <Image source={require('./assets/gps.png')} style={styles.trayIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.trayButton} onPress={toggleRingtone}>
          <Image
            source={require('./assets/phone-call.png')}
            style={[styles.trayIcon, isPlaying && { tintColor: '#4caf50' }]}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.trayButton} onPress={() => navigation.navigate('Help')}>
          <Image source={require('./assets/question.png')} style={styles.trayIcon} />
        </TouchableOpacity>
      </View>
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
  sosIcon: {
    width: 90,
    height: 90,
    tintColor: '#fff',
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
  tray: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
  },
  trayButton: {
    width: 70,
    height: 70,
    borderRadius: 30,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  trayIcon: {
    width: 20,
    height: 30,
    tintColor: '#fff',
  },
});

export default VoiceRecognitionScreen;
