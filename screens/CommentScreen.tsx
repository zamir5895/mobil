import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import CommentsList from '../components/Utils/CommentList';
import { CreateComment } from '../components/Utils/createComment';

type RootStackParamList = {
  CommentsScreen: { postId: number };
};

type CommentsScreenRouteProp = RouteProp<RootStackParamList, 'CommentsScreen'>;

const CommentsScreen: React.FC = () => {
  const route = useRoute<CommentsScreenRouteProp>();
  const { postId } = route.params;

  return (
    <View style={styles.container}>
      <CommentsList publicacionId={postId} />
      <CreateComment publicacionId={postId} setComments={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default CommentsScreen;