const db = require('../config/db');

class ReportModel {
    // Créer un nouveau signalement
    static async create(reportData) {
        const { user_id, localisation, description, latitude, longitude, image_url } = reportData;
        
        const [result] = await db.execute(`
            INSERT INTO reports (user_id, localisation, description, latitude, longitude, image_url, statut)
            VALUES (?, ?, ?, ?, ?, ?, 'nouveau')
        `, [user_id, localisation, description, latitude, longitude, image_url]);

        return result.insertId;
    }

    // Obtenir tous les signalements
    static async getAll(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT r.*, u.nom as user_nom, u.email as user_email
            FROM reports r
            JOIN users u ON r.user_id = u.id
            WHERE 1=1
        `;
        let countQuery = 'SELECT COUNT(*) as total FROM reports r WHERE 1=1';
        let params = [];

        // Appliquer les filtres
        if (filters.statut) {
            query += ' AND r.statut = ?';
            countQuery += ' AND r.statut = ?';
            params.push(filters.statut);
        }

        if (filters.user_id) {
            query += ' AND r.user_id = ?';
            countQuery += ' AND r.user_id = ?';
            params.push(filters.user_id);
        }

        query += ' ORDER BY r.date_report DESC LIMIT ? OFFSET ?';
        const queryParams = [...params, limit, offset];

        const [reports] = await db.execute(query, queryParams);
        const [countResult] = await db.execute(countQuery, params);

        return {
            reports,
            total: countResult[0].total,
            totalPages: Math.ceil(countResult[0].total / limit),
            currentPage: page
        };
    }

    // Obtenir un signalement par ID
    static async getById(id) {
        const [reports] = await db.execute(`
            SELECT r.*, u.nom as user_nom, u.email as user_email
            FROM reports r
            JOIN users u ON r.user_id = u.id
            WHERE r.id = ?
        `, [id]);

        return reports[0] || null;
    }

    // Mettre à jour un signalement
    static async update(id, updateData) {
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(updateData)) {
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            throw new Error('Aucune donnée à mettre à jour');
        }

        values.push(id);

        const [result] = await db.execute(
            `UPDATE reports SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return result.affectedRows > 0;
    }

    // Supprimer un signalement
    static async delete(id) {
        const [result] = await db.execute('DELETE FROM reports WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // Obtenir les statistiques des signalements
    static async getStatistics() {
        const [stats] = await db.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN statut = 'nouveau' THEN 1 ELSE 0 END) as nouveaux,
                SUM(CASE WHEN statut = 'en_cours' THEN 1 ELSE 0 END) as en_cours,
                SUM(CASE WHEN statut = 'resolu' THEN 1 ELSE 0 END) as resolus
            FROM reports
        `);

        return stats[0];
    }
}

module.exports = ReportModel;