// userRoutes.js
import { Router } from 'express'; 
import pool from '../db.js'; // Importamos el pool centralizado
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 

const router = Router();
// Eliminamos la inicialización duplicada de 'pool' aquí.

// Ruta para registrar un nuevo usuario
// URL: POST /api/users/registro
router.post('/registro', async (req, res) => {
  // ... (el resto de la lógica de registro es correcta)
    const { nombre, correo, pais, celular, contra } = req.body;
    // ... [Validaciones]
    const checkUserQuery = 'SELECT * FROM users WHERE correo = $1';
    const checkUserValues = [correo];

    try {
        const existingUser = await pool.query(checkUserQuery, checkUserValues);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contra, saltRounds);

        const insertUserQuery = `
          INSERT INTO users (nombre, correo, pais, celular, contra)
          VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, correo, pais, celular
        `;
        const insertUserValues = [nombre, correo, pais, celular, hashedPassword];

        const result = await pool.query(insertUserQuery, insertUserValues);
        const newUser = result.rows[0];

        const token = jwt.sign(
            { id: newUser.id, correo: newUser.correo },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        return res.status(201).json({ token, user: newUser });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
});

// Ruta para login de usuario
// URL: POST /api/users/iniciar-sesion
router.post('/iniciar-sesion', async (req, res) => {
    // ... (la lógica de login es correcta)
    const { correo, contra } = req.body;
    // ... [Validaciones]

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
            { id: user.id, correo: user.correo },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.status(200).json({ token, user });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
});

// ... (El resto de las rutas /me y / son correctas)

export default router;