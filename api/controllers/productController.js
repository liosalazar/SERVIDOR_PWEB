const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Leer desde .env
});

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos', error: err });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el producto', error: err });
  }
};

// Obtener los más vendidos (12)
const getBestSellers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY sales DESC LIMIT 12');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).send(`Error al obtener los best sellers: ${error}`);
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  const { name, description, price, image, categoryId } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, image, categoryId) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, image, categoryId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el producto', error: err });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, categoryId } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, image = $4, categoryId = $5 WHERE id = $6 RETURNING *',
      [name, description, price, image, categoryId, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el producto', error: err });
  }
};

module.exports = { getAllProducts, getProductById, getBestSellers, createProduct, updateProduct };