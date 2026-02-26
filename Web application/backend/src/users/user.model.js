const db = require('../firebase'); // Firestore
const bcrypt = require('bcryptjs');

class UserModel {
    constructor() {
        this.collection = db.collection('users');
    }

    // Créer un nouvel utilisateur
    async createUser({ username, email, password, role = 'user', profileImage = '', bio = '', profession = '' }) {
        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer le document dans Firestore
        const userRef = await this.collection.add({
            username,
            email,
            password: hashedPassword,
            role,
            profileImage,
            bio,
            profession,
            createdAt: new Date()
        });

        return { id: userRef.id, username, email, role };
    }

    // Récupérer un utilisateur par ID
    async getUserById(userId) {
        const doc = await this.collection.doc(userId).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    }

    // Récupérer un utilisateur par email
    async getUserByEmail(email) {
        const snapshot = await this.collection.where('email', '==', email).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    }

    // Vérifier le mot de passe
    async comparePassword(candidatePassword, hashedPassword) {
        return bcrypt.compare(candidatePassword, hashedPassword);
    }
}

module.exports = new UserModel();
