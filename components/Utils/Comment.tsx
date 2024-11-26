import { actualizarComentario, actualizarComentarioLikes, eliminarComentario } from '@/Services/Comment/comment';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface CommentProps {
  id: number;
  postId: number;
  message: string;
  userId: number;
  userName: string;
  userFoto: string;
  likes: number;
  likedByUser: boolean;
  onLike: (id: number) => void;
}

const Comment: React.FC<CommentProps> = ({
  id,
  postId,
  message,
  userId,
  userName,
  userFoto,
  likes,
  likedByUser,
  onLike,
}) => {
  const [storedUserId, setStoredUserId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await SecureStore.getItemAsync('userId');
      setStoredUserId(userId);
    };
    fetchUserId();
  }, []);
  
  const isAuthor = userId.toString() === storedUserId;
  const [editedMessage, setEditedMessage] = useState(message);
  const [localLikes, setLocalLikes] = useState(likes);
  const [localLikedByUser, setLocalLikedByUser] = useState(likedByUser);

  const handleLike = async () => {
    try {
      await actualizarComentarioLikes(postId, id);
      setLocalLikes((prevLikes) => (localLikedByUser ? prevLikes - 1 : prevLikes + 1));
      setLocalLikedByUser((prevLiked) => !prevLiked);
      onLike(id);
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Eliminar comentario",
      "¿Estás seguro de que deseas eliminar este comentario?",
      [
        { text: "Cancelar" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await eliminarComentario(postId, id);
              Alert.alert("Comentario eliminado correctamente.");
            } catch (error) {
              console.error("Error al eliminar comentario:", error);
              Alert.alert("Ocurrió un error al eliminar el comentario.");
            }
          },
        },
      ]
    );
  };

  const handleUpdate = async () => {
    if (!editedMessage.trim() || editedMessage.trim() === message.trim()) {
      setEditing(false);
      return;
    }

    try {
      await actualizarComentario(postId, id, { contenido: editedMessage });
      Alert.alert("Comentario actualizado correctamente.");
      setEditing(false);
    } catch (error) {
      console.error("Error al actualizar comentario:", error);
      Alert.alert("Ocurrió un error al actualizar el comentario.");
    }
  };

  return (
    <View style={styles.commentContainer}>
      {/* Avatar */}
      <Image
        source={{ uri: userFoto || '/default-profile.png' }}
        style={styles.avatar}
      />

      {/* Contenido del comentario */}
      <View style={styles.commentContent}>
        {/* Nombre del autor */}
        <Text style={styles.userName}>{userName}</Text>

        {/* Mensaje */}
        {!editing ? (
          <Text style={styles.message}>{message}</Text>
        ) : (
          <TextInput
            value={editedMessage}
            onChangeText={setEditedMessage}
            style={styles.textInput}
            multiline
          />
        )}

        {/* Botones de interacción */}
        <View style={styles.interactionButtons}>
          <TouchableOpacity onPress={handleLike}>
            <Text style={[styles.likeText, localLikedByUser && styles.liked]}>👍 {localLikes}</Text>
          </TouchableOpacity>

          {isAuthor && (
            <>
              {!editing ? (
                <>
                  <TouchableOpacity onPress={() => setEditing(true)}>
                    <Text style={styles.editButton}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDelete}>
                    <Text style={styles.deleteButton}>Eliminar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={handleUpdate}>
                    <Text style={styles.saveButton}>Guardar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditing(false)}>
                    <Text style={styles.cancelButton}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  commentContent: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    color: '#555',
    marginVertical: 8,
  },
  textInput: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginVertical: 8,
  },
  interactionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  likeText: {
    color: '#555',
    marginRight: 16,
  },
  liked: {
    color: '#007BFF',
  },
  editButton: {
    color: '#007BFF',
    marginRight: 16,
  },
  deleteButton: {
    color: '#FF0000',
  },
  saveButton: {
    color: '#28A745',
    marginRight: 16,
  },
  cancelButton: {
    color: '#6C757D',
  },
});

export default Comment;