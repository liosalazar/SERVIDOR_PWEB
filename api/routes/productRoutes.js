import { Router } from 'express'; // Usamos import en lugar de require
import { Pool } from 'pg'; // Usamos import en lugar de require

const router = Router();

// Crear una instancia de Pool para la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Obtienes la cadena de conexión desde .env
});

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows); // Retorna los productos en formato JSON
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' }); // Error 500 si hay un problema
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
    res.status(201).json(result.rows[0]); // Retorna el producto creado
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    res.status(500).json({ message: 'Error al agregar el producto' }); // Error 500 si no se pudo agregar el producto
  }
});

// Exportar el router para usarlo en index.js
export default router;  // Es importante exportar con `export default`
