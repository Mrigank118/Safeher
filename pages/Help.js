import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const SafetyTipsScreen = () => {
  const [safetyTips, setSafetyTips] = useState([]); // State to store safety tips
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to handle any errors
  const [medicalInfo, setMedicalInfo] = useState(''); // State to hold medical info

  useEffect(() => {
    // Fetch medical info from AsyncStorage
    const fetchMedicalInfo = async () => {
      try {
        const storedMedicalInfo = await AsyncStorage.getItem('medicalInfo'); // Retrieve medical info
        if (storedMedicalInfo) {
          setMedicalInfo(storedMedicalInfo); // Set medical info to state if found
        } else {
          console.log('No medical info found');
        }
      } catch (error) {
        console.error('Error fetching medical info:', error);
      }
    };

    fetchMedicalInfo();
  }, []);

  useEffect(() => {
    // Fetch safety tips from the backend if medical info is available
    const fetchSafetyTips = async () => {
      if (!medicalInfo) {
        setError('No medical info available');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/generate-safety-tips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ medicalInfo }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch safety tips');
        }

        const data = await response.json();
        setSafetyTips(data.safetyTips); // Assuming tips are returned as an array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSafetyTips();
  }, [medicalInfo]); // Run fetch when medical info changes

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{`Error: ${error}`}</Text>
      </View>
    );
  }

  if (!safetyTips.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No safety tips available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Important Safety Tips</Text>
      <ScrollView style={styles.tipsContainer}>
        {safetyTips.map((tip, index) => (
          <Text key={index} style={styles.tip}>
            {index + 1}. {tip}
          </Text>
        ))}
      </ScrollView>
      <Image source={require('./assets/danger.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#e91e63',
  },
  tipsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  tip: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 15,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default SafetyTipsScreen;
