const db = require('../config/db');

class Subscription {
    constructor(data) {
        this.user_id = data.user_id;
        this.collector_id = data.collector_id;
        this.statut = data.statut || 'actif';
        this.date_fin = data.date_fin;
    }

    // Créer un nouvel abonnement
    static async create(subscriptionData) {
        try {
            const query = `
                INSERT INTO subscriptions (user_id, collector_id, statut, date_fin) 
                VALUES (?, ?, ?, ?)
            `;
            
            const [result] = await db.execute(query, [
                subscriptionData.user_id,
                subscriptionData.collector_id,
                subscriptionData.statut || 'actif',
                subscriptionData.date_fin
            ]);
            
            return { id: result.insertId, ...subscriptionData };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Un abonnement existe déjà pour cet utilisateur et ce collecteur');
            }
            throw error;
        }
    }

    // Obtenir tous les abonnements d'un utilisateur
    static async findByUserId(userId) {
        try {
            const query = `
                SELECT s.*, c.nom as collector_nom, c.contact as collector_contact
                FROM subscriptions s
                JOIN collectors c ON s.collector_id = c.id
                WHERE s.user_id = ?
                ORDER BY s.date_subscription DESC
            `;
            const [rows] = await db.execute(query, [userId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtenir tous les abonnés d'un collecteur
    static async findByCollectorId(collectorId) {
        try {
            const query = `
                SELECT s.*, u.nom as user_nom, u.email as user_email
                FROM subscriptions s
                JOIN users u ON s.user_id = u.id
                WHERE s.collector_id = ?
                ORDER BY s.date_subscription DESC
            `;
            const [rows] = await db.execute(query, [collectorId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtenir un abonnement par ID
    static async findById(id) {
        try {
            const query = `
                SELECT s.*, 
                       u.nom as user_nom, u.email as user_email,
                       c.nom as collector_nom, c.contact as collector_contact
                FROM subscriptions s
                JOIN users u ON s.user_id = u.id
                JOIN collectors c ON s.collector_id = c.id
                WHERE s.id = ?
            `;
            const [rows] = await db.execute(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Mettre à jour le statut d'un abonnement
    static async updateStatus(id, statut) {
        try {
            const query = 'UPDATE subscriptions SET statut = ? WHERE id = ?';
            const [result] = await db.execute(query, [statut, id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Supprimer un abonnement
    static async delete(id) {
        try {
            const query = 'DELETE FROM subscriptions WHERE id = ?';
            const [result] = await db.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Vérifier si un abonnement existe
    static async exists(userId, collectorId) {
        try {
            const query = 'SELECT id FROM subscriptions WHERE user_id = ? AND collector_id = ? AND statut = "actif"';
            const [rows] = await db.execute(query, [userId, collectorId]);
            return rows.length > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Subscription;