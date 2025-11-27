// api/middleware/authMiddleware.js

const verifyToken = (req, res, next) => {
  // Lógica para verificar el token
  console.log("Verificando token...");
  next();  // Si todo es correcto, pasa al siguiente middleware o ruta
};

const isAdmin = (req, res, next) => {
  // Lógica para verificar si el usuario tiene rol de admin
  console.log("Verificando si es admin...");
  next();  // Si todo es correcto, pasa al siguiente middleware o ruta
};

// Exportación de ambas funciones
export { verifyToken, isAdmin };
