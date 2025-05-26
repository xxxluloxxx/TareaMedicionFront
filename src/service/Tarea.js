import axios from 'axios';
import API_CONFIG from '../config/api.config';

export const TareaService = {
    async getLast() {
        try {
            const response = await axios.get(API_CONFIG.getUrl('TAREAS'));
            return response.data;
        } catch (error) {
            console.error('Error al obtener tareas:', error);
            throw error;
        }
    },
    async getAll() {
        try {
            const response = await axios.get(API_CONFIG.getUrl('EMG'));
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error al obtener tareas:', error);
            throw error;
        }
    }
};
