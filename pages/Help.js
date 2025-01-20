import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const SafetyTipsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Important Safety Tips</Text>
      <ScrollView style={styles.tipsContainer}>
        <Text style={styles.tip}>1. Always be aware of your surroundings.</Text>
        <Text style={styles.tip}>2. Avoid isolated areas, especially at night.</Text>
        <Text style={styles.tip}>3. Keep your phone charged and accessible.</Text>
        <Text style={styles.tip}>4. Share your location with trusted contacts when traveling alone.</Text>
        <Text style={styles.tip}>5. Trust your instincts and avoid situations that feel unsafe.</Text>
        <Text style={styles.tip}>6. Carry a whistle or personal alarm for emergencies.</Text>
        <Text style={styles.tip}>7. Do not share personal information with strangers.</Text>
        <Text style={styles.tip}>8. Lock your doors and windows at home and in your vehicle.</Text>
        <Text style={styles.tip}>9. Learn basic self-defense techniques.</Text>
        <Text style={styles.tip}>10. Keep emergency numbers saved in your phone and on speed dial.</Text>
      </ScrollView>
      <Image
        source={require('./assets/danger.png')}
        style={styles.image}
      />
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
  },
});

export default SafetyTipsScreen;