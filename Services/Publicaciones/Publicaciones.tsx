import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BACKEND_URL_PUBLICACIONES = "http://192.168.1.17:8085/api/publicacionInicio";

interface PostInicioDTO {
  cuerpo: string;
  autorPId: number;
}

interface MultimediaInicioDTO {
  id: string;
  contenidoUrl: string;
  tipo: string;
  fechaCreacion: string;
}

interface PublicacionInicioResponseDTO {
  id: number;
  contenido: string;
  cantidadLikes: number;
  cantidadComentarios: number;
  fechaPublicacion: string;
  autorId: number;
  multimedia: MultimediaInicioDTO[];
}

interface AmigosDTO {
  usersId: number[];
}

export const crearPublicacionInicio = async (postInicioDTO: PostInicioDTO) => {
  try {
    console.log("Datos enviados:", postInicioDTO);
    if(postInicioDTO.autorPId === 0){
      const userId = await SecureStore.getItemAsync('userId');
      postInicioDTO.autorPId = parseInt(userId || '');
    }

    if(postInicioDTO.autorPId === 0){
      console.error('Error al obtener el usuario');
      throw new Error('Error al obtener el usuario');
    }

    const response = await axios.post(`${BACKEND_URL_PUBLICACIONES}/`, postInicioDTO, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("Publicación creada con éxito:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear la publicación:', error);
    throw error;
  }
};


export const subirArchivos = async (postId: number, files: any[]) => {
  console.log("Archivos enviados:", files);
  console.log("postId:", postId);

  const formData = new FormData();

  files.forEach((file) => {
    const fileUri = file.uri;
    const fileType = file.mimeType || "image/jpeg"; 
    const fileName = file.fileName || `image-${new Date().getTime()}.jpg`; 
    
    const fileBlob = {
      uri: fileUri,
      type: fileType,
      name: fileName,
    } as any;
    formData.append('files', fileBlob);
  });

  try {
    const response = await axios.post(
      `${BACKEND_URL_PUBLICACIONES}/subir-archivos/${postId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al subir los archivos:", error.message);
      console.error("Detalles del error:", error.response?.data);
    } else {
      console.error("Error desconocido al subir los archivos:", error);
    }
    throw error;
  }
};



export const obtenerPublicacionInicio = async (publicacionId: number) => {
  try {
    const response = await axios.get(`${BACKEND_URL_PUBLICACIONES}/${publicacionId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la publicación:', error);
    throw error;
  }
};

export const eliminarPublicacion = async (publicacionId: number) => {
  try {
    const response = await axios.delete(`${BACKEND_URL_PUBLICACIONES}/${publicacionId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la publicación:', error);
    throw error;
  }
};

export const obtenerPublicacionesUsuario = async (usuarioId: number, page: number, size: number) => {
  try {
    const response = await axios.get(`${BACKEND_URL_PUBLICACIONES}/usuario/${usuarioId}`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las publicaciones del usuario:', error);
    throw error;
  }
};

export const cambiarContenido = async (usuarioId: number, publicacionId: number, contenido: string) => {
  try {
    const response = await axios.patch(`${BACKEND_URL_PUBLICACIONES}/${usuarioId}/${publicacionId}/contenido`, null, {
      params: { contenido },
    });
    return response.data;
  } catch (error) {
    console.error('Error al cambiar el contenido de la publicación:', error);
    throw error;
  }
};

export const cambiarMultimedia = async (usuarioId: number, publicacionId: number, multimedia: File[]) => {
  try {
    const formData = new FormData();
    multimedia.forEach((file) => formData.append('file', file));

    const response = await axios.patch(`${BACKEND_URL_PUBLICACIONES}/${usuarioId}/${publicacionId}/multimedia`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al cambiar la multimedia de la publicación:', error);
    throw error;
  }
};

export const buscarPublicaciones = async (palabraClave: string, page: number, size: number) => {
  try {
    const response = await axios.get(`${BACKEND_URL_PUBLICACIONES}/buscar`, {
      params: { palabraClave, page, size },
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar publicaciones:', error);
    throw error;
  }
};

export const obtenerPublicacionesInicio = async (page: number, size: number) => {
  try {
    const response = await axios.get(`${BACKEND_URL_PUBLICACIONES}`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las publicaciones de inicio:', error);
    throw error;
  }
};

export const obtenerPublicaciones = async (amigosDTO: AmigosDTO, page: number, size: number) => {
  try {
    const response = await axios.get(`${BACKEND_URL_PUBLICACIONES}/feed/publicaciones/`, {
      params: { ...amigosDTO, page, size },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las publicaciones:', error);
    throw error;
  }
};