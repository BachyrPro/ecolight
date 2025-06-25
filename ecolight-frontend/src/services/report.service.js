import axios from 'axios';
import { getToken } from '../utils/jwt.utils';

const API_URL = '/api/reports';

class ReportService {
  async getUserReports() {
    try {
      const token = getToken();
      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des signalements:', error);
      throw error;
    }
  }

  async getAllReports() {
    try {
      const token = getToken();
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des signalements:', error);
      throw error;
    }
  }

  async createReport(reportData) {
    try {
      const token = getToken();
      const response = await axios.post(API_URL, reportData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du signalement:', error);
      throw error;
    }
  }

  async updateReport(reportId, reportData) {
    try {
      const token = getToken();
      const response = await axios.put(`${API_URL}/${reportId}`, reportData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  }

  async deleteReport(reportId) {
    try {
      const token = getToken();
      const response = await axios.delete(`${API_URL}/${reportId}`, {
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
}

export default new ReportService();