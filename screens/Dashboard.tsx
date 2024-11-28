import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import CrearPublicacion from '../components/Utils/createPublicacion';
import PostList from '@/components/Utils/Posts';
import { obtenerPublicacionesInicio } from '@/Services/Publicaciones/Publicaciones';
import BottomTabs from '@/components/Botones/BottomTabs';

interface Props {
  navigation: NavigationProp<any>;
}

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

export default function Dashboard({ navigation }: Props) {
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch function only called when page or loading changes
  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await obtenerPublicacionesInicio(page, 10);
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

      setPosts((prevPosts) => [
        ...prevPosts,
        ...newPosts,
      ].sort((a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()));

      setHasMore(!response.last);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handlePostCreated = (newPost: any) => {
    const completeNewPost = {
      ...newPost,
      fechaPublicacion: new Date(newPost.fechaPublicacion).toLocaleDateString(),
    };
    setPosts((prevPosts) => [
      completeNewPost,
      ...prevPosts,
    ].sort((a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()));
    setShowNewPost(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Living</Text>
        <TouchableOpacity onPress={() => navigation.navigate("perfil")}>
          <Text style={styles.profileText}>Perfil</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostList posts={[item]} />}
        ListHeaderComponent={
          <CrearPublicacion
            newPostContent={newPostContent}
            setNewPostContent={setNewPostContent}
            showNewPost={showNewPost}
            onPostCreated={handlePostCreated}
          />
        }
        onEndReached={handleLoadMore}  
        onEndReachedThreshold={0.5}    
        ListFooterComponent={loading ? <ActivityIndicator size="small" color="#007bff" /> : null}
      />

      <BottomTabs navigation={navigation} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4267B2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 30,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    elevation: 4,
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  tabText: {
    fontSize: 12,
    color: '#007bff',
    marginTop: 4,
    fontWeight: 'bold',
  },
});
