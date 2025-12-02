import { Pool } from 'pg'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// --- FUNCIÓN PARA GENERAR EL TOKEN JWT ---
const generateToken = (id, rol) => {
    return jwt.sign({ 
        id, 
        rol
    }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Login del usuario (SEGURO)
const loginUser = async (req, res) => {
  const { correo, contra } = req.body;

  try {
    // 1. Buscar al usuario
    const result = await pool.query(
      'SELECT id, nombre, apellido, correo, rol, contra FROM users WHERE correo = $1',
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" }); // Usar 401 para autenticación
    }

    const user = result.rows[0];
    
    // 2. Verificar la contraseña usando bcrypt.compare
    const passwordMatch = await bcrypt.compare(contra, user.contra);

    if (!passwordMatch) {
        return res.status(401).json({ message: "Credenciales incorrectas" }); // Usar 401 para autenticación
    }

    // 3. Devolver el token y los datos del usuario
    res.status(200).json({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        rol: user.rol, 
        token: generateToken(user.id, user.rol),
    });
  } catch (err) {
    console.error("Error de autenticación", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// 🟢 FUNCIÓN NUEVA: Cambiar Contraseña (Necesaria para tu frontend)
const changePassword = async (req, res) => {
    // req.user viene del middleware 'protect' que decodifica el JWT
    const userId = req.user.id; 
    const { actual, nueva } = req.body;

    if (!actual || !nueva) {
        return res.status(400).json({ message: 'Se requieren ambas contraseñas.' });
    }
    
    if (nueva.length < 6) {
        return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    try {
        // 1. Obtener el hash de la contraseña actual del usuario
        const userResult = await pool.query(
            'SELECT contra FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const hashedPassword = userResult.rows[0].contra;

        // 2. Verificar la contraseña actual (con bcrypt)
        const isMatch = await bcrypt.compare(actual, hashedPassword);

        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña actual incorrecta.' });
        }

        // 3. Hashear la nueva contraseña
        const saltRounds = 10;
        const newHashedPassword = await bcrypt.hash(nueva, saltRounds);

        // 4. Actualizar la base de datos
        await pool.query(
            'UPDATE users SET contra = $1 WHERE id = $2',
            [newHashedPassword, userId]
        );

        res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });

    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).json({ message: 'Error del servidor al procesar el cambio de contraseña.' });
    }
};


export { 
    loginUser,    
    changePassword 
};