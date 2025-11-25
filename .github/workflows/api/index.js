const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Cargar las variables de entorno

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes'); // Asegúrate de que esta línea solo aparezca una vez

// Usar rutas
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes); // Agregar la ruta de login de usuarios

// Conectar a la base de datos
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Leer la URL de la base de datos desde .env
});

pool.connect()
  .then(() => console.log('Conectado a la base de datos PostgreSQL'))
  .catch((err) => console.error('Error de conexión:', err));

// Definir el puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
