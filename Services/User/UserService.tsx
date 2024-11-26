import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BACKEND_URL_USER = "http://192.168.45.26:8080/api/user";

interface UpdateUserNameAndProfileDTO {
  nombre: string;
}

interface UpdateUserDTO {
  nombre: string;
}

axios.defaults.baseURL = BACKEND_URL_USER;

export const getProfile = async (token: string) => {
  try {
    const response = await axios.get('/perfilMasInformacion', {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener el perfil del usuario:", error);
    return error.response?.data;
  }
};

export const searchUser = async (token: string, query: string) => {
  try {
    const response = await axios.get(`/${query}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al buscar usuarios:", error);
    return error.response?.data;
  }
};

export const updateProfile = async (
  token: string,
  update: UpdateUserNameAndProfileDTO,
  foto: File
) => {
  try {
    const formData = new FormData();
    formData.append('Data', JSON.stringify(update));
    formData.append('file', foto);

    const response = await axios.put('/update', formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al actualizar el perfil:", error);
    return error.response?.data;
  }
};

export const obtenerPequeñaInfo = async (userId: number) => {
  try {
    const response = await axios.get(`/perfil/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener información del usuario:", error);
    return error.response?.data;
  }
};

export const getUserById = async (userId: number) => {
  try {
    const response = await axios.get(`/findById/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener el usuario por ID:", error);
    return error.response?.data;
  }
};

export const deleteUser = async (token: string) => {
  try {
    const response = await axios.delete('/delete', {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al eliminar el usuario:", error);
    return error.response?.data;
  }
};

export const updatePersonalInformation = async (
  token: string,
  update: UpdateUserDTO
) => {
  try {
    const response = await axios.patch('/profile/informacionPersonal', update, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al actualizar la información personal:", error);
    return error.response?.data;
  }
};

export const getDireccionInformation = async (userId: number) => {
  try {
    const response = await axios.get(`/direccion/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener la dirección del usuario:", error);
    return error.response?.data;
  }
};