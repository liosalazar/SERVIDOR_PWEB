const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getBestSellers,
  createProduct,
  updateProduct
} = require('../controllers/productController');

router.get('/', getAllProducts);               // Obtener todos los productos
router.get('/:id', getProductById);            // Obtener un producto por ID
router.get('/best-sellers', getBestSellers);   // Obtener los más vendidos (12)

router.post('/', createProduct);               // Crear un nuevo producto
router.put('/:id', updateProduct);             // Actualizar un producto por ID

module.exports = router;