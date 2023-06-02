const jwt = require('jsonwebtoken');
const { secret } = require('../config/auth');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Failed to authenticate:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};


module.exports={
  authMiddleware
}