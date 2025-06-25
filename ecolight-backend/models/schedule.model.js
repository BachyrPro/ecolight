const db = require('../config/db');

class Schedule {
    constructor(data) {
        this.collector_id = data.collector_id;
        this.jour = data.jour;
        this.heure = data.heure;
        this.type_dechet = data.type_dechet;
        this.zone = data.zone;
    }

    // Créer un nouvel horaire
    static async create(scheduleData) {
        try {
            const query = `
                INSERT INTO schedules (collector_id, jour, heure, type_dechet, zone) 
                VALUES (?, ?, ?, ?, ?)
            `;
            
            const [result] = await db.execute(query, [
                scheduleData.collector_id,
                scheduleData.jour,
                scheduleData.heure,
                scheduleData.type_dechet || 'Tous types',
                scheduleData.zone
            ]);
            
            return { id: result.insertId, ...scheduleData };
        } catch (error) {
            throw error;
        }
    }

    // Obtenir tous les horaires
    static async findAll() {
        try {
            const query = `
                SELECT s.*, c.nom as collector_nom 
                FROM schedules s
                JOIN collectors c ON s.collector_id = c.id
                ORDER BY FIELD(s.jour, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'), s.heure
            `;
            const [rows] = await db.execute(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtenir les horaires d'un collecteur
    static async findByCollectorId(collectorId) {
        try {
            const query = `
                SELECT * FROM schedules 
                WHERE collector_id = ?
                ORDER BY FIELD(jour, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'), heure
            `;
            const [rows] = await db.execute(query, [collectorId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtenir un horaire par ID
    static async findById(id) {
        try {
            const query = `
                SELECT s.*, c.nom as collector_nom 
                FROM schedules s
                JOIN collectors c ON s.collector_id = c.id
                WHERE s.id = ?
            `;
            const [rows] = await db.execute(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Mettre à jour un horaire
    static async update(id, scheduleData) {
        try {
            const fields = [];
            const values = [];
            
            Object.keys(scheduleData).forEach(key => {
                if (scheduleData[key] !== undefined && key !== 'id') {
                    fields.push(`${key} = ?`);
                    values.push(scheduleData[key]);
                }
            });
            
            if (fields.length === 0) {
                throw new Error('Aucune donnée à mettre à jour');
            }
            
            values.push(id);
            const query = `UPDATE schedules SET ${fields.join(', ')} WHERE id = ?`;
            
            const [result] = await db.execute(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Supprimer un horaire
    static async delete(id) {
        try {
            const query = 'DELETE FROM schedules WHERE id = ?';
            const [result] = await db.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Obtenir les prochaines collectes pour un utilisateur
    static async getNextCollections(userId) {
        try {
            const query = `
                SELECT c.nom as collector_nom, sch.jour, sch.heure, sch.type_dechet, sch.zone, c.telephone
                FROM subscriptions sub
                JOIN collectors c ON sub.collector_id = c.id
                JOIN schedules sch ON c.id = sch.collector_id
                WHERE sub.user_id = ? AND sub.statut = 'actif'
                ORDER BY FIELD(sch.jour, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'), sch.heure
            `;
            const [rows] = await db.execute(query, [userId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Schedule;