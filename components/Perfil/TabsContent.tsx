import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { getUserById } from '@/Services/User/UserService';
import * as SecureStore from 'expo-secure-store';
import PostsContent from './PostCard';

interface Props {
  activeTab: string;
}

const TabContent = ({ activeTab }: Props) => {
  const [userId, setUserId] = useState<string | null>('');
  const [user, setUser] = useState<any>({});
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Obtener el ID del usuario desde SecureStore
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error al obtener el userId:', error);
      }
    };

    fetchUserId();
  }, []);

  // Obtener los datos del usuario desde el backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          setLoading(true);
          const response = await getUserById(Number(userId));
          setUser(response);
          // Obtener las publicaciones después de obtener el usuario
        } catch (error) {
          console.error('Error al obtener el usuario:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  // Función para manejar valores nulos o vacíos
  const getSafeValue = (value: string | null) => {
    return value ? value : 'No disponible';
  };

  if (loading) {
    return (
      <View style={styles.content}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <ScrollView>
        {/* Información del perfil */}
        {activeTab === 'info' && (
          <View style={styles.profileContainer}>
            <View style={styles.profileHeader}>
              <Image
                source={{ uri: user.fotoUrl || 'https://placeimg.com/100/100/people' }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {getSafeValue(user.pNombre)} {getSafeValue(user.sNombre)}
                </Text>
                <Text style={styles.profileUsername}>@{getSafeValue(user.username)}</Text>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Editar perfil</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información Personal</Text>
              <Text style={styles.sectionText}>Email: {getSafeValue(user.email)}</Text>
              <Text style={styles.sectionText}>Teléfono: {getSafeValue(user.telefono)}</Text>
              <Text style={styles.sectionText}>Dirección: {getSafeValue(user.direccion)}</Text>
              <Text style={styles.sectionText}>Ciudad: {getSafeValue(user.ciudad)}</Text>
              <Text style={styles.sectionText}>Descripción: {getSafeValue(user.descripcion)}</Text>
              <Text style={styles.sectionText}>Fecha de Nacimiento: {getSafeValue(user.fechaNacimiento?.toString())}</Text>
              <Text style={styles.sectionText}>Género: {getSafeValue(user.genero)}</Text>
            </View>
          </View>
        )}

        {/* Publicaciones */}
        {activeTab === 'posts' && (
            <View style={styles.section}>
              <PostsContent userInfo={user} />
            </View>
            )}


        {/* Amigos */}
        {activeTab === 'friends' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amigos</Text>
            {/* Aquí puedes agregar la lógica para mostrar los amigos del usuario */}
            <Text style={styles.sectionText}>Aquí estarán tus amigos.</Text>
            {/* Por ejemplo, podrías mostrar la lista de amigos manualmente */}
          </View>
        )}

        {/* Solicitudes enviadas */}
        {activeTab === 'requests' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Solicitudes Enviadas</Text>
            {/* Aquí puedes agregar la lógica para mostrar las solicitudes enviadas */}
            <Text style={styles.sectionText}>Aquí estarán tus solicitudes enviadas.</Text>
            {/* Aquí también puedes agregar más funcionalidades manualmente */}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 15,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  profileContainer: {
    marginBottom: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileUsername: {
    fontSize: 18,
    color: '#777',
    marginBottom: 10,
  },
  editButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#333',
  },
  postContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
});

export default TabContent;
