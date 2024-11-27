import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import { NavigationProp } from '@react-navigation/native';
import { registerPersonalInformation } from '@/Services/Auth/AuthService';
import * as SecureStore from 'expo-secure-store';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
    navigation: NavigationProp<any>;
};

export default function RegisterScreen2({ navigation }: Props) {
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
    const [gender, setGender] = useState('Male');
    const [direccion, setDireccion] = useState('');
    const [pais, setPais] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [telefono, setTelefono] = useState('');
    const [locationPermission, setLocationPermission] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const getLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Error', 'Permiso de ubicación denegado');
                return;
            }
            setLocationPermission(true);
            let location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);
            console.log('Ubicación actual:', latitude, longitude);
        };
        getLocationPermission();
    }, []);

    const handleRegister = async () => {
        if (!dateOfBirth || !gender || !direccion || !pais || !ciudad || !latitude || !longitude || !telefono) {
            Alert.alert('Error', 'Por favor complete todos los campos');
            return;
        }
    

        try {
            const response = await registerPersonalInformation(
                dateOfBirth,
                gender,
                direccion,
                pais,
                ciudad,
                latitude,
                longitude,
                telefono
            );
            Alert.alert('Éxito', 'Registro exitoso');
            navigation.navigate('uploadPerfil');
         
        } catch {
            Alert.alert('Error', 'Hubo un error al registrar la información');
        }
    };

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(currentDate);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Registro</Text>

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                    style={styles.input}
                    placeholder="Selecciona tu fecha de nacimiento"
                    value={dateOfBirth ? dateOfBirth.toDateString() : ''}
                    editable={false}
                />
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={dateOfBirth || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Género</Text>
                <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue) => setGender(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Masculino" value="Male" />
                    <Picker.Item label="Femenino" value="Female" />
                    <Picker.Item label="Otro" value="Other" />
                </Picker>
            </View>

            {/* Dirección */}
            <TextInput
                style={styles.input}
                placeholder="Dirección"
                value={direccion}
                onChangeText={setDireccion}
            />

            {/* País */}
            <TextInput
                style={styles.input}
                placeholder="País"
                value={pais}
                onChangeText={setPais}
            />

            {/* Ciudad */}
            <TextInput
                style={styles.input}
                placeholder="Ciudad"
                value={ciudad}
                onChangeText={setCiudad}
            />

            <Text style={styles.text}>Selecciona tu ubicación:</Text>
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: latitude || 37.78825,
                        longitude: longitude || -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onPress={(e) => {
                        setLatitude(e.nativeEvent.coordinate.latitude);
                        setLongitude(e.nativeEvent.coordinate.longitude);
                    }}
                >
                    {latitude && longitude && (
                        <Marker coordinate={{ latitude, longitude }} />
                    )}
                </MapView>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
            />

            <Button title="Registrar" onPress={handleRegister} color="#007bff" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    pickerContainer: {
        width: '100%',
        marginBottom: 15,
    },
    pickerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    picker: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9',
    },
    mapContainer: {
        width: '100%',
        height: 250,
        marginBottom: 20,
    },
    map: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
});
