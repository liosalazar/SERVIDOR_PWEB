// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js'; // Pool de DB

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

// Rutas de tu aplicación
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); 

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('API está funcionando correctamente. Origen permitido: ' + allowedOrigins);
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