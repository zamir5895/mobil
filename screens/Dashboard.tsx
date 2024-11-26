import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Image, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CrearPublicacion from '../components/Utils/createPublicacion'; // Asegúrate de que este archivo esté correctamente importado

interface Props {
  navigation: NavigationProp<any>;
}

export default function Dashboard({ navigation }: Props) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false); 

  const takePhoto = () => {
    launchCamera({ mediaType: 'photo', cameraType: 'back' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        if (response.assets[0].uri) {
          setPhoto(response.assets[0].uri); 
        }
      }
    });
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        if (response.assets[0].uri) {
          setPhoto(response.assets[0].uri);  
        }
      }
    });
  };

  const handlePostCreated = (newPost: any) => {
    console.log("Nueva publicación creada:", newPost);
    setShowNewPost(false); 
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra superior */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Living</Text>
        <TouchableOpacity onPress={() => navigation.navigate("perfil")}>
          <Text style={styles.profileText}>Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Crear publicación */}
        <CrearPublicacion
        newPostContent={newPostContent}
        setNewPostContent={setNewPostContent}
        showNewPost={showNewPost}
        onPostCreated={handlePostCreated}  // Asegúrate de pasar la función onPostCreated
      />
       

        {/* Publicaciones */}
        <View style={styles.post}>
          <View style={styles.postHeader}>
            <Image source={{ uri: 'https://placeimg.com/40/40/people' }} style={styles.postUserImage} />
            <Text style={styles.postUserName}>John Doe</Text>
          </View>
          <Text style={styles.postText}>¡Tuve un día increíble en la playa!</Text>
        </View>

        <View style={styles.post}>
          <View style={styles.postHeader}>
            <Image source={{ uri: 'https://placeimg.com/40/40/people' }} style={styles.postUserImage} />
            <Text style={styles.postUserName}>Jane Smith</Text>
          </View>
          <Text style={styles.postText}>¡Me encanta el nuevo restaurante que encontré!</Text>
        </View>
      </ScrollView>

      {/* Tabs dentro del Dashboard */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Home')}>
          <Icon name="home-outline" size={30} color="#007bff" />
          <Text style={styles.tabText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('profile')}>
          <Icon name="person-outline" size={30} color="#007bff" />
          <Text style={styles.tabText}>Mi Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Trips')}>
          <Icon name="airplane-outline" size={30} color="#007bff" />
          <Text style={styles.tabText}>Viajes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Reservations')}>
          <Icon name="calendar-outline" size={30} color="#007bff" />
          <Text style={styles.tabText}>Reservas</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    padding: 15,
  },
  post: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postUserImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  postUserName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  postText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
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
