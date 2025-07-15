const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findUserByEmail, addUser } = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    await addUser({ email, password: hashed });
    res.json({ message: 'User registered' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'User already exists' });
    }
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ email, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.protected = (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
}; 