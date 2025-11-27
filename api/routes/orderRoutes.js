const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); // Importar el middleware
const cartController = require('../controllers/cartController');

router.post('/checkout', verifyToken, cartController.createOrder);


module.exports = router;
