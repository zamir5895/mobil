import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs = ({ activeTab, setActiveTab }: Props) => (
  <View style={styles.tabs}>
    <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('info')}>
      <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>Información</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('posts')}>
      <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>Publicaciones</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('friends')}>
      <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>Amigos</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('requests')}>
      <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>Solicitudes Enviadas</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tabButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  tabText: {
    fontSize: 14,
    color: '#007bff',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#4267B2',
  },
});

export default Tabs;
