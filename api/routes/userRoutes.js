import { Router } from 'express'; 
import pool from '../db.js'; 
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 

import { protect, isAdmin } from '../middleware/authMiddleware.js';

import { getUserOrders, getOrderById } from '../controllers/orderController.js'; 

import { changePassword } from '../controllers/userController.js'; 

const router = Router();

router.post('/registro', async (req, res) => {
    const { nombre, correo, pais, celular, contra } = req.body;
    
    const checkUserQuery = 'SELECT * FROM users WHERE correo = $1';

    try {
        const existingUser = await pool.query(checkUserQuery, [correo]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contra, saltRounds);

        const insertUserQuery = `
            INSERT INTO users (nombre, correo, pais, celular, contra, rol, activo)
            VALUES ($1, $2, $3, $4, $5, 'cliente', TRUE) RETURNING id, nombre, correo, pais, celular, rol
            `;
        const result = await pool.query(insertUserQuery, [nombre, correo, pais, celular, hashedPassword]);
        const newUser = result.rows[0];
        
        const userResponse = {
            id: newUser.id,
            nombre: newUser.nombre,
            correo: newUser.correo,
            rol: newUser.rol,
            pais: newUser.pais,
            celular: newUser.celular,
        };

        const token = jwt.sign(
            { id: newUser.id, correo: newUser.correo, rol: newUser.rol }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        return res.status(201).json({ token, user: userResponse });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
});

router.post('/iniciar-sesion', async (req, res) => {
    const { correo, contra } = req.body;

    try {
        const checkUserQuery = 'SELECT id, nombre, correo, rol, pais, celular, contra, imagen_url FROM users WHERE correo = $1'; 
        const result = await pool.query(checkUserQuery, [correo]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' }); 
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(contra, user.contra);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const userResponse = {
            id: user.id,
            nombre: user.nombre, 
            correo: user.correo,
            rol: user.rol,
            pais: user.pais,
            celular: user.celular,
            imagen: user.imagen_url || null, 
        };

        const token = jwt.sign(
            { id: user.id, correo: user.correo, rol: user.rol }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        return res.status(200).json({ token, user: userResponse });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
});

router.get('/me', protect, async (req, res) => {
    try {
        const query = 'SELECT id, nombre, correo, rol, pais, celular, imagen_url FROM users WHERE id = $1';
        const result = await pool.query(query, [req.user.id]); 

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        const fullUser = result.rows[0];

        res.status(200).json({
            message: 'Datos del usuario autenticado',
            user: fullUser 
        });
    } catch (error) {
        console.error('Error al obtener perfil /me:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.patch('/profile', protect, async (req, res) => {
    const userId = req.user.id;
    const { nombre, pais, celular, imagen_url } = req.body;

    const fields = [];
    const values = [];
    let queryIndex = 1;

    if (nombre) {
        fields.push(`nombre = $${queryIndex++}`);
        values.push(nombre);
    }
    if (pais) {
        fields.push(`pais = $${queryIndex++}`);
        values.push(pais);
    }
    if (celular) {
        fields.push(`celular = $${queryIndex++}`);
        values.push(celular);
    }
    if (imagen_url) {
        fields.push(`imagen_url = $${queryIndex++}`);
        values.push(imagen_url);
    }
    
    if (fields.length === 0) {
        return res.status(400).json({ message: 'No hay datos válidos para actualizar.' });
    }

    values.push(userId); 

    const updateQuery = `
        UPDATE users SET ${fields.join(', ')} 
        WHERE id = $${queryIndex} 
        RETURNING id, nombre, correo, rol, pais, celular, imagen_url
    `;

    try {
        const result = await pool.query(updateQuery, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para actualizar.' });
        }

        const updatedUser = result.rows[0];

        res.status(200).json({
            message: 'Perfil actualizado exitosamente',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ message: 'Error del servidor al actualizar perfil.' });
    }
});

router.put('/cambiar-contrasena', protect, changePassword);

router.get('/orders', protect, getUserOrders);

router.get('/orders/:id', protect, getOrderById);

export default router;
