import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity set to 0

  useEffect(() => {
    // Start fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // 1 second fade-in
      useNativeDriver: true,
    }).start();

    // Navigate to the Registration screen after 2 seconds
    setTimeout(() => {
      navigation.replace('Registration');
    }, 2000);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require('../assets/images/splash-icon-woman.png')} 
        style={[styles.logo, { opacity: fadeAnim }]} 
      />
      <Animated.Text style={[styles.appName, { opacity: fadeAnim }]}>
        SafeHer
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 450,
    height: 450,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default SplashScreen;
