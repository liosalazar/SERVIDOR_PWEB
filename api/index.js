// index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js'; // Pool de DB
import path from 'path'; 
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// --- CONFIGURACIÓN DE CORS ---
const allowedOrigins = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(express.json());

app.use(cors({
  origin: allowedOrigins, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true,
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_BUILD_PATH = path.join(__dirname, 'client');

app.use(express.static(FRONTEND_BUILD_PATH));


// Rutas de tu aplicación
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); 

app.get('/', (req, res) => {
    // Redirige la raíz a la página principal de React
    res.sendFile(path.join(FRONTEND_BUILD_PATH, 'index.html'));
});

app.get('*', (req, res) => {
    // Si la URL comienza con /api, y no se ha encontrado, es un error de API (404)
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ message: 'Ruta de API no encontrada.' });
    }
    
    // Si no es /api, devuelve el archivo principal de React
    res.sendFile(path.join(FRONTEND_BUILD_PATH, 'index.html'));
});

// --- INICIAR EL SERVIDOR DESPUÉS DE LA CONEXIÓN DB ---
const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await pool.query('SELECT 1'); 
        console.log('✅ Conexión a la base de datos PostgreSQL exitosa');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
            console.log(`CORS permitido para: ${allowedOrigins}`);
        });

    } catch (err) {
        console.error('❌ Error FATAL de conexión a la DB:', err.message);
        process.exit(1); 
    }
}

startServer();