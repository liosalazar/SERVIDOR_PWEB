const express = require('express');
const router = express.Router();

// Simulamos la interacción con la base de datos
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  const { name, description, price, image, categoryId, sales, isNew } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, image, categoryId, sales, isNew)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description, price, image, categoryId, sales, isNew]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    res.status(500).json({ message: 'Error al agregar el producto' });
  }
});

module.exports = router;
