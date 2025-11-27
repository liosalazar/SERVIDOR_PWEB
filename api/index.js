// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Importamos el pool centralizado desde db.js
import pool from './db.js';

// Carga las variables de entorno (solo para desarrollo local)
dotenv.config();

const app = express();

// --- CONFIGURACIÓN DE CORS ---
// Lee la URL del frontend desde las variables de entorno de Azure.
// Si no está definida (o en desarrollo), usa localhost.
// Esto permite que tu frontend se comunique con el backend.
const allowedOrigins = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(express.json());

// ¡CORRECCIÓN CRUCIAL! Ahora el middleware CORS usa la variable allowedOrigins
app.use(cors({
  origin: allowedOrigins, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, // Importante si manejas cookies o tokens en headers
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
// Azure usará process.env.PORT, o 3001 por defecto.
const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        // Conexión a la base de datos PostgreSQL: Ejecuta una consulta simple para probar el Pool
        await pool.query('SELECT 1'); 
        console.log('✅ Conexión a la base de datos PostgreSQL exitosa');

        // Iniciar el servidor SOLO si la conexión DB fue exitosa
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
            console.log(`CORS permitido para: ${allowedOrigins}`);
        });

    } catch (err) {
        // Si hay error de DB (URL, SSL, Contraseña), el servidor se detiene aquí.
        console.error('❌ Error FATAL de conexión a la DB:', err.message);
        // process.exit(1) fuerza el cierre del proceso, mostrando el error en el Log Stream de Azure.
        process.exit(1); 
    }
}

startServer();