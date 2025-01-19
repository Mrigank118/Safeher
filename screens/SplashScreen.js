import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Registration');
    }, 2000); // Delay for 2 seconds
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/splash-icon-woman.png')} style={styles.logo} />
      <Text style={styles.appName}>SafeHer</Text>
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
    width: 450, // Increased from 150 to 250
    height: 450, // Increased from 150 to 250
    resizeMode: 'contain', // Ensures the image maintains aspect ratio
  },
  appName: {
    fontSize: 50, // Slightly increased text size for better balance
    fontWeight: 'bold',
    marginTop: 20,
  },
});


export default SplashScreen;
