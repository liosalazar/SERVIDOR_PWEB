// C:/.../Backend/routes/orderRoutes.js
import express from 'express';
// Importa las tres funciones que necesitas
import { createOrder, getUserOrders, getOrderById } from '../controllers/orderController.js'; 
import { protect, isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router(); 

router.post('/', protect, createOrder); 

router.get('/', protect, getUserOrders);

router.get('/:id', protect, getOrderById);

export default router;