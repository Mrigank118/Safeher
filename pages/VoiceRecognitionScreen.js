import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Audio } from 'expo-av';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore'; // Make sure this line is present
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, RECEIVER_PHONE_NUMBER } from '@env'; // Import environment variables

const VoiceRecognitionScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [username, setUsername] = useState('Loading...');
  const [codeword, setCodeword] = useState('Loading...');
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  // Initialize data and request location permissions
  useEffect(() => {
    const initializeData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedCodeword = await AsyncStorage.getItem('codeword');
        
        console.log('Fetched username and codeword:', storedUsername, storedCodeword);
        
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
        console.log('Requesting location permissions...');
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permissions are required for this app to function.');
          console.log('Location permission denied');
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

  // Fetch current location
  const fetchLocation = async () => {
    try {
      setIsFetchingLocation(true);
      console.log('Fetching location...');
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      console.log('Location fetched:', loc.coords);
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Unable to fetch location. Please enable location services.');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  // Toggle ringtone
  const toggleRingtone = async () => {
    try {
      console.log('Toggling ringtone...');
      if (isPlaying) {
        await sound.stopAsync();
        setIsPlaying(false);
        console.log('Ringtone stopped');
      } else {
        if (!sound) {
          const { sound: newSound } = await Audio.Sound.createAsync(require('./assets/one_plus_ringtone.mp3'));
          setSound(newSound);
          await newSound.playAsync();
          console.log('Ringtone started');
        } else {
          await sound.playAsync();
          console.log('Ringtone resumed');
        }
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing ringtone:', error);
    }
  };

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
        console.log('Sound unloaded on unmount');
      }
    };
  }, [sound]);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'en-US';
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim().toLowerCase();
        console.log('Speech recognition result:', transcript);
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
        console.log('Speech recognition ended');
      };

      setRecognition(recognitionInstance);
    } else {
      alert('Speech Recognition is not supported in your browser.');
    }
  }, [codeword]);

  // Toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      console.log('Speech recognition stopped');
    } else {
      recognition.start();
      setIsListening(true);
      console.log('Speech recognition started');
    }
  };
  const sendEmergencyAlert = async () => {
    try {
      // Check if RECEIVER_PHONE_NUMBER is valid
      if (!RECEIVER_PHONE_NUMBER) {
        console.warn('Receiver phone number is not defined.');
        Alert.alert('Error', 'Receiver phone number is not set.');
        return;
      }
  
      let currentLocation = location;
  
      if (!currentLocation) {
        const fetchedLocation = await Location.getCurrentPositionAsync({});
        currentLocation = fetchedLocation.coords;
      }
  
      const emergencyMessage = `EMERGENCY ALERT: ${username} is in danger. Location: https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
  
      // Send the emergency message to the defined RECEIVER_PHONE_NUMBER
      const messageUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
      const messageData = new URLSearchParams();
      console.log("Hi");
      messageData.append('To', RECEIVER_PHONE_NUMBER);
      messageData.append('From', TWILIO_PHONE_NUMBER);
      messageData.append('Body', emergencyMessage);
  
      try {
        await axios.post(messageUrl, messageData, {
          auth: {
            username: TWILIO_ACCOUNT_SID,
            password: TWILIO_AUTH_TOKEN,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
  
        console.log(`Emergency message sent to ${RECEIVER_PHONE_NUMBER}`);
      } catch (err) {
        console.error('Error sending message:', err);
      }
  
      // Call logic remains the same
      const callUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`;
  
      const callData = new URLSearchParams();
      callData.append('To', RECEIVER_PHONE_NUMBER); // Use RECEIVER_PHONE_NUMBER directly
      callData.append('From', TWILIO_PHONE_NUMBER);
      callData.append('Twiml', `<Response><Say>${emergencyMessage}</Say></Response>`);
  
      try {
        await axios.post(callUrl, callData, {
          auth: {
            username: TWILIO_ACCOUNT_SID,
            password: TWILIO_AUTH_TOKEN,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
  
        console.log(`Emergency call initiated to ${RECEIVER_PHONE_NUMBER}`);
      } catch (err) {
        console.error('Error making call:', err);
      }
  
      // Fetch the registered users from Firebase Firestore
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => doc.data());
  
      // Haversine formula to calculate distance between two points on Earth
      const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; // Radius of Earth in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
      };
  
      // Filter users within a 5km radius
      const nearbyUsers = usersList.filter((user) => {
        const userLocation = user.location; // Assuming user location is stored as { latitude, longitude }
        const distance = haversineDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          userLocation.latitude,
          userLocation.longitude
        );
        return distance <= 5; // Filter users within 5 km
      });
  
      console.log('Nearby users within 5 km:', nearbyUsers);
  
      // Optionally, show an alert or log the fetched user list
      Alert.alert('Nearby Users Fetched', `Found ${nearbyUsers.length} users within 5 km.`);
  
      Alert.alert('Alert Sent', 'Emergency alert sent successfully!');
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      Alert.alert('Error', 'Failed to send emergency alert.');
    }
  };
  const sendLiveLocationUpdate = async () => {
    try {
      if (!RECEIVER_PHONE_NUMBER) {
        console.warn('Receiver phone number is not defined.');
        Alert.alert('Error', 'Receiver phone number is not set.');
        return;
      }
  
      let currentLocation = location;
  
      if (!currentLocation) {
        const fetchedLocation = await Location.getCurrentPositionAsync({});
        currentLocation = fetchedLocation.coords;
      }
  
      const safetyMessage = `Hello, I am feeling a little unsafe. Please keep a track of me. My live location: https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
  
      const messageUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
      const messageData = new URLSearchParams();
      messageData.append('To', RECEIVER_PHONE_NUMBER);
      messageData.append('From', TWILIO_PHONE_NUMBER);
      messageData.append('Body', safetyMessage);
  
      await axios.post(messageUrl, messageData, {
        auth: {
          username: TWILIO_ACCOUNT_SID,
          password: TWILIO_AUTH_TOKEN,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      console.log(`Live location message sent to ${RECEIVER_PHONE_NUMBER}`);
      Alert.alert('Sent', 'Live location update sent successfully!');
  
      // Start a timer to stop tracking after 20 minutes
      setTimeout(() => {
        stopLiveLocationSharing();
      }, 20 * 60 * 1000); // 20 minutes in milliseconds
  
    } catch (error) {
      console.error('Error sending live location update:', error);
      Alert.alert('Error', 'Failed to send live location update.');
    }
  };
  
  const stopLiveLocationSharing = async () => {
    try {
      if (!RECEIVER_PHONE_NUMBER) {
        console.warn('Receiver phone number is not defined.');
        Alert.alert('Error', 'Receiver phone number is not set.');
        return;
      }
  
      // Notify the receiver that tracking has stopped
      const stopMessage = `Alert: Live location tracking has been stopped.`;
      
      const messageUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
      
      const messageData = new URLSearchParams();
      messageData.append('To', RECEIVER_PHONE_NUMBER);
      messageData.append('From', TWILIO_PHONE_NUMBER);
      messageData.append('Body', stopMessage);
  
      await axios.post(messageUrl, messageData, {
        auth: {
          username: TWILIO_ACCOUNT_SID,
          password: TWILIO_AUTH_TOKEN,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      // Clear the stored location state
      setLocation(null);
      console.log('Live location sharing stopped.');
      
      Alert.alert('Stopped', 'Live location sharing has been stopped.');
    } catch (error) {
      console.error('Error stopping live location sharing:', error);
      Alert.alert('Error', 'Failed to stop live location sharing.');
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SafeHer</Text>
      <Text style={styles.username}>Welcome, {username ? username : 'Guest'}</Text>
      <Text style={styles.codeword}>Codeword: {codeword ? codeword : 'Not Set'}</Text>
      <TouchableOpacity style={styles.sosButton} onPress={sendEmergencyAlert}>
        <Image source={require('./assets/sos.png')} style={styles.sosIcon} />
      </TouchableOpacity>
      <Text style={styles.location}>
        {isFetchingLocation ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : location ? (
          `Current Location: ${location.latitude}, ${location.longitude}`
        ) : (
          'Location not available'
        )}
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
        <TouchableOpacity
          style={styles.trayButton}
          onPress={() => {
            if (location) {
              const searchQuery = 'police station near me';
              const locationUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}/@${location.latitude},${location.longitude},15z`;
              Linking.openURL(locationUrl).catch(err => console.error('Error opening map:', err));
            } else {
              Alert.alert('Location not available', 'Unable to open map. Please wait for location to be fetched.');
            }
          }}
        >
          <Image source={require('./assets/gps.png')} style={styles.trayIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.trayButton} onPress={sendLiveLocationUpdate}>
  <Image
    source={require('./assets/phone-call.png')}
    style={styles.trayIcon}
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
