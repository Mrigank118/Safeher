import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/SafeherSplash.png')}
        style={[styles.logo, { opacity: fadeAnim }]}
      />
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
