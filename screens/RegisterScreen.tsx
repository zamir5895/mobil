import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationProp } from '@react-navigation/native';
import { registerUser } from '@/Services/Auth/AuthService';
import * as SecureStore from 'expo-secure-store';

type Props = {
  navigation: NavigationProp<any>;
};

export default function RegisterScreen({ navigation }: Props) {
  const [userName, setUserName] = useState('');
  const [primerNombre, setPrimerNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [role, setRole] = useState('TRAVELER');  

  const handleRegister = async () => {
    if (!userName || !primerNombre || !primerApellido || !edad || !email || !password || !role) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
  
    const edadNum = Number(edad);
    if (isNaN(edadNum)) {
      Alert.alert('Error', 'La edad debe ser un número válido');
      return;
    }
  
  
  
    try {
      const response = await registerUser(userName, primerNombre, segundoNombre, primerApellido, segundoApellido, edadNum, email, password, phoneNumber, role);
  
      if ( response.userId) {
        await SecureStore.setItemAsync('userId', response.userId.toString());
        console.log('Respuesta del backend:', response);
        console.log("id del usuario:", response.userId);
        Alert.alert('Éxito', 'Registro exitoso');
        navigation.navigate('masInfo');
      } else {
        console.log('Error: respuesta del backend inválida', response);
        Alert.alert('Error', 'Hubo un problema al registrar el usuario');
      }
    } catch (error) {
      console.log('Error al registrar el usuario en el catch:', error);
      if (error instanceof Error && (error as any).response) {
        if ((error as any).response) {
          console.log('Detalles del error desde el backend:', (error as any).response.data);
        }
      } else {
        if (error instanceof Error) {
          console.log('Error desconocido:', error.message);
        } else {
          console.log('Error desconocido:', error);
        }
      }
      Alert.alert('Error', 'Hubo un problema al registrar el usuario');
    }
  };
  

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Registro</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={userName}
          onChangeText={setUserName}
        />
        <TextInput
          style={styles.input}
          placeholder="Primer Nombre"
          value={primerNombre}
          onChangeText={setPrimerNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Segundo Nombre"
          value={segundoNombre}
          onChangeText={setSegundoNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Primer Apellido"
          value={primerApellido}
          onChangeText={setPrimerApellido}
        />
        <TextInput
          style={styles.input}
          placeholder="Segundo Apellido (Opcional)"
          value={segundoApellido}
          onChangeText={setSegundoApellido}
        />
        <TextInput
          style={styles.input}
          placeholder="Edad"
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
        />
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
     

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Rol</Text>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue: string) => setRole(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Traveler" value="TRAVELER" />
            <Picker.Item label="Host" value="HOST" />
          </Picker>
        </View>

        <Button title="Registrar" onPress={handleRegister} color="#007bff" />

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>
            ¿Ya tienes cuenta?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
              Inicia sesión
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  pickerContainer: {
    width: '100%',
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  picker: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    paddingLeft: 10,
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
