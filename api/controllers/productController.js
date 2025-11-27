const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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

// Crear un nuevo producto
const createProduct = async (req, res) => {
  const { nombre, descripcion, precio, imagen_url, categoriaId, stock } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products (nombre, descripcion, precio, imagen_url, categoriaId, stock)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, descripcion, precio, imagen_url, categoriaId, stock || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el producto', error: err });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, imagen_url, categoriaId, stock } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products SET nombre = $1, descripcion = $2, precio = $3, imagen_url = $4, categoriaId = $5, stock = $6
       WHERE id = $7 RETURNING *`,
      [nombre, descripcion, precio, imagen_url, categoriaId, stock, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el producto', error: err });
  }
};

// Borrar producto
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json({ message: 'Producto eliminado', producto: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el producto', error: err });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };