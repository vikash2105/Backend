const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory user store (can be replaced by DB)
const users = [];

// Register
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = users.find(user => user.email === email);
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { id: users.length + 1, name, email, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ msg: 'User registered successfully' });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Profile
router.get('/profile', (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: 'No token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = users.find(u => u.id === decoded.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json({ id: user.id, name: user.name, email: user.email });
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token' });
    }
});

module.exports = router;
