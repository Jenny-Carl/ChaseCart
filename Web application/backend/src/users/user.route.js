const express = require('express');
const User = require('./user.model'); // le UserModel Firebase
const generateToken = require('../middleware/generateToken');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Créer l'utilisateur
        const newUser = await User.createUser({ username, email, password });

        res.status(201).json({ message: "User registered successfully!", user: newUser });

    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).json({ message: "Error registering user" });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password does not match" });
        }

        const token = await generateToken(user.id);

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'None' });
        res.status(200).json({
            message: "Logged in successfully!",
            token,
            user: {
                _id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession,
            }
        });

    } catch (error) {
        console.error("Error logging in user:", error.message);
        res.status(500).json({ message: "Error logging in user" });
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully!" });
});

// Delete an user
router.delete('/users/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userRef = User.collection.doc(id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        await userRef.delete();
        res.status(200).json({ message: "User deleted successfully!" });

    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Error deleting user" });
    }
});

// Get all users
router.get('/users', verifyToken, async (req, res) => {
    try {
        const snapshot = await User.collection.get();
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, email: data.email, role: data.role };
        });
        res.status(200).json(users);

    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Update user role
router.put('/users/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const userRef = User.collection.doc(id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        await userRef.update({ role });
        res.status(200).json({ message: "User role updated successfully!" });

    } catch (error) {
        console.error("Error updating user role:", error.message);
        res.status(500).json({ message: "Error updating user role" });
    }
});

// Edit or update user profile
router.patch('/edit-profile', verifyToken, async (req, res) => {
    try {
        const { userId, username, profileImage, bio, profession } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const userRef = User.collection.doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Préparer les mises à jour dynamiquement
        const updateData = {};
        if (username !== undefined) updateData.username = username;
        if (profileImage !== undefined) updateData.profileImage = profileImage;
        if (bio !== undefined) updateData.bio = bio;
        if (profession !== undefined) updateData.profession = profession;

        await userRef.update(updateData);

        const updatedUser = await userRef.get();

        res.status(200).json({
            message: "Profile updated successfully!",
            user: { id: updatedUser.id, ...updatedUser.data() }
        });

    } catch (error) {
        console.error("Error updating user profile:", error.message);
        res.status(500).json({ message: "Error updating user profile" });
    }
});

module.exports = router;
