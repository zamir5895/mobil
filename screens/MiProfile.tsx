import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Header from '../components/Perfil/Header';
import Tabs from '../components/Perfil/Tabs';
import TabContent from '../components/Perfil/TabsContent';

import { obtenerPequeñaInfo } from '@/Services/User/UserService';

interface Props {
  navigation: NavigationProp<any>;
}
import * as SecureStore from 'expo-secure-store';




export default function ProfileScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState('info');
  const [userId, setUserId] = useState('');


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

  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error("Error al obtener el userId:", error);
      }
    };

    fetchUserId();
  }, []);


  useEffect(()=>{
    const fetchUserData = async () => {
      try {
        const response = await obtenerPequeñaInfo(Number(userId));
        setUser(response);

      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    };

    fetchUserData();
    console.log("user ", user)
  })

  return (
    <View style={styles.container}>
      <Header userData={userData} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ScrollView contentContainerStyle={styles.content}>
        <TabContent activeTab={activeTab} />
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
