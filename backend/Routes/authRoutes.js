const express = require('express');

const User = require('../Schemas/Users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const newUser = new User({ username, email, password, role });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Check if user exists and if the password matches
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token with user ID and role
        const token = jwt.sign(
            { id: user._id, role: user.role },  // Include role in the JWT payload
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send back token and role in the response
        res.json({ token, role: user.role });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
