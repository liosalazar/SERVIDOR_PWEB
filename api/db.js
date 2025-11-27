// db.js (Usa Pool en lugar de Client)
import { Pool } from 'pg';
// Ya no necesitamos 'fs'

// 1. Usa la variable de entorno de Azure (DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
  // 2. Configuración SSL necesaria para Azure (ignora la validación)
  // Nota: Esto reemplaza a tu ssl: false anterior, que fallaría en Azure.
  ssl: { 
    rejectUnauthorized: false 
  },
});

// 3. No es necesario llamar a pool.connect() aquí, 
// lo haremos en index.js para probar la conexión antes de arrancar el servidor.

export default pool; // Exportamos el Pool para usarlo en index.js y userRoutes.js