const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findUserByEmail, addUser } = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

exports.register = async (req, res) => {
  const { email, password, name, phone, designation } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Email, password, and name are required' });
  try {
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    await addUser({ email, password: hashed, name, phone, designation });
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
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });
    res.json({ message: 'Login successful', user: { email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.protected = (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
};

exports.createAdmin = async (req, res) => {
  const { email, password, name, phone, designation } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Email, password, and name are required' });
  try {
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    await addUser({ email, password: hashed, name, phone, designation, role: 'admin' });
    const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });
    res.json({ message: 'Admin user created', user: { email, role: 'admin' } });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}; 