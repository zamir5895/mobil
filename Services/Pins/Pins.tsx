import axios from 'axios';

const BACKEND_URL_PINS = 'http://192.168.31.64:4000/api/pins/';

export interface Pin {
    _id: string;
    userids: number[];
    titulo: string;
    descripcion: string;
    rating: number;
    ratingTotal: number;
    ratingCount: number;
    latitude: number;
    longitude: number;
    createdAt: string;
  }
  
  export interface PinCreate {
    userids: number[];
    titulo: string;
    descripcion: string;
    rating: number;
    ratingTotal: number;
    ratingCount: number;
    latitude: number;
    longitude: number;
  }

export const guardarPin = async(pin: PinCreate) => {
    try {
        console.log("pin", pin);
        const response = await axios.post(`${BACKEND_URL_PINS}`, pin, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al guardar pin:', error);
        throw error;
    }
}

export const obtenerPines = async() => {    
    try {
        const response = await axios.get(`${BACKEND_URL_PINS}`);
        console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener pines:', error);
        throw error;
    }
}

export const eliminarPin = async(id: string) => {
    try {
        const response = await axios.delete(`${BACKEND_URL_PINS}${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar pin:', error);
        throw error;
    }
}


export const obtenerPinPorId = async(id: string) => {
    try {
        const response = await axios.get(`${BACKEND_URL_PINS}${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener pin por id:', error);
        throw error;
    }
}


export const editarRating = async(data:any) => {
    try{
        console.log("data", data);
        const response = await axios.patch(`${BACKEND_URL_PINS}${data.id}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }catch(error){
        console.error('Error al editar rating:', error);
        throw error;
    }
}

export const editarInformacion = async(data:any) => {
    try{
        console.log("data", data);
        const response = await axios.patch(`${BACKEND_URL_PINS}${data.id}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }catch(error){
        console.error('Error al editar información:', error);
        throw error;
    }
}

export const obtenerTodosLosVisitantes = async(id: string) => {
    try {
        const response = await axios.get(`${BACKEND_URL_PINS}${id}/visitantes`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener visitantes:', error);
        throw error;
    }
}

export const agregarVisitante = async(id:string, userId:number) => {
    try{
        const response = await axios.post(`${BACKEND_URL_PINS}visitantes`, {userId}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }catch(error){
        console.error('Error al agregar visitante:', error);
        throw error;
    }

}

export const editarTitulo = async(data:any) => {
    try{
        console.log("data", data);
        const response = await axios.patch(`${BACKEND_URL_PINS}${data.id}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }catch(error){
        console.error('Error al editar título:', error);
        throw error;
    }
}

export const getPinPorPalabra = async(palabra: string) => {
    try{
        const response = await axios.get(`${BACKEND_URL_PINS}buscar/${palabra}`);
        return response.data;

    }catch(error){
        console.error('Error al buscar pin por palabra:', error);
        throw error;
    }
}
