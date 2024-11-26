import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  request: {
    name: string;
  };
}

const FriendRequestCard = ({ request }: Props) => (
  <View style={styles.requestCard}>
    <Text style={styles.requestText}>Sent friend request to {request.name}</Text>
  </View>
);

const styles = StyleSheet.create({
  requestCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  requestText: {
    fontSize: 16,
    color: '#333',
  },
});

export default FriendRequestCard;
