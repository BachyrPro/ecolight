const db = require('../config/db');

class Collector {
    constructor(data) {
        this.nom = data.nom;
        this.description = data.description;
        this.contact = data.contact;
        this.email = data.email;
        this.telephone = data.telephone;
        this.adresse = data.adresse;
        this.zone_couverture = data.zone_couverture;
    }

    // Créer un nouveau collecteur
    static async create(collectorData) {
        try {
            const query = `
                INSERT INTO collectors (nom, description, contact, email, telephone, adresse, zone_couverture) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            
            const [result] = await db.execute(query, [
                collectorData.nom,
                collectorData.description,
                collectorData.contact,
                collectorData.email,
                collectorData.telephone,
                collectorData.adresse,
                collectorData.zone_couverture
            ]);
            
            return { id: result.insertId, ...collectorData };
        } catch (error) {
            throw error;
        }
    }

    // Obtenir tous les collecteurs
    static async findAll() {
        try {
            const query = 'SELECT * FROM collectors ORDER BY nom';
            const [rows] = await db.execute(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtenir un collecteur par ID
    static async findById(id) {
        try {
            const query = 'SELECT * FROM collectors WHERE id = ?';
            const [rows] = await db.execute(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Mettre à jour un collecteur
    static async update(id, collectorData) {
        try {
            const fields = [];
            const values = [];
            
            Object.keys(collectorData).forEach(key => {
                if (collectorData[key] !== undefined && key !== 'id') {
                    fields.push(`${key} = ?`);
                    values.push(collectorData[key]);
                }
            });
            
            if (fields.length === 0) {
                throw new Error('Aucune donnée à mettre à jour');
            }
            
            values.push(id);
            const query = `UPDATE collectors SET ${fields.join(', ')} WHERE id = ?`;
            
            const [result] = await db.execute(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Supprimer un collecteur
    static async delete(id) {
        try {
            const query = 'DELETE FROM collectors WHERE id = ?';
            const [result] = await db.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Rechercher des collecteurs par zone
    static async findByZone(zone) {
        try {
            const query = 'SELECT * FROM collectors WHERE zone_couverture LIKE ?';
            const [rows] = await db.execute(query, [`%${zone}%`]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Collector;