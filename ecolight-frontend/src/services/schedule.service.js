import axios from 'axios';
import { getToken } from '../utils/jwt.utils';

const API_URL = '/api/schedules';

class ScheduleService {
  async getUserSchedules() {
    try {
      const token = getToken();
      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des horaires:', error);
      throw error;
    }
  }

  async getAllSchedules() {
    try {
      const token = getToken();
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des horaires:', error);
      throw error;
    }
  }
}

export default new ScheduleService();