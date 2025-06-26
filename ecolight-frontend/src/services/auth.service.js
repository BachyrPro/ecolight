import axios from 'axios';
import { saveToken, removeToken, getToken } from '../utils/jwt.utils';

// CORRECTION : Utiliser l'URL complète
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const API_URL = `${API_BASE}/api/auth`;

class AuthService {
  async login(email, mot_de_passe) {
    try {
      console.log('🔐 Tentative de connexion vers:', API_URL);
      console.log('📧 Email:', email);
      
      const response = await axios.post(`${API_URL}/login`, {
        email,
        mot_de_passe,
      });

      console.log('✅ Réponse login:', response.data);

      if (response.data.success && response.data.token) {
        saveToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('💾 Token sauvegardé');
        return response.data;
      } else {
        throw new Error(response.data.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('💥 Erreur login complète:', error);
      console.error('🌐 URL tentée:', `${API_URL}/login`);
      console.error('📤 Données envoyées:', { email, mot_de_passe: '***' });
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend tourne sur le port 3001.');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Erreur de connexion au serveur');
    }
  }

  async register(userData) {
    try {
      console.log('📝 Tentative d\'inscription vers:', API_URL);
      const response = await axios.post(`${API_URL}/register`, userData);

      console.log('✅ Réponse register:', response.data);

      if (response.data.success && response.data.token) {
        saveToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('💥 Erreur register:', error.response?.data || error.message);
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