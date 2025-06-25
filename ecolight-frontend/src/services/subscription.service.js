import axios from 'axios';

const API_URL = '/api/subscriptions';

class SubscriptionService {
  async getUserSubscriptions() {
    try {
      console.log('🔍 Chargement des abonnements utilisateur');
      const response = await axios.get(`${API_URL}/user`);
      console.log('✅ Abonnements récupérés:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('💥 Erreur lors du chargement des abonnements:', error);
      throw error;
    }
  }

  async createSubscription(collectorId) {
    try {
      console.log('📝 Création d\'abonnement pour collecteur:', collectorId);
      const response = await axios.post(API_URL, { collector_id: collectorId });
      console.log('✅ Abonnement créé:', response.data);
      return response.data;
    } catch (error) {
      console.error('💥 Erreur lors de la création de l\'abonnement:', error);
      throw error;
    }
  }

  async updateStatus(subscriptionId, status) {
    try {
      console.log('🔄 Mise à jour statut abonnement:', subscriptionId, status);
      const response = await axios.put(`${API_URL}/${subscriptionId}/status`, { statut: status });
      console.log('✅ Statut mis à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error('💥 Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  }

  async deleteSubscription(subscriptionId) {
    try {
      console.log('🗑️ Suppression abonnement:', subscriptionId);
      const response = await axios.delete(`${API_URL}/${subscriptionId}`);
      console.log('✅ Abonnement supprimé:', response.data);
      return response.data;
    } catch (error) {
      console.error('💥 Erreur lors de la suppression:', error);
      throw error;
    }
  }
}

export default new SubscriptionService();