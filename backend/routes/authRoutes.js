const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// JWT auth middleware
function authMiddleware(req, res, next) {
  let token = req.cookies && req.cookies.token;
  if (!token) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Malformed token' });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Validation middleware
const validateAuth = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

router.post('/register', validateAuth, authController.register);
router.post('/login', validateAuth, authController.login);
router.get('/protected', authMiddleware, authController.protected);
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out successfully' });
});

// Create Admin route (one-time only)
router.post('/create-admin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const { User } = require('../models/user');
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) return res.status(403).json({ error: 'Admin already exists' });
    const authController = require('../controllers/authController');
    return authController.createAdmin(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get all users (admin only)
router.get('/users', authMiddleware, async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can view users' });
  }
  const { User } = require('../models/user');
  const users = await User.find({}, 'email role');
  res.json({ users });
});

module.exports = router; 