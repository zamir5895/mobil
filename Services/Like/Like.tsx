import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BACKEND_URL_LIKE = "http://192.168.1.17:8085/api";

interface LikeResponseDTO {
  id: number;
  usuarioLikeId: number;
  publicacionId: number;
  fechaLike: string;
}

export const postLike = async (publicacionInicioId: number, usuarioLikeId: number) => {
  try {
    const response = await axios.post(`${BACKEND_URL_LIKE}/likes/${publicacionInicioId}/${usuarioLikeId}`);
    return response.data;
  } catch (error) {
    console.error('Error al dar like:', error);
    throw error;
  }
};

export const getLikeById = async (likeId: number) => {
  try {
    const response = await axios.get(`${BACKEND_URL_LIKE}/likes/${likeId}`);
    console.log("respuesta, ", response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener like por ID:', error);
    throw error;
  }
};

export const deleteLike = async (likeId: number, usuarioId: number) => {
  try {
    console.log("datos", usuarioId, " ", likeId);
    const response = await axios.delete(`${BACKEND_URL_LIKE}/likes/${likeId}/${usuarioId}`);
    console.log("respuesta, ", response.data);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar like:', error);
    throw error;
  }
};

export const getLikesByPublicacion = async (publicacionInicioId: number) => {
  try {
    const response = await axios.get(`${BACKEND_URL_LIKE}/likes/publicacion/${publicacionInicioId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener likes por publicación:', error);
    throw error;
  }
};

export const getLikesByDateRange = async (inicio: string, fin: string) => {
  try {
    const response = await axios.get(`${BACKEND_URL_LIKE}/likes/fecha`, {
      params: { inicio, fin },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener likes por rango de fechas:', error);
    throw error;
  }
};

export const existsLikeByUserToPost = async (publicacionId: number, userId: number) => {
  try {
    const response = await axios.get(`${BACKEND_URL_LIKE}/likes/${publicacionId}/likes/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al verificar si existe like del usuario a la publicación:', error);
    throw error;
  }
};