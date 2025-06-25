# Étape 1 : Build de l'application React
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Serveur nginx pour servir l'app
FROM nginx:alpine

# Copier les fichiers build dans nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port nginx
EXPOSE 80

# Commande de démarrage nginx
CMD ["nginx", "-g", "daemon off;"]
