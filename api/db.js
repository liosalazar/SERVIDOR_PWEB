// db.js
import { Pool } from 'pg';
import dotenv from 'dotenv'; // <--- 1. Importa dotenv

dotenv.config(); // <--- 2. Carga las variables AQUÍ mismo

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false 
  },
});

export default pool;