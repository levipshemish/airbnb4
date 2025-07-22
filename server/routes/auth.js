const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'invorvnorvreinvrov'

// Signup
router.post('/signup', async (req, res) => {
  const { name, text } = req.body;
  const existing = await User.findOne({ name });
  if (existing) return res.status(400).json({ error: 'User exists' });

  const hashed = await bcrypt.hash(text, 10);
  const user = new User({ name, text: hashed });
  await user.save();

  res.json({ message: 'Registered', userId: user._id });
});

// Login
router.post('/login', async (req, res) => {
  const { name, text } = req.body;
  const user = await User.findOne({ name });
  if (!user || !(await bcrypt.compare(text, user.text)))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '5h' });
  res.json({ message: 'Login successful', token, user });
});

router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, SECRET);

    const user = await User.findById(decoded.id).select('name');
    if (!user) return res.status(404).json({ error: 'Not found' });

    res.json({ name: user.name });
  } catch (err) {
    console.error('JWT decode error:', err);
    return res.status(403).json({ error: 'Invalid token' });
  }
});


module.exports = router;
