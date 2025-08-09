import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;

// 🔐 Centralized function to extract token from cookie or Authorization header
const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.token;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return cookieToken;
};

// ✅ Middleware to check if user is authenticated
export const requireAuth = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token || typeof token !== 'string') {
    return res.status(401).json({ error: 'Unauthorized: No or malformed token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};


// ✅ Middleware for Admin-only access
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
};

// ✅ Middleware for Member-only access
export const requireMember = (req, res, next) => {
  if (!req.user || req.user.isMember !== true) {
    return res.status(403).json({ error: 'Access denied: Members only' });
  }
  next();
};
