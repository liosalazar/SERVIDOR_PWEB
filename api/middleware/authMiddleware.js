// api/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // 1. Obtener el token del encabezado Authorization
    const authHeader = req.headers.authorization; 
    // El token viene como 'Bearer <token>', por eso hacemos split(' ')
    const token = authHeader && authHeader.split(' ')[1]; 
    
    if (!token) {
        // 401 Unauthorized: No hay token
        return res.status(401).json({ message: 'Acceso denegado. No hay token proporcionado.' });
    }

    try {
        // 2. Verificar y decodificar el token usando tu JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Adjuntar los datos del usuario al objeto request (req)
        req.user = decoded; 
        
        // Continuar con la siguiente función (ruta o middleware)
        next(); 

    } catch (err) {
        // 403 Forbidden: Token inválido, expirado o malformado
        return res.status(403).json({ message: 'Token inválido o expirado.', error: err.message });
    }
};

const isAdmin = (req, res, next) => {
    // Esta función asume que verifyToken ya se ejecutó y adjuntó req.user
    if (req.user && req.user.rol === 'admin') {
        next(); // Es admin, permitir acceso
    } else {
        // 403 Forbidden: El usuario no tiene permisos de administrador
        return res.status(403).json({ message: 'Acceso restringido. Se requiere rol de administrador.' });
    }
};

export { 
    verifyToken as protect,
    isAdmin 
};