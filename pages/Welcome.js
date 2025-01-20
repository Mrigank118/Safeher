import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Animated, { FadeIn, FadeOut, SlideInLeft, SlideInRight } from "react-native-reanimated";
import { useNavigation } from '@react-navigation/native';  // Import useNavigation hook

const tiles = [
  { 
    img: require('./assets/calling.png'), 
    text: "SafeHer provides real-time assistance during emergencies with features like predefined contact calls, alerting authorities, and sending location updates to ensure your safety at all times." 
  },
  { 
    img: require('./assets/danger.png'), 
    text: "Quickly send emergency alerts with just one tap. The app connects directly to emergency services and shares your real-time location to minimize response time." 
  },
  { 
    img: require('./assets/splash-icon-woman.png'), 
    text: "SafeHer offers an intuitive interface with features like GPS tracking, safe route planning, and sharing your location with trusted contacts for enhanced security." 
  },
  { 
    img: require('./assets/QR.png'), 
    text: "Download SafeHer now by scanning the QR code and stay prepared for emergencies. Access essential safety features with just one tap." 
  },
];

const Welcome = () => {
  const [isPressed, setIsPressed] = useState(false);
  const navigation = useNavigation();  // Initialize useNavigation hook

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Heading Section */}
        <Animated.View 
          style={styles.headingContainer}
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(300)}
        >
          <Text style={styles.headingText}>SafeHer</Text>
          <Text style={styles.subheadingText}>Your Safety, Our Priority</Text>
        </Animated.View>
        
        {/* Tile Section */}
        <View style={styles.tileContainer}>
          {tiles.map((tile, index) => (
            <Animated.View 
              key={index} 
              style={[styles.tile, index % 2 === 0 ? styles.tileRow : styles.tileRowReverse]}
              entering={index % 2 === 0 ? SlideInLeft.delay(index * 200) : SlideInRight.delay(index * 200)}
              exiting={FadeOut.duration(300)}
            >
              <Image source={tile.img} style={styles.image} />
              <Text style={styles.tileText}>{tile.text}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Register Button */}
        <Animated.View 
          style={styles.registerButtonContainer}
          entering={SlideInLeft.duration(700)}
          exiting={FadeOut.duration(300)}
        >
        <TouchableOpacity
  style={[
    styles.registerButton,
    isPressed && styles.registerButtonPressed, // Apply pressed effect
  ]}
  onPressIn={() => setIsPressed(true)} // Start press effect
  onPressOut={() => setIsPressed(false)} // End press effect
  onPress={() => {
    // Navigate to Registration Screen
    navigation.navigate('Registration');  // Use the correct screen name
  }}
>
  <Text style={styles.registerButtonText}>Register Now</Text>
</TouchableOpacity>

        </Animated.View>

        {/* Footer Section */}
        <Animated.View 
          style={styles.footerContainer}
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(300)}
        >
          <Text style={styles.footerText}>&copy; 2025 SafeHer. All Rights Reserved.</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollView: {
    flexGrow: 1,
  },
  headingContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  headingText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  subheadingText: {
    fontSize: 18,
    color: '#555',
  },
  tileContainer: {
    flex: 1,
    marginVertical: 16,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
  },
  tileRow: {
    flexDirection: 'row',
  },
  tileRowReverse: {
    flexDirection: 'row-reverse',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  tileText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  registerButtonContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  registerButton: {
    backgroundColor: '#FF69B4', // Pink color
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%', // Full width
  },
  registerButtonPressed: {
    backgroundColor: '#FF1493', // Darker pink when pressed
  },
  registerButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
});

export default Welcome;
