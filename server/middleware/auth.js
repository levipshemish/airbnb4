// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'your-dexfault-secret';

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification failed:', err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // 🔥 Attach user ID for use in routes
    req.userId = decoded.id;
    next();
  });
}

module.exports = authenticateToken;
