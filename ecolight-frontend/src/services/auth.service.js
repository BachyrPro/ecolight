import axios from 'axios';
import { saveToken, removeToken, getToken } from '../utils/jwt.utils';

const API_URL = '/api/auth';

class AuthService {
  async login(email, mot_de_passe) {
    try {
      console.log('Tentative de connexion:', { email }); // Debug
      const response = await axios.post(`${API_URL}/login`, {
        email,
        mot_de_passe,
      });

      console.log('Réponse login:', response.data); // Debug

      if (response.data.token) {
        saveToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Erreur login:', error.response?.data || error.message); // Debug
      throw error;
    }
  }

  async register(userData) {
    try {
      console.log('Tentative d\'inscription:', userData); // Debug
      const response = await axios.post(`${API_URL}/register`, userData);

      console.log('Réponse register:', response.data); // Debug

      if (response.data.token) {
        saveToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Erreur register:', error.response?.data || error.message); // Debug
      throw error;
    }
  }

  logout() {
    removeToken();
    localStorage.removeItem('user');
  }

  async getProfile() {
    try {
      const token = getToken();
      const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
}

export default new AuthService();