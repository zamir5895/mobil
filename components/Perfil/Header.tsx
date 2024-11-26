import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Props {
  userData: {
    name: string;
    profilePicture: string;
    bio: string;
  };
}

const Header = ({ userData }: Props) => (
  <View style={styles.header}>
    <Image source={{ uri: userData.profilePicture }} style={styles.profileImage} />
    <Text style={styles.name}>{userData.name}</Text>
    <Text style={styles.bio}>{userData.bio}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4267B2',
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bio: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Header;
