import express from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Get admin credentials from environment variables
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Check credentials
  if (username === adminUsername && password === adminPassword) {
    // Generate JWT token
    const token = jwt.sign(
      { username }, 
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );
    
    // Return token and user info
    res.json({ 
      token,
      user: { username, isAuthenticated: true }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Verify token route
router.get('/verify', authMiddleware, (req: AuthRequest, res) => {
  // If we reach here, the token is valid (checked by authMiddleware)
  res.json({ 
    user: { 
      username: req.user?.username, 
      isAuthenticated: true 
    } 
  });
});

export default router;
