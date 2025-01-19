import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as Location from 'expo-location';

const VoiceRecognitionScreen = () => {
  const TWILIO_ACCOUNT_SID = 'AC4a8ba7d7398f5f1cfb44d1dea0b32225'; // Replace with your SID
  const TWILIO_AUTH_TOKEN = '826e0e00fb4bb2fb84430fce4215630a'; // Replace with your Auth Token
  const TWILIO_PHONE_NUMBER = '+15075287908'; // Replace with your Twilio number
  const EMERGENCY_CONTACT = '+917017277081'; // Replace with a valid emergency contact

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

    console.log('Emergency Contact:', EMERGENCY_CONTACT);
    console.log('Twilio Phone Number:', TWILIO_PHONE_NUMBER);
    console.log('Location:', location);

    const smsUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const callUrl = 'http://demo.twilio.com/docs/voice.xml';

    const smsData = new URLSearchParams({
      From: TWILIO_PHONE_NUMBER,
      To: EMERGENCY_CONTACT,
      Body: `Help! I am in danger!\nLocation: ${location.latitude}, ${location.longitude}\nGoogle Maps Link: https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
    });

    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    try {
      // Send SMS
      const smsResponse = await fetch(smsUrl, {
        method: 'POST',
        body: smsData,
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const smsResult = await smsResponse.json();
      if (!smsResponse.ok) throw new Error(smsResult.message);
      console.log('Message sent:', smsResult);

      // Make a call
      const callData = new URLSearchParams({
        From: TWILIO_PHONE_NUMBER,
        To: EMERGENCY_CONTACT,
        Url: callUrl,
      });

      const callResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`,
        {
          method: 'POST',
          body: callData,
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const callResult = await callResponse.json();
      if (!callResponse.ok) throw new Error(callResult.message);
      console.log('Call initiated:', callResult);

      Alert.alert('Alert Sent', 'Emergency message and call sent successfully!');
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
      <Text style={styles.title}>Women Safety App</Text>
      <Button title="Send Emergency Alert (Help Me)" onPress={triggerHelpMeAlert} />
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
