import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6347',
        tabBarInactiveTintColor: '#FF6347',
        tabBarStyle: {
          backgroundColor: '#FF6347',
        },
      }}>
      {/* Pestaña Viajes */}
      <Tabs.Screen 
        name="trips"
        options={{
          title: "Viajes",
          tabBarIcon: ({ color }) => <Ionicons name="airplane" size={24} color={color} />,
        }}
      />

      {/* Pestaña Casa */}
      <Tabs.Screen 
        name="index"
        options={{
          title: "Casa",
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />

      {/* Pestaña Apartamentos */}
      <Tabs.Screen 
        name="apartments"
        options={{
          title: "Apartamentos",
          tabBarIcon: ({ color }) => <MaterialIcons name="apartment" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
