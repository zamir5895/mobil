import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Header from '../components/Perfil/Header';
import Tabs from '../components/Perfil/Tabs';
import TabContent from '../components/Perfil/TabsContent';

interface Props {
  navigation: NavigationProp<any>;
}

export default function ProfileScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState('info');

  const userData = {
    name: 'John Doe',
    profilePicture: 'https://placeimg.com/100/100/people',
    bio: 'Just a guy who loves to travel and explore the world.',
    posts: [
      { id: 1, text: 'Had an amazing day at the beach!', date: '2024-11-25' },
      { id: 2, text: 'Exploring new restaurants in town.', date: '2024-11-24' },
    ],
    friends: [
      { id: 1, name: 'Jane Smith', profilePic: 'https://placeimg.com/40/40/people' },
      { id: 2, name: 'Alex Johnson', profilePic: 'https://placeimg.com/40/40/people' },
    ],
    friendRequestsSent: [
      { id: 1, name: 'Chris Brown' },
      { id: 2, name: 'Emma Watson' },
    ],
  };

  return (
    <View style={styles.container}>
      <Header userData={userData} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ScrollView contentContainerStyle={styles.content}>
        <TabContent activeTab={activeTab} userData={userData} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    padding: 15,
  },
});
