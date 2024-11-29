import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, Modal, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { obtenerPequeñaInfo } from "@/Services/User/UserService";
import { guardarPin, obtenerPines, Pin, PinCreate } from "@/Services/Pins/Pins";
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Location from 'expo-location';


interface PinWithUser {
  pin: {
    id: string;
    latitude: number;
    longitude: number;
    titulo: string;
    descripcion: string;
    rating: number;
  };
  creador: {
    userFullName: string;
  };
}

const Mapa: React.FC = () => {
  const [pins, setPins] = useState<PinWithUser[]>([]);
  const [newPlace, setNewPlace] = useState<{ lat: number; lng: number } | null>(null);
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [star, setStar] = useState<number>(0);
  const [selectedPin, setSelectedPin] = useState<PinWithUser | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const mapRef = useRef<MapView | null>(null);
  const navigation = useNavigation();
  const [user, setUser] = useState<any>({});
  const [userId, setUserId] = useState<number | null>(null); 
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Se necesita permiso para acceder a la ubicación');
    }
  };
  useEffect(() => {
    requestLocationPermission();
  }, []);    
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const id = await SecureStore.getItemAsync("userId");
        console.log("userId", userId);
        if (userId) {
          const user = await obtenerPequeñaInfo(Number(userId));
          setUser(user);
        }
        setUserId(parseInt(id || '0'));
        console.log("Usuario",userId);
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
      }
    };

    const cargarPinesConUsuarios = async () => {
      try {
        const pines = await obtenerPines();
        console.log("Pines obtenidos:", pines); 
        const pinesConUsuarios: PinWithUser[] = await Promise.all(
          pines.map(async (pin: Pin) => {
            const usuarios = await Promise.all(
              pin.userids.map((userId: number) => obtenerPequeñaInfo(userId))
            );
            const usuariosValidos = usuarios.filter((usuario) => usuario !== null);
            return {
              pin: {
                id: pin._id,
                latitude: pin.latitude,
                longitude: pin.longitude,
                titulo: pin.titulo,
                descripcion: pin.descripcion,
                rating: pin.rating,
              },
              creador: usuariosValidos[0] || { userFullName: "Desconocido" },
            };
          })
        );
        console.log("Pines con usuarios:", pinesConUsuarios);  
        setPins(pinesConUsuarios);
      } catch (error) {
        console.error("Error al cargar los pines:", error);
      }
    };

    cargarPinesConUsuarios();
    cargarUsuario();
  }, []);

  const defaultRegion = {
    latitude: -12.0464,
    longitude: -77.0428,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  
  useEffect(() => {
    if (pins.length > 0 && mapRef.current) {
      const coordinates = pins.map((p) => ({
        latitude: p.pin.latitude,
        longitude: p.pin.longitude,
      })).filter(coord => 
        coord.latitude >= -90 && coord.latitude <= 90 && 
        coord.longitude >= -180 && coord.longitude <= 180
      );
  
      if (coordinates.length > 0) {
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      } else {
        mapRef.current.animateToRegion(defaultRegion, 1000);  // Ajustar la región al valor por defecto
      }
    }
  }, [pins]);
  
  
  

  const handleSubmit = async () => {
    console.log("Guardando pin...");
    console.log("user", userId);
    console.log("newPlace", newPlace);
    if (!userId || !newPlace) {
      console.error("Usuario no autenticado o ubicación no establecida.");
      return;
    }

    const newPin: PinCreate = {
      userids: [userId],
      titulo: title || "Sin título",
      descripcion: desc || "Sin descripción",
      rating: star,
      ratingTotal: star,
      ratingCount: 1,
      latitude: newPlace.lat,
      longitude: newPlace.lng,
    };
    console.log("Nuevo pin:", newPin);  
    try {
      const createdPin = await guardarPin(newPin);
      setPins((prev) => [
        ...prev,
        {
          pin: {
            id: createdPin._id,
            latitude: createdPin.latitude,
            longitude: createdPin.longitude,
            titulo: createdPin.titulo,
            descripcion: createdPin.descripcion,
            rating: createdPin.rating,
          },
          creador: { userFullName: user.userName || "Desconocido" },
        },
      ]);
      setNewPlace(null);
      setTitle("");
      setDesc("");
      setStar(0);
      setModalVisible(false); 
    } catch (error) {
      console.error("Error al guardar el pin:", error);
    }
  };

  const handleMarkerPress = (pin: PinWithUser) => {
    setSelectedPin(pin);
    setNewPlace(null); 
  };

  const handleVerMasDetalle = () => {
    if (selectedPin) {
      console.log("selectedPin", selectedPin);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -12.0464,
          longitude: -77.0428,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          setNewPlace({ lat: latitude, lng: longitude });
          setSelectedPin(null); 
        }}
      >
        {pins.length > 0 ? (
        pins.map((p) => {
    if (!p.pin.latitude || !p.pin.longitude) {
      console.error("Coordenadas inválidas para el pin", p);
      return null;
    }
    console.log("Renderizando marcador para:", p); 
    return (
      <Marker
        key={p.pin.id}
        coordinate={{
          latitude: p.pin.latitude,
          longitude: p.pin.longitude,
        }}
        onPress={() => handleMarkerPress(p)}
      >
        <Icon name="map-marker" size={50} color="red" />
      </Marker>
    );
  })
) : (
  <Text>No hay pines disponibles</Text>
)}

      </MapView>

      {/* Modal de creación de pin */}
      {newPlace && (
        <Modal
          visible={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setNewPlace(null)} style={styles.closeButton}>
              <Text style={styles.closeText}>✖</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={desc}
              onChangeText={setDesc}
            />
            <TextInput
              style={styles.input}
              placeholder="Rating (1-5)"
              keyboardType="numeric"
              value={star.toString()}
              onChangeText={(text) => setStar(Number(text))}
            />
            <Button title="Save Pin" onPress={handleSubmit} />
          </View>
        </Modal>
      )}

      {selectedPin && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>{selectedPin.pin.titulo}</Text>
          <Text>{selectedPin.pin.descripcion}</Text>
          <Text>{"⭐".repeat(selectedPin.pin.rating)}</Text>
          <Text>Created by: {selectedPin.creador.userFullName}</Text>
          <Button title="Ver más detalles" onPress={handleVerMasDetalle} />
          <TouchableOpacity onPress={() => setSelectedPin(null)} style={styles.closeButton}>
            <Text style={styles.closeText}>✖</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  closeText: {
    fontSize: 30,
  },
  detailsContainer: {
    padding: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Mapa;