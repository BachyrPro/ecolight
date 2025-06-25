# Étape de base
FROM node:18

# Dossier de travail
WORKDIR /app

# Copier les fichiers package.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste
COPY . .

# ✅ Installer netcat pour wait-for.sh
RUN apt-get update && apt-get install -y netcat-openbsd


# ✅ Ajouter et rendre exécutable le script d'attente
COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

# Commande de démarrage
CMD ["/wait-for.sh", "mysql", "3306", "npm", "start"]
