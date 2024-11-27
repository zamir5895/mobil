import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Header from '../components/Perfil/Header';
import Tabs from '../components/Perfil/Tabs';

import { obtenerPequeñaInfo } from '@/Services/User/UserService';

interface Props {
  navigation: NavigationProp<any>;
}
import * as SecureStore from 'expo-secure-store';
import TabContent from '@/components/Perfil/TabsContent';




export default function ProfileScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState('info');
  const [userId, setUserId] = useState('');


  return (
    <View style={styles.container}>
      <Header />
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
