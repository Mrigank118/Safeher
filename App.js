import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './pages/SplashScreen';
import Welcome from './pages/Welcome';
import RegistrationScreen from './pages/RegistrationScreen';
import VoiceRecognitionScreen from './pages/VoiceRecognitionScreen';
import Help from './pages/Help';
import Terms from './pages/Terms'; // Import the Terms & Conditions screen

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
          options={{
            title: 'Register',
            headerStyle: { backgroundColor: '#ff69b4' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="VoiceRecognition"
          component={VoiceRecognitionScreen}
          options={{
            title: 'Voice Recognition',
            headerStyle: { backgroundColor: '#ff69b4' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Help"
          component={Help}
          options={{
            title: 'Help',
            headerStyle: { backgroundColor: '#ff69b4' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Terms"
          component={Terms}
          options={{
            title: 'Terms & Conditions',
            headerStyle: { backgroundColor: '#ff69b4' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
