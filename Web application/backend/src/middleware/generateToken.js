const jwt = require('jsonwebtoken');
const db = require('../firebase'); // Import de Firestore via firebase.js

const JWT_Secret = process.env.JWT_Secret_KEY;

const generateToken = async (userId) => {
    try {
        // Récupérer l'utilisateur depuis Firestore
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            throw new Error(`User with ID ${userId} not found`);
        }

        const user = userDoc.data();
        const role = user.role || 'user'; // Valeur par défaut si role inexistant

        // Générer le token JWT
        const token = jwt.sign({ userId, role }, JWT_Secret, { expiresIn: '1h' });

        return token;
    } catch (error) {
        console.error('Error generating token:', error.message);
        throw new Error('Error generating token');
    }
};

module.exports = generateToken;
