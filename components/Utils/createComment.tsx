import { agregarComentario } from '@/Services/Comment/comment';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { obtenerPequeñaInfo } from '@/Services/User/UserService';
import { Ionicons } from '@expo/vector-icons';

interface CreateCommentProps {
  publicacionId: number;
  setComments: (comment: any) => void;
}

export const CreateComment: React.FC<CreateCommentProps> = ({ publicacionId, setComments }) => {
  const [storedUserId, setStoredUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await SecureStore.getItemAsync('userId');
      setStoredUserId(userId);
    };
    fetchUserId();
  }, []);

  const userId = parseInt(storedUserId || '');

  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const fetchObtenerPequeñaInfoUsuario = async () => {
      try {
        const response = await obtenerPequeñaInfo(userId);
        setUser(response);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
      }
    };
    fetchObtenerPequeñaInfoUsuario();
  }, [userId]);

  const handleSubmit = async () => {
    if (comment.trim() === '') return;

    setLoading(true);
    try {
      const comentario = await agregarComentario(publicacionId, {
        message: comment,
        autorId: userId,
      });

      setComments((prevComments: any[]) => [...prevComments, comentario]); // Se asegura de agregar el comentario correctamente

      setComment('');
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      Alert.alert('Error', 'Ocurrió un error al agregar el comentario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {user?.fullName && (
          <Text style={styles.userName}>{user.fullName}</Text>
        )}
        <Image
          source={{ uri: user?.fotoPerfil || '/default-profile.png' }}
          style={styles.avatar}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Escribe un comentario..."
        value={comment}
        onChangeText={setComment}
        editable={!loading}
      />
      
      <TouchableOpacity
        style={[styles.submitButton, (loading || !comment) && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading || !comment}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Enviando..." : "Enviar"}
        </Text>
      </TouchableOpacity>

      {/* Iconos de interacción */}
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="camera" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="happy-outline" size={20} color="#FFD700" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="location" size={20} color="#00BFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 8,
  },
  userName: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    fontSize: 14,
    marginRight: 8,
    maxHeight: 40,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  iconContainer: {
    flexDirection: 'row',
    marginLeft: 8,
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 10,
    padding: 6,
    borderRadius: 50,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
