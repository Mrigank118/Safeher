import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const VoiceRecognitionScreen = () => {
  const TWILIO_ACCOUNT_SID = 'AC4a8ba7d7398f5f1cfb44d1dea0b32225'; // Replace with your SID
  const TWILIO_AUTH_TOKEN = '826e0e00fb4bb2fb84430fce4215630a'; // Replace with your Auth Token
  const TWILIO_PHONE_NUMBER = '+15075287908'; // Replace with your Twilio phone number
  const EMERGENCY_CONTACT = '+917017277081'; // Add your emergency contact number

  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permissions are required for this app to function.');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const sendEmergencyAlert = async () => {
    if (!location) {
      Alert.alert('Error', 'Location is not available.');
      return;
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const data = new URLSearchParams({
      From: TWILIO_PHONE_NUMBER,
      To: EMERGENCY_CONTACT,
      Body: `Help! I am in danger!\nLocation: ${location.latitude}, ${location.longitude}\nGoogle Maps Link: https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
    });

    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      await response.json();
      Alert.alert('Alert Sent', 'Emergency message sent successfully!');
    } catch (error) {
      console.error('Error sending alert:', error);
      Alert.alert('Error', `Failed to send emergency alert: ${error.message}`);
    }
  };

  const triggerHelpMeAlert = () => {
    Alert.alert('Code Word Detected', 'Sending emergency alert...');
    sendEmergencyAlert();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Recognition & Alert</Text>
      <Button
        title="Simulate Help Me Command"
        onPress={triggerHelpMeAlert}
      />
      <Text style={styles.location}>
        {location
          ? `Current Location: ${location.latitude}, ${location.longitude}`
          : 'Fetching location...'}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  location: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default VoiceRecognitionScreen;
