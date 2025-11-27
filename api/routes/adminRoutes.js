// api/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Nota: En el trabajo final, todas estas rutas DEBEN tener middleware de seguridad
router.use(verifyToken, isAdmin); 

// --- GESTIÓN DE USUARIOS (Punto 15 y 16) ---
// 15. Listado de usuarios con filtros y paginación
router.get('/users', adminController.getAdminUsers);

// 16. Detalle del usuario y sus órdenes
router.get('/users/:id', adminController.getAdminUserDetail);

// 15. Activar/Desactivar usuario
router.put('/users/:id/status', adminController.toggleUserStatus);

// --- GESTIÓN DE ÓRDENES (Punto 20 y 21) ---
// 20. Listado de órdenes con filtros y paginación
router.get('/orders', adminController.getAdminOrders);

// 21. Detalle de la orden
router.get('/orders/:id', adminController.getAdminOrderDetail);

// 21. Cancelar orden
router.put('/orders/:id/cancel', adminController.cancelOrder);

module.exports = router;