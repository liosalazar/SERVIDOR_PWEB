const express = require('express');
const router = express.Router();

// Simulamos la interacción con la base de datos
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
});

// Crear una nueva categoría
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO categories (name, description)
      VALUES ($1, $2) RETURNING *`,
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar la categoría:', error);
    res.status(500).json({ message: 'Error al agregar la categoría' });
  }
});

module.exports = router;
