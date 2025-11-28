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


// 1. MONTAJE DE TODAS LAS RUTAS DE LA API
// 🚨 Nota: Montamos sin el prefijo '/api' aquí, asumiendo que Azure o el frontend lo añade.
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes); 
app.use('/admin', adminRoutes);

// 2. MANEJO EXPLÍCITO DE FALLOS DE LA API (DEBE IR ANTES DEL CATCH-ALL *)
// Esto captura cualquier URL que empiece por /api/ y que no fue capturada por las rutas de arriba.
// Garantiza que devolvemos JSON (y no HTML) para errores de la API.
app.use('/api', (req, res) => {
    res.status(404).json({ message: 'Ruta de API no encontrada. Verifique la URL y el método de la solicitud.' });
});


// 3. MANEJO DE RUTAS DEL FRONTEND (Catch-All)
// La lógica aquí debe ir AL FINAL para no interferir con las rutas de API.

// La ruta raíz siempre sirve la página principal de React
app.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_BUILD_PATH, 'index.html'));
});

// Cualquier otra ruta que no sea API debe ser manejada por React Router (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(FRONTEND_BUILD_PATH, 'index.html'));
});

// --- INICIAR EL SERVIDOR DESPUÉS DE LA CONEXIÓN DB ---
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