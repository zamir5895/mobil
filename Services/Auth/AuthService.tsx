import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BACKEND_URL_AUTH = "http://192.168.223.64:8080/api"; 

export const registerUser = async (userName: string, primerNombre: string, segundoNombre: string, primerApellido: string, segundoApellido: string, edad: number, email:string, password:string, phoneNumber:string, role:string) => {
    try {
        console.log("Registrando usuario...");
        console.log("Datos del usuario:", userName, primerNombre, segundoNombre, primerApellido, segundoApellido, edad, email, password, role);
        const response = await axios.post(`${BACKEND_URL_AUTH}/auth/register`, {
            userName,
            primerNombre,
            segundoNombre,
            primerApellido,
            segundoApellido,
            edad,
            email,
            password,
            role
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
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
    
        if (userId) {
      const userIdInt = parseInt(userId); 
            console.log("Registrando información personal...", userIdInt);
            console.log("datos", dateOfBirth , gender, direccion, pais, ciudad, latitude, longitude, telefono);
      const response = await axios.patch(`${BACKEND_URL_AUTH}/auth/personalInformation/${userIdInt}`, {
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
        console.log("Iniciando sesión...");
        console.log("data", email, password);
        const response = await axios.post(`${BACKEND_URL_AUTH}/auth/login`, {
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


export const logout = async () => {
    try {
        const response = await axios.post(`${BACKEND_URL_AUTH}/auth/logout`, {}, {
            headers: {
                Authorization: `Bearer ${await SecureStore.getItemAsync('token')}`
            }
        });
        console.log("Respuesta del backend:", response.data);

        await SecureStore.deleteItemAsync('userId');
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('role');
        console.log("Sesión cerrada");

    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};

export const autentificar = async ( )=>{
    try {
        const response = await axios.get(`${BACKEND_URL_AUTH}/auth/authentication`, {
            headers: {
                Authorization: `Bearer ${await SecureStore.getItemAsync('token')}`
            }
        });
        console.log("Respuesta del backend:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al autentificar:", error);
    }
}



export const profile = async (descripcion: string, foto: { uri: string, name: string, type: string }, userId: number) => {
    try {
        const formData = new FormData();
        formData.append("descripcion", descripcion);

        // Verificar que la URI sea accesible
        const response = await fetch(foto.uri);
        const fileBlob = await response.blob(); // Convertir la URI en un Blob

        // Agregar el archivo al FormData con el nombre y tipo
        formData.append("file", fileBlob, foto.name); // El nombre del archivo también es importante

        // Verificar si los datos están siendo enviados correctamente
        console.log("Enviando datos...");
        console.log("Descripción:", descripcion);
        console.log("Archivo:", foto.uri, foto.name, foto.type);

        // No especificar Content-Type, ya que FormData se encarga de ello
        const responseBackend = await axios.patch(`http://192.168.223.64:8080/api/auth/profile/${userId}`, formData);

        console.log("Respuesta Backend:", responseBackend);

        return responseBackend;
    } catch (error) {
        console.error("Error al actualizar el perfil:", error);
    }
};
