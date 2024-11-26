import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import { loginUserInformatio } from '@/Services/Auth/AuthService';
import * as SecureStore from 'expo-secure-store';

interface Props {
  navigation: NavigationProp<any>;
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico y contraseña');
      return;
    }

    try {
      const response = await loginUserInformatio(email, password);

      if ( response.token) {
        Alert.alert('Éxito', 'Inicio de sesión exitoso');
        await SecureStore.setItemAsync('userId', response.userId.toString());
        await SecureStore.setItemAsync('token', response.token);
        await SecureStore.setItemAsync('role', response.role);
        

        navigation.navigate('dashboard');  
      } else {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un error al intentar iniciar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Iniciar sesión" onPress={handleLogin} color="#007bff" />

      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>
          ¿No tienes cuenta?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            Regístrate
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#6C757D',
  },
  link: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
