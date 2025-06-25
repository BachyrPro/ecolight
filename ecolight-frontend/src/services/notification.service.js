import axios from 'axios';
import { getToken } from '../utils/jwt.utils';

const API_URL = '/api/notifications';

class NotificationService {
  async getNotifications() {
    try {
      const token = getToken();
      const response = await axios.get(`${API_URL}/my-notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId) {
    try {
      const token = getToken();
      const response = await axios.put(`${API_URL}/${notificationId}/mark-read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId) {
    try {
      const token = getToken();
      const response = await axios.delete(`${API_URL}/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  }

  async markAllAsRead() {
    try {
      const token = getToken();
      const response = await axios.put(`${API_URL}/mark-all-read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      throw error;
    }
  }
}

export default new NotificationService();