import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TouchableOpacity, Image, FlatList, StyleSheet, ScrollView } from 'react-native';
import { ThumbsUp, MessageCircle } from 'lucide-react-native'; // Si usas una librería de iconos compatible con React Native
import Carousel from './Carusel'; // Debes ajustar el componente CarruselImages a React Native
import { postLike, deleteLike, existsLikeByUserToPost } from '@/Services/Like/Like';
import * as SecureStore from 'expo-secure-store';
import CommentsList from './CommentList';
import { CreateComment } from './createComment';

interface MultimediaInicioDTO {
  id: string;
  contenidoUrl: string;
  tipo: string;
  fechaCreacion: string;
}

interface Post {
  id: number;
  contenido: string;
  cantidadLikes: number;
  cantidadComentarios: number;
  fechaPublicacion: string;
  autorId: number;
  autorNombre: string;
  autorFotoUrl: string;
  multimedia: MultimediaInicioDTO[];
}

interface PostListProps {
  posts: Post[];
}

interface Comment {
  message: string;
  likes: number;
  ulrMultimedia: string;
  fechaCreacion: string;
  id: number;
  multimediaId: string;
  autorId: number;
  parentId: number;
  fotoUrl: string;
  nombre: string;

}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [storedUserId, setStoredUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await SecureStore.getItemAsync('userId');
      setStoredUserId(userId);
    };
    fetchUserId();
  }, []);
  const userId = parseInt(storedUserId || '');
  const isAuthenticated = userId > 0;
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [localPosts, setLocalPosts] = useState(posts);

  useEffect(() => {
    const fetchLikes = async () => {
      const likedSet = new Set<number>();
      for (const post of posts) {
        const isLiked = await existsLikeByUserToPost(post.id, userId);
        if (isLiked) {
          likedSet.add(post.id);
        }
      }
      setLikedPosts(likedSet);
    };

    if (isAuthenticated) {
      fetchLikes();
    }
  }, [posts, userId, isAuthenticated]);

  const handleLikeToggle = async (postId: number) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para dar like.");
      return;
    }

    const postIndex = localPosts.findIndex((post) => post.id === postId);
    if (postIndex === -1) return;

    const currentPost = localPosts[postIndex];
    const newLikedPosts = new Set(likedPosts);

    try {
      if (newLikedPosts.has(postId)) {
        newLikedPosts.delete(postId);
        currentPost.cantidadLikes -= 1;
        await deleteLike(postId, userId);
      } else {
        newLikedPosts.add(postId);
        currentPost.cantidadLikes += 1;
        await postLike(postId, userId);
      }

      setLikedPosts(newLikedPosts);
      setLocalPosts([
        ...localPosts.slice(0, postIndex),
        currentPost,
        ...localPosts.slice(postIndex + 1),
      ]);

      if (selectedPost?.id === postId) {
        setSelectedPost({ ...currentPost });
      }
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  const openModal = (post: Post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View key={item.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: item.autorFotoUrl || '/default-profile.png' }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.authorName}>{item.autorNombre}</Text>
          <Text style={styles.postDate}>{item.fechaPublicacion}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => openModal(item)}>
        <Text>{item.contenido}</Text>
        {item.multimedia.length > 0 && (
          <Carousel multimedia={item.multimedia} />
        )}
      </TouchableOpacity>
      <View style={styles.cardFooter}>
        <TouchableOpacity onPress={() => handleLikeToggle(item.id)} style={styles.button}>
          <Text style={[styles.iconText, likedPosts.has(item.id) ? styles.liked : styles.unliked]}>
            <ThumbsUp />
          </Text>
          <Text>{item.cantidadLikes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MessageCircle style={styles.icon} />
          <Text>{item.cantidadComentarios}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        data={localPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
      />
      {selectedPost && (
        <Modal visible={true} onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.carouselContainer}>
                {selectedPost.multimedia.length > 0 ? (
                  <Carousel multimedia={selectedPost.multimedia} />
                ) : (
                  <Text>No hay multimedia disponible</Text>
                )}
              </ScrollView>

              <View style={styles.postDetails}>
                <Image
                  source={{ uri: selectedPost.autorFotoUrl || '/default-profile.png' }}
                  style={styles.avatar}
                />
                <Text style={styles.authorName}>{selectedPost.autorNombre}</Text>
                <Text>{selectedPost.fechaPublicacion}</Text>
                <Text>{selectedPost.contenido}</Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => handleLikeToggle(selectedPost.id)}
                    style={styles.button}
                  >
                    <Text
                      style={StyleSheet.flatten([styles.iconText, likedPosts.has(selectedPost.id) ? styles.liked : styles.unliked])}
                    >
                      <ThumbsUp />
                    </Text>
                    <Text>{selectedPost.cantidadLikes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
                    <MessageCircle style={styles.icon} />
                    <Text>{selectedPost.cantidadComentarios}</Text>
                  </TouchableOpacity>
                </View>

                <CommentsList publicacionId={selectedPost.id} />
                <CreateComment publicacionId={selectedPost.id} setComments={() => {}} />
              </View>
            </View>
            <Button title="Cerrar" onPress={closeModal} />
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorName: {
    fontWeight: 'bold',
  },
  postDate: {
    fontSize: 12,
    color: 'gray',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  liked: {
    color: 'blue',
  },
  unliked: {
    color: 'gray',
  },
  iconText: {
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  carouselContainer: {
    width: '100%',
    height: 200,
  },
  postDetails: {
    paddingVertical: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default PostList;
