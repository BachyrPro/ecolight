module.exports = {
    secret: process.env.JWT_SECRET || 'ecolight_secret_key_2024',
    expiresIn: process.env.JWT_EXPIRE || '7d',
    algorithm: 'HS256'
};