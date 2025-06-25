// Clé de stockage du token
const TOKEN_KEY = 'token';

// Sauvegarder le token
export const saveToken = (token) => {
  console.log('💾 Sauvegarde token:', token ? 'Token présent' : 'Token vide');
  localStorage.setItem(TOKEN_KEY, token);
};

// Alias pour compatibilité
export const setToken = saveToken;

// Récupérer le token
export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log('🔑 Récupération token:', token ? 'Token présent' : 'Aucun token');
  return token;
};

// Supprimer le token
export const removeToken = () => {
  console.log('🗑️ Suppression token');
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('user');
};

// Vérifier si l'utilisateur est authentifié
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) {
    console.log('❌ Pas de token - non authentifié');
    return false;
  }

  try {
    // Décoder le payload du JWT (partie centrale entre les points)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Vérifier si le token a expiré
    if (payload.exp) {
      const expirationTime = payload.exp * 1000; // Convertir en millisecondes
      const isValid = Date.now() < expirationTime;
      
      if (!isValid) {
        console.log('⏰ Token expiré');
        removeToken();
        return false;
      }
    }
    
    console.log('✅ Token valide');
    return true;
  } catch (error) {
    console.error('💥 Erreur lors de la vérification du token:', error);
    removeToken();
    return false;
  }
};

// Récupérer les données du token
export const getTokenData = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return null;
  }
};

// Récupérer l'utilisateur depuis le token
export const getUserFromToken = () => {
  const tokenData = getTokenData();
  if (!tokenData) return null;

  return {
    id: tokenData.id,
    email: tokenData.email,
    nom: tokenData.nom,
    role: tokenData.role
  };
};

// Configurer axios pour inclure automatiquement le token
export const setupAxiosInterceptors = (axios) => {
  // Intercepteur de requête
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('📤 Ajout token à la requête:', config.url);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Intercepteur de réponse - SANS redirection automatique
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Ne pas rediriger automatiquement, laisser les composants gérer l'erreur
      console.log('⚠️ Erreur HTTP:', error.response?.status, error.config?.url);
      return Promise.reject(error);
    }
  );
};