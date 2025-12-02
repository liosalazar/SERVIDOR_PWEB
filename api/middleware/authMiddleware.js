// api/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization; 
    const token = authHeader && authHeader.split(' ')[1]; 
    
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No hay token proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 

    } catch (err) {
        return res.status(403).json({ message: 'Token inválido o expirado.', error: err.message });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Acceso restringido. Se requiere rol de administrador.' });
    }
};

export { 
    verifyToken as protect,
    isAdmin 
};
