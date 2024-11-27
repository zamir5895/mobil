import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { getProfile } from "@/Services/User/UserService";
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

// Definir la interfaz de usuario (con valores por defecto en caso de que no llegue la información)
interface User {
    id: number;
    username: string;
    pNombre: string;
    sNombre: string;
    pApellido: string;
    sApellido: string;
    email: string;
    fotoUrl: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    descripcion: string;
    fechaNacimiento: string;
    genero: string;
    pais: string;
    rol: string;
    fechaCreacion: string;
    latitud?: number; // Latitud opcional
    longitud?: number; // Longitud opcional
}

const TabInformationUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    const fetchUsrInformation = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            console.log("Token:", token);
            if (token) {
                const id = parseInt(token);
                const response = await getProfile(token);
                console.log("Respuesta del backend:", response);
                setUser(response);  
                setLoading(false);
            }
        } catch (error) {
            console.error("Error al obtener la información del usuario:", error);
            setLoading(false);  
        }
    };

    useEffect(() => {
        fetchUsrInformation();
    }, []);

    const fetchLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            }
        } catch (error) {
            console.error("Error al obtener la ubicación:", error);
        }
    };

    useEffect(() => {
        fetchLocation();  
    }, []);

    if (loading) {
        return <Text>Cargando...</Text>;
    }

    const defaultUserInfo: User = {
        id: 0,
        username: "Usuario",
        pNombre: "Primer Nombre",
        sNombre: "Segundo Nombre",
        pApellido: "Primer Apellido",
        sApellido: "Segundo Apellido",
        email: "usuario@ejemplo.com",
        fotoUrl: "https://via.placeholder.com/150",
        telefono: "000000000",
        direccion: "Dirección no disponible",
        ciudad: "Ciudad no disponible",
        descripcion: "Sin descripción",
        fechaNacimiento: "2000-01-01",
        genero: "No especificado",
        pais: "No especificado",
        rol: "Usuario",
        fechaCreacion: "2024-01-01",
        latitud: 0.0,  // Valores por defecto
        longitud: 0.0, // Valores por defecto
    };

    const currentUser = user || defaultUserInfo;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Información del Usuario</Text>
            <Text>Nombre: {currentUser.pNombre} {currentUser.sNombre}</Text>
            <Text>Apellidos: {currentUser.pApellido} {currentUser.sApellido}</Text>
            <Text>Email: {currentUser.email}</Text>
            <Text>Teléfono: {currentUser.telefono}</Text>
            <Text>Dirección: {currentUser.direccion}</Text>
            <Text>Ciudad: {currentUser.ciudad}</Text>
            <Text>Descripción: {currentUser.descripcion}</Text>
            <Text>Fecha de Nacimiento: {currentUser.fechaNacimiento}</Text>
            <Text>Género: {currentUser.genero}</Text>
            <Text>País: {currentUser.pais}</Text>

            {currentUser.latitud && currentUser.longitud ? (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: currentUser.latitud,
                        longitude: currentUser.longitud,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker coordinate={{ latitude: currentUser.latitud, longitude: currentUser.longitud }} />
                </MapView>
            ) : (
                <Text>No se pudo obtener la ubicación</Text>
            )}

            <Button title="Editar Información Personal" onPress={() => handleEditPersonalInfo()} />
            <Button title="Editar Ubicación" onPress={() => handleEditLocation()} />
            <Button title="Editar Descripción" onPress={() => handleEditDescription()} />
        </View>
    );

    const handleEditPersonalInfo = () => {
        console.log('Editar información personal');
    };

    const handleEditLocation = () => {
        console.log('Editar ubicación');
    };

    const handleEditDescription = () => {
        console.log('Editar descripción');
    };
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    map: {
        width: '100%',
        height: 200,
        marginTop: 20,
    },
});

export default TabInformationUser;
