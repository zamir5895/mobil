// src/screens/HomeScreen.tsx
import React from 'react';
import { View, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bienvenido a Living</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Fondo blanco
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6C757D', // Color plomo
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 1,
  },
  buttonContainer: {
    width: '80%', // Ancho de los botones
    marginBottom: 20, // Separación entre botones
  },
  button: {
    backgroundColor: '#6C757D', // Color plomo de fondo
    paddingVertical: 12,
    borderRadius: 8, // Bordes redondeados
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6, // Sombra para Android
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600', // Textos más destacados
    color: '#ffffff', // Color blanco del texto
    textTransform: 'uppercase', // Texto en mayúsculas
    letterSpacing: 1, // Espaciado entre letras
  },
});
