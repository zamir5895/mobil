import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  navigation: NavigationProp<any>;
}

export default function Dashboard({ navigation }: Props) {
  return (
    <View style={styles.container}>
      {/* Barra superior */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Living</Text>
        <TouchableOpacity onPress={() => navigation.navigate('perfil')}>
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Crear publicación */}
        <View style={styles.createPostSection}>
          <TextInput style={styles.createPostInput} placeholder="What's on your mind?" placeholderTextColor="#888" />
          <Button title="Post" color="#007bff" onPress={() => {}} />
        </View>

        {/* Publicaciones */}
        <View style={styles.post}>
          <View style={styles.postHeader}>
            <Image source={{ uri: 'https://placeimg.com/40/40/people' }} style={styles.postUserImage} />
            <Text style={styles.postUserName}>John Doe</Text>
          </View>
          <Text style={styles.postText}>Just had a great day at the beach!</Text>
        </View>

        <View style={styles.post}>
          <View style={styles.postHeader}>
            <Image source={{ uri: 'https://placeimg.com/40/40/people' }} style={styles.postUserImage} />
            <Text style={styles.postUserName}>Jane Smith</Text>
          </View>
          <Text style={styles.postText}>Loving the new restaurant I found!</Text>
        </View>

        {/* Agrega más publicaciones aquí si deseas hacer el scroll infinito */}
      </ScrollView>

      {/* Tabs dentro del Dashboard */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Home')}>
          <Icon name="home-outline" size={30} color="#007bff" />
          <Text style={styles.tabText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('perfil')}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1', // Fondo gris claro similar a las apps sociales
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4267B2', // Azul similar a Facebook
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    padding: 15,
  },
  createPostSection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  createPostInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  post: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postUserName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postText: {
    fontSize: 14,
    color: '#333',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  tabText: {
    fontSize: 12,
    color: '#007bff',
    marginTop: 4,
  },
});
