// src/navigation/AppNavigator.tsx
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '@/screens/HomeScreen';
import LoginScreen from '@/screens/loginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import RegisterScreen2 from '@/screens/register2Screen';
import Dashboard from '@/screens/Dashboard';
import ProfileScreen from '@/screens/MiProfile';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false,}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="masInfo" component={RegisterScreen2} />
        <Stack.Screen 
                name="dashboard" 
                component={Dashboard} 
                options={{ headerShown: false }} 
                />     
        <Stack.Screen name = "perfil" component={ProfileScreen} />

         </Stack.Navigator>
    </NavigationContainer>
  );
}
