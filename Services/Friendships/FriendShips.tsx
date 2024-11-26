import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Usa localhost para pruebas locales
const BACKEND_URL_FRIENDSHIPS = "http://192.168.45.64:8080/api";

export const blockearAmigo = async (amistadId: number, usuarioId: number, pAmigoId: number) => {
  try {
    const response = await axios.patch(`${BACKEND_URL_FRIENDSHIPS}/friendships/bloquear/${amistadId}/${usuarioId}/${pAmigoId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al bloquear amigo:", error);
    return error.response?.data;
  }
};

export const unblockAmigo = async (amistadId: number, usuarioId: number, pAmigoId: number) => {
  try {
    const response = await axios.patch(`${BACKEND_URL_FRIENDSHIPS}/friendships/unblock/${amistadId}/${usuarioId}/${pAmigoId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al desbloquear amigo:", error);
    return error.response?.data;
  }
};

export const mostraramigosNoblockeados = async (usuarioId: number, page: number, size: number) => {
  try {
    const response = await axios.get(`${BACKEND_URL_FRIENDSHIPS}/friendships/${usuarioId}`, {
      params: { page, size }
    });
    console.log("response.data", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener amigos no bloqueados:", error);
    return error.response?.data;
  }
};

export const mostraramigosBlockeados = async (usuarioId: number, page: number, size: number) => {
  try {
    const response = await axios.get(`${BACKEND_URL_FRIENDSHIPS}/friendships/bloqueados/${usuarioId}`, {
      params: { page, size }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener amigos bloqueados:", error);
    return error.response?.data;
  }
};

export const getAllFriendships = async (usuarioId: number, page: number = 0, size: number = 10) => {
  try {
    const response = await axios.get(`${BACKEND_URL_FRIENDSHIPS}/friendships/${usuarioId}/all`, {
      params: { page, size }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener todas las amistades:", error);
    return error.response?.data;
  }
};

export const deleteFriendship = async (amistadId: number) => {
  try {
    const response = await axios.delete(`${BACKEND_URL_FRIENDSHIPS}/friendships/${amistadId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al eliminar la amistad:", error);
    return error.response?.data;
  }
};

export const getFriendshipDetails = async (amistadId: number): Promise<any | string> => {
  try {
    const response = await axios.get(`${BACKEND_URL_FRIENDSHIPS}/friendships/details/${amistadId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener detalles de la amistad:", error);
    return error.response?.data;
  }
};

export const getFriends = async (userId: number) => {
  console.log("entro a getFriends con el userid", userId);
  try {
    console.log("userId:", userId);
    const response = await axios.get(`${BACKEND_URL_FRIENDSHIPS}/friendships/${userId}/friends`);
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener los amigos:", error);
    return error.response?.data;
  }
};

export const getTotalFriends = async (userId: number) => {
  try {
    const response = await axios.get(`${BACKEND_URL_FRIENDSHIPS}/friendships/totalAmigos/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener el número total de amigos:", error);
    return error.response?.data;
  }
};

export const getTotalBlockedFriends = async (userId: number) => {
  try {
    const response = await axios.get(`${BACKEND_URL_FRIENDSHIPS}/friendships/totalBloqueados/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener el número total de amigos bloqueados:", error);
    return error.response?.data;
  }
};

export const searchFriends = async (token: string, searchTerm: string) => {
  try {
    const response = await axios.get(`${BACKEND_URL_FRIENDSHIPS}/friendships/search?query=${searchTerm}`, {
      headers: { "Authorization": `${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al buscar amigos:", error);
    return error.response?.data;
  }
};

export const getTotalNonBlockedFriends = async (userId: number) => {
  try {
    console.log("userId", userId);
    const response = await axios.get(`${BACKEND_URL_FRIENDSHIPS}/friendships/totalNoBloqueado/${userId}`);
    console.log("response.data", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener el número total de amigos no bloqueados:", error);
    return error.response?.data;
  }
};

export const areFriends = async (userId: number, token: string) => {
  try {
    const response = await axios.get(`${BACKEND_URL_FRIENDSHIPS}/friendships/myfriend/${userId}`, {
      headers: { "Authorization": `${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al verificar si son amigos:", error);
    return error.response?.data;
  }
};