import { Router } from 'express'; 
import pool from '../db.js'; 
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 

// Importamos los middlewares de autenticación
import { protect, isAdmin } from '../middleware/authMiddleware.js';

// Importamos los controladores de órdenes y la función de cambio de contraseña
import { getUserOrders, getOrderById, createOrder } from '../controllers/orderController.js'; 
import { changePassword } from '../controllers/authController.js'; // ⬅️ ASUMIENDO QUE ESTÁ AQUÍ

const router = Router();

// --- Ruta para registrar un nuevo usuario ---
router.post('/registro', async (req, res) => {
    // ... (Tu código de registro permanece igual - Es SEGURO)
});

// --- Ruta para login de usuario ---
router.post('/iniciar-sesion', async (req, res) => {
    const { correo, contra } = req.body;

    try {
        // Sugerencia: Limitar la selección solo a los campos necesarios para la verificación (id, rol, contra)
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

// --- RUTA PROTEGIDA: Obtener perfil del usuario autenticado ---
router.get('/me', protect, async (req, res) => { 
    // ... (Tu código de /me permanece igual)
});

// --- RUTA PROTEGIDA: Actualizar datos de perfil del usuario ---
router.patch('/profile', protect, async (req, res) => { 
    // ... (Tu código de /profile permanece igual - Es funcional y seguro)
});

// 🟢 RUTA CLAVE: Cambiar Contraseña
// Consume la función changePassword del backend
router.put('/cambiar-contrasena', protect, changePassword);


// --- Rutas de Órdenes (Usan protect) ---
router.get('/orders', protect, getUserOrders);

router.get('/orders/:id', protect, getOrderById);

// Si tienes la ruta de creación de orden, también debería ir aquí:
// router.post('/orders', protect, createOrder); 

export default router;