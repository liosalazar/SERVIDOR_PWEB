const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  
    let token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

  
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Adjuntamos el ID del usuario al objeto request para usarlo en los controladores
        req.userId = decoded.id; 
        req.userRole = decoded.rol; // Asumimos que el rol se añade al token durante el login
        next();
    } catch (err) {
  
        return res.status(401).json({ message: 'Token no válido o expirado.' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Acceso prohibido. Requiere rol de administrador.' });
    }
    next();
};

module.exports = { verifyToken, isAdmin };
