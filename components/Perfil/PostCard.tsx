import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  post: {
    text: string;
    date: string;
  };
}

const PostCard = ({ post }: Props) => (
  <View style={styles.postCard}>
    <Text style={styles.postText}>{post.text}</Text>
    <Text style={styles.postDate}>{post.date}</Text>
  </View>
);

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  postText: {
    fontSize: 16,
    color: '#333',
  },
  postDate: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
});

export default PostCard;
