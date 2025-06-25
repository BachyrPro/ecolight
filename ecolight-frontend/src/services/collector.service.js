import axios from 'axios';
import { getToken } from '../utils/jwt.utils';

const API_URL = '/api/collectors';

class CollectorService {
  async getAllCollectors() {
    try {
      const token = getToken();
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des collecteurs:', error);
      throw error;
    }
  }

  async getCollectorById(id) {
    try {
      const token = getToken();
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors du chargement du collecteur:', error);
      throw error;
    }
  }
}

export default new CollectorService();