import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Usa localhost para pruebas locales
const BACKEND_URL_REQUESTS = "http://192.168.45.64:8080/api/friendship-requests";

export const sendFriendRequest = async (senderId: number, receiverId: number) => {
  try {
    console.log("sender", senderId);
    const response = await axios.post(`${BACKEND_URL_REQUESTS}/${senderId}/${receiverId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al enviar solicitud de amistad:", error);
    return error.response?.data;
  }
};

export const respondToFriendRequest = async (requestId: number, accept: boolean) => {
  try {
    console.log("requestId", requestId);
    const response = await axios.put(`${BACKEND_URL_REQUESTS}/${requestId}/respond`, null, {
      params: { accept },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al responder la solicitud de amistad:", error);
    return error.response?.data;
  }
};

export const getReceivedRequests = async (receiverId: number) => {
  try {
    console.log("receiver obteniendo", receiverId);
    const response = await axios.get(`${BACKEND_URL_REQUESTS}/received/${receiverId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener las solicitudes de amistad recibidas:", error);
    return error.response?.data;
  }
};

export const getSentRequests = async (senderId: number) => {
  try {
    console.log("sender", senderId);
    const response = await axios.get(`${BACKEND_URL_REQUESTS}/send/${senderId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener las solicitudes de amistad enviadas:", error);
    return error.response?.data;
  }
};

export const cancelSentRequest = async (requestId: number) => {
  try {
    console.log("requestId", requestId);
    const response = await axios.delete(`${BACKEND_URL_REQUESTS}/cancel/${requestId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al cancelar la solicitud de amistad enviada:", error);
    return error.response?.data;
  }
};

export const deleteReceivedRequest = async (requestId: number) => {
  try {
    console.log("requestId", requestId);
    const response = await axios.delete(`${BACKEND_URL_REQUESTS}/delete/${requestId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al eliminar la solicitud de amistad recibida:", error);
    return error.response?.data;
  }
};

export const getRequestStatus = async (senderId: number, receiverId: number) => {
  try {
    console.log("sender", senderId);
    const response = await axios.get(`${BACKEND_URL_REQUESTS}/status/${senderId}/${receiverId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener el estado de la solicitud de amistad:", error);
    return error.response?.data;
  }
};