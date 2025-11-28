// index.js (CÓDIGO CORREGIDO Y REORDENADO)

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pool from './db.js'; // Pool de DB
import path from 'path'; 
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// --- CONFIGURACIÓN DE MIDDLEWARES Y CORS ---
const allowedOrigins = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(express.json()); // Middleware para parsear JSON
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: allowedOrigins, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true,
}));

// Configuración para servir archivos estáticos del frontend (React Build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_BUILD_PATH = path.join(__dirname, 'client');
app.use(express.static(FRONTEND_BUILD_PATH));


// Rutas de tu aplicación (Importaciones)
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js';


// index.js (Debe volver a la configuración con /api)

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes); // ✅ ESTO ES NECESARIO
app.use('/api/admin', adminRoutes);


// index.js (Bloque de manejo de errores al final de todas las rutas)

app.use('/api', (req, res) => {
    res.status(404).json({ message: 'Ruta de API no encontrada. Verifique la URL y el método de la solicitud.' });
});

app.use('*', (req, res) => {
    res.sendFile(path.join(FRONTEND_BUILD_PATH, 'index.html'));
});

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        // Verifica la conexión a la base de datos
        await pool.query('SELECT 1'); 
        console.log('✅ Conexión a la base de datos PostgreSQL exitosa');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
            console.log(`CORS permitido para: ${allowedOrigins}`);
        });

    } catch (err) {
        console.error('❌ Error FATAL de conexión a la DB:', err.message);
        // Si no puede conectar a la DB, detiene el proceso.
        process.exit(1); 
    }
}

startServer();