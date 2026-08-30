import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (!token) {
    return res.status(403).json({ success: false, message: 'No token provided!' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'supersecret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.userRole === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Require Admin Role!' });
  }
};

export const authJwt = {
  verifyToken,
  isAdmin
};
