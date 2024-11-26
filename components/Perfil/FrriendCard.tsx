import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Props {
  friend: {
    name: string;
    profilePic: string;
  };
}

const FriendCard = ({ friend }: Props) => (
  <View style={styles.friendCard}>
    <Image source={{ uri: friend.profilePic }} style={styles.friendImage} />
    <Text style={styles.friendName}>{friend.name}</Text>
  </View>
);

const styles = StyleSheet.create({
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  friendImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FriendCard;
