import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { obtenerPequeñaInfo } from '@/Services/User/UserService';

interface User {
  fotoPerfil: string;
  userFullName: string;
  descripcion: string | null;
}

const Header = () => {
  const [user, setUser] = useState<User | null>(null);  
  const [loading, setLoading] = useState<boolean>(true);  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync('userId');
        if (storedUserId) {
          const id = parseInt(storedUserId);
          const response = await obtenerPequeñaInfo(id); 
          setUser(response);  
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      } finally {
        setLoading(false);  
      }
    };

    fetchUserData();  

  }, []);  

  const getSafeDescription = (description: string | null) => {
    return description && description.trim() ? description : "Sin descripción disponible";
  };

  return (
    <View style={styles.header}>
      {loading ? (
        <Text style={styles.name}>Cargando...</Text>
      ) : (
        user && (
          <>
            <Image source={{ uri: user.fotoPerfil }} style={styles.profileImage} />
            <Text style={styles.name}>{user.userFullName}</Text>
            <Text style={styles.bio}>{getSafeDescription(user.descripcion)}</Text>
          </>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4267B2',
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bio: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default Header;
