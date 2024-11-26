import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { obtenerPublicacionesUsuario } from '../../Services/Publicaciones/Publicaciones';
import PostList from '../Utils/Posts';

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

interface PostsContentProps {
  userInfo: {
    name: string;
    profilePicture: string;
    id: number;
  };
}

const PostsContent: React.FC<PostsContentProps> = ({ userInfo }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await obtenerPublicacionesUsuario(userInfo.id, page, 10);
        const newPosts = response.content.map((post: any) => ({
          id: post.id,
          contenido: post.contenido,
          autorId: post.autorId,
          autorNombre: post.autorNombre,
          autorFotoUrl: post.autorFotoUrl,
          fechaPublicacion: new Date(post.fechaPublicacion).toLocaleDateString(),
          cantidadLikes: post.cantidadLikes,
          cantidadComentarios: post.cantidadComentarios,
          multimedia: post.multimediaInicioDTO.map((media: any) => ({
            id: media.id,
            contenidoUrl: media.contenidoUrl,
            tipo: media.tipo,
            fechaCreacion: media.fechaCreacion,
          })),
        }));
        setPosts((prevPosts) =>
          [...prevPosts, ...newPosts].sort(
            (a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
          )
        );
        setHasMore(!response.last);
        if (response.content.length === 0 && page === 0) {
          setError('No hay publicaciones.');
        }
      } catch (error) {
        setError('Error al obtener publicaciones.');
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, userInfo.id]);

  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          source={{ uri: item.autorFotoUrl || '/default-profile.png' }}
          style={styles.avatar}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{item.autorNombre}</Text>
          <Text style={styles.postDate}>{item.fechaPublicacion}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{item.contenido}</Text>
      {/* Puedes agregar un componente de Carrusel de imágenes aquí */}
      <View style={styles.postFooter}>
        <Text>{item.cantidadLikes} Likes</Text>
        <Text>{item.cantidadComentarios} Comentarios</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && page === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorMessage}>{error}</Text>
      ) : (
        <PostList posts={posts}  />

      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorInfo: {
    marginLeft: 10,
  },
  authorName: {
    fontWeight: 'bold',
  },
  postDate: {
    color: 'gray',
    fontSize: 12,
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorMessage: {
    textAlign: 'center',
    color: 'red',
  },
});

export default PostsContent;
