// routes/userRoutes.js
import { Router } from 'express'; 
import pool from '../db.js'; 
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 

// Importamos los middlewares de autenticación
import { verifyToken } from '../middlewares/authMiddleware.js'; 

const router = Router();

// --- Ruta para registrar un nuevo usuario ---
// URL: POST /api/users/registro
router.post('/registro', async (req, res) => {
    const { nombre, correo, pais, celular, contra } = req.body;
    // ... [Validaciones omitidas por simplicidad]
    const checkUserQuery = 'SELECT * FROM users WHERE correo = $1';

    try {
        const existingUser = await pool.query(checkUserQuery, [correo]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contra, saltRounds);

        // NOTA: 'rol' por defecto es 'cliente' en la BD, no se inserta aquí.
        const insertUserQuery = `
          INSERT INTO users (nombre, correo, pais, celular, contra)
          VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, correo, pais, celular, rol
        `;
        const result = await pool.query(insertUserQuery, [nombre, correo, pais, celular, hashedPassword]);
        const newUser = result.rows[0];

        const token = jwt.sign(
            { id: newUser.id, correo: newUser.correo, rol: newUser.rol }, // Adjuntamos el rol
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        return res.status(201).json({ token, user: newUser });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
});

// --- Ruta para login de usuario ---
// URL: POST /api/users/iniciar-sesion
router.post('/iniciar-sesion', async (req, res) => {
    const { correo, contra } = req.body;

    try {
        const checkUserQuery = 'SELECT * FROM users WHERE correo = $1';
        const result = await pool.query(checkUserQuery, [correo]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Correo no encontrado' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(contra, user.contra);

        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: user.id, correo: user.correo, rol: user.rol }, // Adjuntamos el rol
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.status(200).json({ token, user });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
});

// --- RUTA NUEVA: Obtener perfil del usuario autenticado ---
// URL: GET /api/users/me
router.get('/me', verifyToken, (req, res) => {
    // Si llegamos aquí, el middleware verifyToken pasó.
    // req.user contiene { id, correo, rol } del token.
    res.status(200).json({
        message: 'Datos del usuario autenticado',
        user: req.user
    });
});

export default router;