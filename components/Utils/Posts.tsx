import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { ThumbsUp, MessageCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // Importamos StackNavigationProp
import { postLike, deleteLike, existsLikeByUserToPost } from '@/Services/Like/Like';
import * as SecureStore from 'expo-secure-store';
import Carousel from './Carusel';
import { RootStackParamList } from '@/navigation/types';

// Definimos el tipo de navegación
type HomeNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

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

const PostList: React.FC<PostListProps> = ({ posts }) => {
  const [storedUserId, setStoredUserId] = useState<string | null>(null);
  const navigation = useNavigation<HomeNavigationProp>(); // Usamos el tipo HomeNavigationProp aquí

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
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  const openCommentsScreen = (postId: number) => {
    navigation.navigate('CommentsScreen', { postId }); // Ahora TypeScript sabe que 'postId' es el parámetro esperado
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
      <TouchableOpacity onPress={() => openCommentsScreen(item.id)}>
        <Text>{item.contenido}</Text>
        {item.multimedia.length > 0 && (
          <Carousel multimedia={item.multimedia} />
        )}
      </TouchableOpacity>
      <View style={styles.cardFooter}>
        <TouchableOpacity onPress={() => handleLikeToggle(item.id)} style={styles.button}>
          <ThumbsUp size={24} color={likedPosts.has(item.id) ? '#1877F2' : '#A9A9A9'} />
          <Text style={styles.iconText}>{item.cantidadLikes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MessageCircle size={24} color="#A9A9A9" />
          <Text style={styles.iconText}>{item.cantidadComentarios}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={localPosts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id.toString()}
    />
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
});

export default PostList;
