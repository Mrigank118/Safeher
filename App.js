import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './pages/SplashScreen';
import Welcome from './pages/Welcome';
import RegistrationScreen from './pages/RegistrationScreen';
import VoiceRecognitionScreen from './pages/VoiceRecognitionScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ title: 'Register' }}
        />
        <Stack.Screen
          name="VoiceRecognition"
          component={VoiceRecognitionScreen}
          options={{ title: 'Voice Recognition' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
