import { agregarComentario } from '@/Services/Comment/comment';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { obtenerPequeñaInfo } from '@/Services/User/UserService';

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
    
    
    const [comment, setComment] = useState("");
  
  
    const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (comment.trim() === "") return;

    setLoading(true);
    try {
      const comentario = await agregarComentario(publicacionId, {
        message: comment,
        autorId: userId 
      });
      setComments(comentario);
      setComment("");
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      Alert.alert("Error", "Ocurrió un error al agregar el comentario.");
    } finally {
      setLoading(false);
    }
  };
  const [user, setUser] = useState<any>({});

  useEffect(()=>{
    console.log('userId', userId)
    const fetchObtenerPequeñaInfoUsuario = async () => {
        try {
            const response = await obtenerPequeñaInfo(userId);
            setUser(response);
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
        }
        }
  })

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatarContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 12,
  },
  userName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    fontSize: 14,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
