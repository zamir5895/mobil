import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BACKEND_URL_COMMENT = "http://192.168.1.17:8085/api/comentarios";

interface ComentarioDto {
  message: string;
  autorId: number;
}

interface CambioContenidoDTO {
  contenido: string;
}

export const agregarComentario = async (publicacionId: number, comentarioDTO: ComentarioDto) => {
  try {
    console.log("Datos enviados:", comentarioDTO);
    const response = await axios.post(`${BACKEND_URL_COMMENT}/${publicacionId}`, comentarioDTO, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    throw error;
  }
};

export const agregarMultimedia = async (comentarioId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${BACKEND_URL_COMMENT}/${comentarioId}/multimedia`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al agregar multimedia:', error);
    throw error;
  }
};

export const agregarRespuesta = async (publicacionId: number, parentId: number, comentarioDTO: ComentarioDto, multimedia?: File) => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(comentarioDTO));
  if (multimedia) {
    formData.append('file', multimedia);
  }

  try {
    const response = await axios.post(`${BACKEND_URL_COMMENT}/${publicacionId}/comentario/${parentId}/respuestas`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al agregar respuesta:', error);
    throw error;
  }
};

export const getComentario = async (publicacionId: number, page: number, size: number) => {
  try {
    console.log("Datos enviados:", publicacionId, page, size);
    const response = await axios.get(`${BACKEND_URL_COMMENT}/${publicacionId}/comentario`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    throw error;
  }
};

export const getRespuestas = async (publicacionId: number, parentId: number, page: number, size: number) => {
  try {
    const response = await axios.get(`${BACKEND_URL_COMMENT}/${publicacionId}/comentario/${parentId}/respuestas`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener respuestas:', error);
    throw error;
  }
};

export const eliminarComentario = async (publicacionID: number, comentarioId: number) => {
  try {
    const response = await axios.delete(`${BACKEND_URL_COMMENT}/comentarios/${publicacionID}/comentario/${comentarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    throw error;
  }
};

export const eliminarRespuesta = async (publicacionID: number, parentID: number, comentarioId: number) => {
  try {
    const response = await axios.delete(`${BACKEND_URL_COMMENT}/comentarios/${publicacionID}/comentario/${parentID}/respuestas/${comentarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar respuesta:', error);
    throw error;
  }
};

export const actualizarComentario = async (publicacionId: number, comentarioId: number, cambioContenidoDTO: CambioContenidoDTO) => {
  try {
    const response = await axios.patch(`${BACKEND_URL_COMMENT}/comentarios/${publicacionId}/comentario/${comentarioId}`, cambioContenidoDTO);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar comentario:', error);
    throw error;
  }
};

export const actualizarComentarioRespuesta = async (publicacionId: number, parentID: number, comentarioId: number, cambioContenidoDTO: CambioContenidoDTO) => {
  try {
    const response = await axios.patch(`${BACKEND_URL_COMMENT}/comentarios/${publicacionId}/comentario/${parentID}/respuestas/${comentarioId}`, cambioContenidoDTO);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar respuesta:', error);
    throw error;
  }
};

export const actualizarComentarioLikes = async (publicacionId: number, comentarioId: number) => {
  try {
    const response = await axios.patch(`${BACKEND_URL_COMMENT}/comentarios/${publicacionId}/comentario/likes/${comentarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar likes del comentario:', error);
    throw error;
  }
};

export const actualizarComentarioRespuestaLikes = async (publicacionId: number, parentID: number, comentarioId: number) => {
  try {
    const response = await axios.patch(`${BACKEND_URL_COMMENT}/comentarios/${publicacionId}/comentario/${parentID}/respuestas/likes/${comentarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar likes de la respuesta:', error);
    throw error;
  }
};

export const eliminarComentarioMultimedia = async (comentarioId: number, multimediaId: string) => {
  try {
    const response = await axios.delete(`${BACKEND_URL_COMMENT}/comentarios/${comentarioId}/multimedia/${multimediaId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar multimedia del comentario:', error);
    throw error;
  }
};

export const obtenerMultimedia = async (comentarioId: number, multimediaId: string) => {
  try {
    const response = await axios.get(`${BACKEND_URL_COMMENT}/comentarios/${comentarioId}/multimedia/${multimediaId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener multimedia:', error);
    throw error;
  }
};

export const modificarArchivo = async (comentarioId: number, multimediaId: string, multimediaDTO: File) => {
  const formData = new FormData();
  formData.append('multimediaDTO', multimediaDTO);

  try {
    const response = await axios.patch(`${BACKEND_URL_COMMENT}/comentarios/${comentarioId}/multimedia/${multimediaId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al modificar archivo multimedia:', error);
    throw error;
  }
};