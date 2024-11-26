import axios from 'axios';

export const axiosChatInstance = axios.create({
  baseURL: "http://localhost:8080/api/chat",
});

export const axiosAmigosInstance = axios.create({
  baseURL: "http://localhost:8080/api/amigos",
});

export const axiosAuthInstance = axios.create({
    baseURL: "http://localhost:8080/api/auth",
    headers: {
        'Content-Type': 'application/json'  
    }
});


export const axiosFriendRequestInstance = axios.create({
    baseURL: "http://localhost:8080/api/friendship-requests",
});

export const axiosUserInstance = axios.create({
    baseURL: "http://localhost:8080/api/user",
});

export const axiosMensajesInstance = axios.create({
    baseURL: "http://localhost:2500/api/messages",
    headers: {
        "Content-Type": "application/json",
    },
});

export const axiosComentariosInstance = axios.create({
    baseURL: "http://localhost:8085/api/comentarios",
});

export const axiosPublicacionesInstance = axios.create({
    baseURL: "http://localhost:8085/api/publicacionInicio",
});

export const axiosLikesInstance = axios.create({
    baseURL: "http://localhost:8085/api/likes",
});
