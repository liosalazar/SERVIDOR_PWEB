const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categorías', error: err });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener la categoría', error: err });
  }
};

module.exports = { getAllCategories, getCategoryById };
