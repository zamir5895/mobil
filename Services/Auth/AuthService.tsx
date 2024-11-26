import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Usa localhost para pruebas locales
const BACKEND_URL = "http://192.168.45.64:8080/api"; // Asegúrate de que tu servidor está corriendo en esta dirección

export const registerUser = async (userName: string, primerNombre: string, SegundoNombre: string, primerApellido: string, segundoApellido: string, edad: number, email:string, password:string, phoneNumber:string, role:string) => {
    try {
        console.log("Registrando usuario...");
        console.log("Datos del usuario:", userName, primerNombre, SegundoNombre, primerApellido, segundoApellido, edad, email, password, phoneNumber, role);
        const response = await axios.post(`${BACKEND_URL}/auth/register`, {
            userName,
            primerNombre,
            segundoNombre: 
            primerApellido,
            segundoApellido,
            edad,
            email,
            password,
            phoneNumber,
            role
        });
     

        console.log("Respuesta del backend:", response.data);
        return response.data;
    } catch (error) {
        const err = error as any;
        console.error("Error en el registro:", err.response ? err.response.data : err.message);
        return (error as any).response ? (error as any).response.data : { message: "Error desconocido" };
    }
};

export const registerPersonalInformation = async (dateOfBirth:Date, gender:string, direccion:string, pais:string, ciudad:string, latitude:number, longitude:number, telefono:string) => {
    try {
        const userId = await SecureStore.getItemAsync('userId');
    
    // Asegúrate de que userId existe y convertirlo a int
        if (userId) {
      const userIdInt = parseInt(userId); 
            console.log("Registrando información personal...", userIdInt);
            console.log("datos", dateOfBirth , gender, direccion, pais, ciudad, latitude, longitude, telefono);
      const response = await axios.post(`${BACKEND_URL}/auth/personalInformation/${userIdInt}`, {
        dateOfBirth,
            gender,
            direccion,
            pais,
            ciudad,
            latitude,
            longitude,
            telefono
        });
        console.log("Respuesta del backend:", response.data);
    }
    } catch (error) {
            const err = error as any;
            console.error("Error en el registro de información personal:", err.response ? err.response.data : err.message);
            return (error as any).response ? (error as any).response.data : { message: "Error desconocido" };

    }
}


export const loginUserInformatio = async (email:string, password:string) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/auth/login`, {
            email,
            password
        });
        console.log("Respuesta del backend:", response.data);
        return response.data;
    } catch (error) {
        const err = error as any;
        console.error("Error en el inicio de sesión:", err.response ? err.response.data : err.message);
        return (error as any).response ? (error as any).response.data : { message: "Error desconocido" };
    }
}


