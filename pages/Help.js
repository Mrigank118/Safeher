import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const SafetyTipsScreen = () => {
  const [safetyTips, setSafetyTips] = useState([]); // State to store safety tips
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to handle any errors
  const [timeoutError, setTimeoutError] = useState(false); // State for timeout error
  const [medicalInfo, setMedicalInfo] = useState(''); // State for medical info

  useEffect(() => {
    // Fetch medicalInfo from AsyncStorage
    const getMedicalInfo = async () => {
      try {
        const storedMedicalInfo = await AsyncStorage.getItem('medicalInfo');
        if (storedMedicalInfo) {
          setMedicalInfo(storedMedicalInfo);
        }
      } catch (err) {
        console.error('Error fetching medical info from storage:', err);
      }
    };

    // Fetch medical info when the component mounts
    getMedicalInfo();
  }, []);

  useEffect(() => {
    // Only fetch safety tips if medicalInfo is available
    if (medicalInfo) {
      // Fetch safety tips from the backend
      const fetchSafetyTips = async () => {
        const timeout = setTimeout(() => {
          setTimeoutError(true); // Trigger timeout error after 10 seconds
        }, 10000); // Timeout after 10 seconds

        try {
          console.log("Fetching emergency safety tips...");

          const response = await fetch('http://localhost:5000/generate-safety-tips', {
            method: 'POST', // Changed to POST since we are sending data
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ medicalInfo }), // Send medicalInfo in the request body
          });

          clearTimeout(timeout); // Clear the timeout if the request completes
          console.log("API Response received");

          if (!response.ok) {
            throw new Error('Failed to fetch safety tips');
          }

          const data = await response.json();
          console.log("Safety tips data:", data); // Debugging the response data
          setSafetyTips(data.safetyTips); // Assuming tips are returned as an array
        } catch (err) {
          console.error('Error fetching safety tips:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchSafetyTips();
    }
  }, [medicalInfo]); // Only run when medicalInfo changes

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  if (timeoutError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Timed out! Weak internet connection or server delay.</Text>
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
      <Image source={require('./assets/danger.png')} style={styles.image} />
      <Text style={styles.title}>Important Emergency Safety Tips</Text>
      <ScrollView style={styles.tipsContainer}>
        {safetyTips.map((tip, index) => (
          <Text key={index} style={styles.tip}>
            {index + 1}. {parseMarkdown(tip)}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

// Helper function to parse Markdown-style bold text (*text* -> **text**)
const parseMarkdown = (text) => {
  const regex = /\*(.*?)\*/g; // Match anything inside asterisks (*text*)
  return text.split(regex).map((part, index) => {
    // If the part is bold (matches asterisks), apply the bold style
    return index % 2 === 1 ? <Text key={index} style={styles.boldText}>{part}</Text> : part;
  });
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
    marginTop: 20, // Added top margin for spacing
    marginBottom: 20,
    color: '#e91e63',
    textAlign: 'center',
  },
  tipsContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  tip: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
    lineHeight: 22, // For better readability
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20, // Added margin to separate the image from the title
    borderRadius: 15,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#e91e63', // Optional: you can style the bold text separately
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default SafetyTipsScreen;
