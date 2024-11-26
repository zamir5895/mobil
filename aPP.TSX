import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <>
      {/* Configura la barra de estado */}
      <StatusBar
        translucent={true}
        backgroundColor={Platform.OS === 'android' ? "#E3F2FD" : "transparent"} // Fondo celeste en Android
        barStyle="dark-content"
      />
      <SafeAreaView style={styles.safeArea}>
        <AppNavigator />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Fondo uniforme
  },
});
