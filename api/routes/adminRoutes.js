import express from 'express';
import adminController from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, isAdmin);

router.get('/users', adminController.getAdminUsers);
router.get('/users/:id', adminController.getAdminUserDetail);
router.put('/users/:id/status', adminController.toggleUserStatus);

router.get('/orders', adminController.getAdminOrders);
router.get('/orders/:id', adminController.getAdminOrderDetail);
router.put('/orders/:id/cancel', adminController.cancelOrder);

export default router;
