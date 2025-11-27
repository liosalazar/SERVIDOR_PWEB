const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategory
} = require('../controllers/categoriaController');

router.get('/', getAllCategories);

router.get('/:id', getCategoryById);

router.post('/', createCategory);

router.delete('/:id', deleteCategory);

module.exports = router;