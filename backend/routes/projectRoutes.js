const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Auth middleware (copied from authRoutes)
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

router.get('/', authMiddleware, projectController.getProjects);
router.post('/', authMiddleware, projectController.addProject);
router.patch('/:id', authMiddleware, projectController.updateProject);
router.delete('/:id', authMiddleware, projectController.deleteProject);

module.exports = router; 