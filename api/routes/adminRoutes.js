import express from 'express';
import adminController from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, isAdmin);

// --- GESTIÓN DE USUARIOS (Punto 15 y 16) ---
router.get('/users', adminController.getAdminUsers);
router.get('/users/:id', adminController.getAdminUserDetail);
router.put('/users/:id/status', adminController.toggleUserStatus);

// --- GESTIÓN DE ÓRDENES (Punto 20 y 21) ---
router.get('/orders', adminController.getAdminOrders);
router.get('/orders/:id', adminController.getAdminOrderDetail);
router.put('/orders/:id/cancel', adminController.cancelOrder);

export default router;
