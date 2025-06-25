-- Script SQL pour Ecolight - Waste Management Web App
-- Compatible avec MySQL

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS ecolight_db;
USE ecolight_db;

-- Table des utilisateurs
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL, -- Pour stocker le hash du mot de passe
    role ENUM('citoyen', 'admin', 'collecteur') DEFAULT 'citoyen',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Table des collecteurs de déchets
CREATE TABLE collectors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    contact VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telephone VARCHAR(20),
    adresse VARCHAR(255),
    zone_couverture VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nom (nom)
);

-- Table des abonnements
CREATE TABLE subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    collector_id INT NOT NULL,
    date_subscription DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('actif', 'inactif', 'suspendu') DEFAULT 'actif',
    date_fin DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (collector_id) REFERENCES collectors(id) ON DELETE CASCADE,
    UNIQUE KEY unique_subscription (user_id, collector_id),
    INDEX idx_user (user_id),
    INDEX idx_collector (collector_id)
);

-- Table des horaires de collecte
CREATE TABLE schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    collector_id INT NOT NULL,
    jour ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche') NOT NULL,
    heure TIME NOT NULL,
    type_dechet VARCHAR(100) DEFAULT 'Tous types',
    zone VARCHAR(255),
    FOREIGN KEY (collector_id) REFERENCES collectors(id) ON DELETE CASCADE,
    INDEX idx_collector_jour (collector_id, jour)
);

-- Table des signalements de décharges sauvages
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    localisation VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    date_report DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('nouveau', 'en_cours', 'resolu') DEFAULT 'nouveau',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_report (user_id),
    INDEX idx_date_report (date_report),
    INDEX idx_statut (statut)
);

-- Insertion de données fictives pour les collecteurs
INSERT INTO collectors (nom, description, contact, email, telephone, adresse, zone_couverture) VALUES
('EcoCollect Pro', 'Service professionnel de collecte de déchets ménagers et recyclables', 'contact@ecocollect.cm', 'contact@ecocollect.cm', '+237 6 00 00 00 01', 'Rue de la Paix, Yaoundé', 'Yaoundé Centre, Bastos, Nlongkak'),
('Green Waste Solutions', 'Spécialiste du tri et recyclage des déchets', 'info@greenwaste.cm', 'info@greenwaste.cm', '+237 6 00 00 00 02', 'Avenue Kennedy, Douala', 'Douala I, Douala II, Douala III'),
('CleanCity Services', 'Collecte rapide et efficace pour particuliers et entreprises', 'service@cleancity.cm', 'service@cleancity.cm', '+237 6 00 00 00 03', 'Boulevard de la Liberté, Yaoundé', 'Mfou, Soa, Obala'),
('RecycleMax Cameroun', 'Expert en valorisation des déchets plastiques et métalliques', 'recyclemax@gmail.com', 'recyclemax@gmail.com', '+237 6 00 00 00 04', 'Zone Industrielle, Douala', 'Bonaberi, Deido, New Bell'),
('EcoVert Services', 'Solutions écologiques pour la gestion des déchets organiques', 'contact@ecovert.cm', 'contact@ecovert.cm', '+237 6 00 00 00 05', 'Quartier Tsinga, Yaoundé', 'Tsinga, Briqueterie, Essos');

-- Insertion des horaires de collecte pour chaque collecteur
-- Horaires pour EcoCollect Pro (ID: 1)
INSERT INTO schedules (collector_id, jour, heure, type_dechet, zone) VALUES
(1, 'Lundi', '06:00:00', 'Déchets ménagers', 'Yaoundé Centre'),
(1, 'Lundi', '14:00:00', 'Déchets recyclables', 'Bastos'),
(1, 'Mercredi', '06:00:00', 'Déchets ménagers', 'Bastos'),
(1, 'Mercredi', '14:00:00', 'Déchets recyclables', 'Yaoundé Centre'),
(1, 'Vendredi', '06:00:00', 'Déchets ménagers', 'Nlongkak'),
(1, 'Samedi', '08:00:00', 'Tous types', 'Tous secteurs');

-- Horaires pour Green Waste Solutions (ID: 2)
INSERT INTO schedules (collector_id, jour, heure, type_dechet, zone) VALUES
(2, 'Mardi', '07:00:00', 'Déchets recyclables', 'Douala I'),
(2, 'Mardi', '15:00:00', 'Déchets organiques', 'Douala II'),
(2, 'Jeudi', '07:00:00', 'Déchets recyclables', 'Douala II'),
(2, 'Jeudi', '15:00:00', 'Déchets organiques', 'Douala III'),
(2, 'Samedi', '09:00:00', 'Tous types', 'Douala I et III');

-- Horaires pour CleanCity Services (ID: 3)
INSERT INTO schedules (collector_id, jour, heure, type_dechet, zone) VALUES
(3, 'Lundi', '05:30:00', 'Déchets ménagers', 'Mfou'),
(3, 'Mercredi', '05:30:00', 'Déchets ménagers', 'Soa'),
(3, 'Vendredi', '05:30:00', 'Déchets ménagers', 'Obala'),
(3, 'Dimanche', '08:00:00', 'Tous types', 'Tous secteurs');

-- Horaires pour RecycleMax Cameroun (ID: 4)
INSERT INTO schedules (collector_id, jour, heure, type_dechet, zone) VALUES
(4, 'Lundi', '08:00:00', 'Plastiques', 'Bonaberi'),
(4, 'Mardi', '08:00:00', 'Métaux', 'Deido'),
(4, 'Jeudi', '08:00:00', 'Plastiques', 'New Bell'),
(4, 'Vendredi', '08:00:00', 'Métaux', 'Bonaberi'),
(4, 'Samedi', '10:00:00', 'Plastiques et Métaux', 'Tous secteurs');

-- Horaires pour EcoVert Services (ID: 5)
INSERT INTO schedules (collector_id, jour, heure, type_dechet, zone) VALUES
(5, 'Lundi', '06:30:00', 'Déchets organiques', 'Tsinga'),
(5, 'Mercredi', '06:30:00', 'Déchets organiques', 'Briqueterie'),
(5, 'Vendredi', '06:30:00', 'Déchets organiques', 'Essos'),
(5, 'Samedi', '07:00:00', 'Compost', 'Tous secteurs');

-- Création d'index supplémentaires pour optimiser les performances
CREATE INDEX idx_schedules_jour_heure ON schedules(jour, heure);
CREATE INDEX idx_reports_localisation ON reports(localisation);

-- Vue pour afficher les horaires complets par collecteur
CREATE VIEW vue_horaires_collecteurs AS
SELECT 
    c.nom AS collecteur,
    s.jour,
    s.heure,
    s.type_dechet,
    s.zone,
    c.contact,
    c.telephone
FROM schedules s
JOIN collectors c ON s.collector_id = c.id
ORDER BY c.nom, 
    FIELD(s.jour, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'),
    s.heure;

-- Vue pour le tableau de bord des abonnements actifs
CREATE VIEW vue_abonnements_actifs AS
SELECT 
    u.nom AS utilisateur,
    u.email,
    c.nom AS collecteur,
    s.date_subscription,
    s.statut
FROM subscriptions s
JOIN users u ON s.user_id = u.id
JOIN collectors c ON s.collector_id = c.id
WHERE s.statut = 'actif';

-- Procédure stockée pour obtenir les prochaines collectes d'un utilisateur
DELIMITER //
CREATE PROCEDURE obtenir_prochaines_collectes(IN p_user_id INT)
BEGIN
    SELECT 
        c.nom AS collecteur,
        sch.jour,
        sch.heure,
        sch.type_dechet,
        sch.zone,
        c.telephone
    FROM subscriptions sub
    JOIN collectors c ON sub.collector_id = c.id
    JOIN schedules sch ON c.id = sch.collector_id
    WHERE sub.user_id = p_user_id 
    AND sub.statut = 'actif'
    ORDER BY 
        FIELD(sch.jour, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'),
        sch.heure;
END//
DELIMITER ;

-- Trigger pour vérifier l'unicité de l'abonnement actif
DELIMITER //
CREATE TRIGGER check_subscription_before_insert
BEFORE INSERT ON subscriptions
FOR EACH ROW
BEGIN
    IF NEW.statut = 'actif' AND EXISTS (
        SELECT 1 FROM subscriptions 
        WHERE user_id = NEW.user_id 
        AND collector_id = NEW.collector_id 
        AND statut = 'actif'
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Un abonnement actif existe déjà pour cet utilisateur et ce collecteur';
    END IF;
END//
DELIMITER ;

ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;


-- Affichage des informations de vérification
SELECT 'Base de données Ecolight créée avec succès!' AS Message;
SELECT COUNT(*) AS 'Nombre de collecteurs' FROM collectors;
SELECT COUNT(*) AS 'Nombre d\'horaires' FROM schedules;

