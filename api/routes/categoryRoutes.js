const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById
} = require('../controllers/categoryController');

router.get('/', getAllCategories);        // Obtener todas las categorías
router.get('/:id', getCategoryById);      // Obtener una categoría por ID

module.exports = router;