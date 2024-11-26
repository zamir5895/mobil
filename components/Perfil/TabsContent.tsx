import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PostCard from './PostCard';
import FriendCard from './FrriendCard';
import FriendRequestCard from './FriendRequest';

interface Props {
  activeTab: string;
  userData: any;
}

const TabContent = ({ activeTab, userData }: Props) => {
  return (
    <View style={styles.content}>
      {activeTab === 'info' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <Text style={styles.sectionText}>Nombre: {userData.name}</Text>
          <Text style={styles.sectionText}>Bio: {userData.bio}</Text>
        </View>
      )}

      {activeTab === 'posts' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Publicaciones</Text>
          {userData.posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
      )}

      {activeTab === 'friends' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amigos</Text>
          {userData.friends.map((friend: any) => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
        </View>
      )}

      {activeTab === 'requests' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Solicitudes Enviadas</Text>
          {userData.friendRequestsSent.map((request: any) => (
            <FriendRequestCard key={request.id} request={request} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default TabContent;
