// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Importamos el pool centralizado
import pool from './db.js';

dotenv.config();

const app = express();

// --- CONFIGURACIÓN DE CORS DINÁMICA ---
// Lee la URL del frontend desde las variables de entorno de Azure.
// Si no está definida (o en desarrollo), usa localhost.
const allowedOrigins = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

// Rutas
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); 

// Rutas de prueba (opcional)
app.get('/', (req, res) => {
    res.send('API está funcionando correctamente.');
});

// --- INICIAR SERVIDOR DESPUÉS DE LA CONEXIÓN DB ---
const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        // Conexión a la base de datos PostgreSQL
        await pool.query('SELECT 1'); // Prueba la conexión
        console.log('Conexión a la base de datos PostgreSQL exitosa');

        // Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
            console.log(`CORS permitido para: ${allowedOrigins}`);
        });

    } catch (err) {
        console.error('Error FATAL de conexión a la DB:', err.message);
        // Esto ayudará a diagnosticar el "Application Error" en Azure.
        process.exit(1); 
    }
}

startServer();