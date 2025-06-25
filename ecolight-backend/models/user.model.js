const db = require('../config/db');
const bcrypt = require('bcryptjs'); // ✅ Changé de 'bcrypt' à 'bcryptjs'

class UserModel {
    // Créer un nouvel utilisateur
    static async create(userData) {
        const { email, password, nom, role = 'citoyen' } = userData;
        
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const [result] = await db.execute(`
            INSERT INTO users (email, mot_de_passe, nom, role)
            VALUES (?, ?, ?, ?)
        `, [email, hashedPassword, nom, role]);

        return result.insertId;
    }

    // Trouver un utilisateur par email
    static async findByEmail(email) {
        const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return users[0] || null;
    }

    // Trouver un utilisateur par ID
    static async findById(id) {
        const [users] = await db.execute(
            'SELECT id, email, nom, role, date_creation FROM users WHERE id = ?',
            [id]
        );
        return users[0] || null;
    }

    // Mettre à jour un utilisateur
    static async update(id, updateData) {
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(updateData)) {
            if (value !== undefined && key !== 'id') {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            throw new Error('Aucune donnée à mettre à jour');
        }

        values.push(id);

        const [result] = await db.execute(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return result.affectedRows > 0;
    }

    // Obtenir tous les collecteurs actifs (depuis la table collectors)
    static async getCollectors() {
        const [collectors] = await db.execute(`
            SELECT id, nom, email, telephone, adresse, zone_couverture, description
            FROM collectors 
            ORDER BY nom
        `);
        return collectors;
    }

    // Vérifier le mot de passe
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Changer le mot de passe
    static async changePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        const [result] = await db.execute(
            'UPDATE users SET mot_de_passe = ? WHERE id = ?',
            [hashedPassword, id]
        );

        return result.affectedRows > 0;
    }
}

module.exports = UserModel;