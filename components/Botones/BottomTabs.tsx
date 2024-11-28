import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import * as SecureStore from 'expo-secure-store';

interface Props {
  navigation: NavigationProp<any>;
}

const BottomTabs: React.FC<Props> = ({ navigation }) => {
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await SecureStore.getItemAsync('role');
      setRole(storedRole);
    };

    fetchRole();
  }, []);

  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Home')}>
        <Icon name="home-outline" size={24} color="#007bff" />
        <Text style={styles.tabText}>Inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('profile')}>
        <Icon name="person-outline" size={24} color="#007bff" />
        <Text style={styles.tabText}>Mi Perfil</Text>
      </TouchableOpacity>

      {role === 'TRAVELER' ? (
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Trips')}>
          <Icon name="airplane-outline" size={24} color="#007bff" />
          <Text style={styles.tabText}>Viajes</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Alojamiento')}>
          <Icon name="bed-outline" size={24} color="#007bff" />
          <Text style={styles.tabText}>Alojamiento</Text>
        </TouchableOpacity>
      )}

      {role === 'HOST' && (
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('MisAlojamientos')}>
          <Icon name="home-outline" size={24} color="#007bff" />
          <Text style={styles.tabText}>Mis Alojamientos</Text>
        </TouchableOpacity>
      )}

      {/* Botón de Reservas */}
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Reservations')}>
        <Icon name="business-outline" size={24} color="#007bff" />
        <Text style={styles.tabText}>Reservas</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default BottomTabs;