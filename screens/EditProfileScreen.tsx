import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { profile } from '@/Services/Auth/AuthService';
import { NavigationProp } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<any>;
};

const EditProfileScreen = ({ navigation }: Props) => {
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState<{ uri: string, name: string, type: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (galleryStatus !== 'granted' || cameraStatus !== 'granted') {
      alert('¡Lo siento! Necesitamos permisos para acceder a la cámara y la galería');
    } else {
      console.log('Permisos concedidos para la galería y la cámara.');
    }
  };

  const pickImageFromGallery = async () => {
    // Verifica si tienes permisos para la galería antes de intentar abrirla
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('¡Permiso denegado para acceder a la galería!');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,  
      quality: 1,  
    });
    
    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setFoto({
        uri: selectedImage.uri,
        name: selectedImage.fileName || 'profile_picture.jpg',
        type: selectedImage.type || 'image/jpeg',
      });
    }
  };

  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('¡Permiso denegado para acceder a la cámara!');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,  
      quality: 1, 
    });
    
    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setFoto({
        uri: selectedImage.uri,
        name: selectedImage.fileName || 'profile_picture.jpg',
        type: selectedImage.type || 'image/jpeg',
      });
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Selecciona una opción',
      '',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Tomar foto',
          onPress: takePhotoWithCamera,
        },
        {
          text: 'Seleccionar desde la galería',
          onPress: pickImageFromGallery,
        },
      ],
      { cancelable: true }
    );
  };

  const handleSave = async () => {
    if (!descripcion || !foto) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    setLoading(true);

    try {
      const userId = await SecureStore.getItemAsync('userId');
      if (userId) {
        const file = {
          uri: foto.uri,
          name: foto.name,
          type: foto.type,
        };

        const response = await profile(descripcion, file, parseInt(userId));
        if (response) {
          Alert.alert('Éxito', 'Perfil actualizado correctamente');
          navigation.navigate('Login');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al actualizar el perfil');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity onPress={showImagePickerOptions} style={styles.imagePickerButton}>
        <Text style={styles.imagePickerButtonText}>
          {foto ? 'Cambiar Foto' : 'Seleccionar Foto'}
        </Text>
      </TouchableOpacity>

      {foto && (
        <View style={styles.imagePreviewContainer}>
          <Text style={styles.imagePreviewText}>Foto seleccionada:</Text>
          <Image source={{ uri: foto.uri }} style={styles.imagePreview} />
        </View>
      )}

      <Button
        title={loading ? 'Guardando...' : 'Guardar Cambios'}
        onPress={handleSave}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
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
    marginTop: 20,
  },
  imagePickerButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  imagePickerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreviewContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imagePreviewText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default EditProfileScreen;
