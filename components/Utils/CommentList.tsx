import { getComentario } from "@/Services/Comment/comment";
import React, { useState, useEffect } from "react";
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";

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

interface CommentsListProps {
  publicacionId: number;
}

const CommentsList: React.FC<CommentsListProps> = ({ publicacionId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [likedByUser, setLikedByUser] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [page]);

  const fetchComments = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await getComentario(publicacionId, page, 10);
      setComments((prevComments) => [...prevComments, ...response.content]);
      setHasMore(!response.last);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (id: number) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              likes: likedByUser ? comment.likes - 1 : comment.likes + 1,
              likedByUser: !likedByUser,
            }
          : comment
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {comments.map((comment) => (
        <View key={comment.id} style={styles.commentContainer}>
          <Image source={{ uri: comment.fotoUrl }} style={styles.userImage} />
          <View style={styles.commentContent}>
            <Text style={styles.userName}>{comment.nombre}</Text>
            <Text style={styles.message}>{comment.message}</Text>
            <View style={styles.commentFooter}>
              <Text style={styles.likes}>{comment.likes} likes</Text>
              <TouchableOpacity onPress={() => handleLike(comment.id)}>
                <Text style={styles.likeButton}>{likedByUser ? "Unlike" : "Like"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      {hasMore && (
        <TouchableOpacity
          onPress={() => setPage((prevPage) => prevPage + 1)}
          style={styles.loadMoreButton}
        >
          <Text style={styles.loadMoreText}>{loading ? "Cargando..." : "Cargar más"}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  commentContainer: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
  },
  message: {
    marginVertical: 5,
  },
  commentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likes: {
    color: "#888",
  },
  likeButton: {
    color: "#007bff",
  },
  loadMoreButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CommentsList;
