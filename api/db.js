// db.js
import { Pool } from 'pg';
// No necesitamos dotenv si dependemos de las variables de Azure

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Esta es la configuración estándar para conexiones externas a Azure PG:
  ssl: { 
    rejectUnauthorized: false 
  },
});

export default pool;