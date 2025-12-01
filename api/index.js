import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pool from './db.js';
import path from 'path'; 
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const allowedOrigins = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: allowedOrigins, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true,
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_BUILD_PATH = path.join(__dirname, 'client');
app.use(express.static(FRONTEND_BUILD_PATH));


import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js';


import orderRoutes from './routes/ordersRoutes.js';

const apiRouter = express.Router();

apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/users', userRoutes); 
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/orders', orderRoutes); 
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_BUILD_PATH, 'index.html'));
});

app.get(/.*/, (req, res) => { 
    res.sendFile(path.join(FRONTEND_BUILD_PATH, 'index.html'));
});

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