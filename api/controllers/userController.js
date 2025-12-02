const { Pool } = require('pg');
const jwt = require('jsonwebtoken'); // ✅ Correcto: JWT importado
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// --- FUNCIÓN PARA GENERAR EL TOKEN JWT ---
const generateToken = (id, rol) => { // ✅ Correcto: Recibe 'id' y 'rol'
    return jwt.sign({ 
        id, 
        rol // ✅ Correcto: 'rol' incluido en el payload
    }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Login del usuario (CORREGIDO)
const loginUser = async (req, res) => {
  const { correo, contra } = req.body;

  try {
    // 1. Buscar al usuario solo por correo para obtener todos sus datos (incluyendo la contraseña guardada)
    const result = await pool.query(
      'SELECT id, nombre, apellido, correo, rol, contra FROM users WHERE correo = $1',
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    const user = result.rows[0];
    
    // 2. Verificar la contraseña
    // (NOTA: Idealmente, aquí se usaría bcrypt.compare, pero usamos comparación simple por tu BD actual)
    if (user.contra !== contra) {
        return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    // 3. 🚨 CAMBIO CLAVE: Devolver el TOKEN JWT junto con los datos del usuario
    res.status(200).json({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        rol: user.rol, // Opcional, pero útil para el frontend
        // 🚨 USAR generateToken para crear el JWT que lleva el rol
        token: generateToken(user.id, user.rol),
    });
  } catch (err) {
    console.error("Error de autenticación", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { loginUser };