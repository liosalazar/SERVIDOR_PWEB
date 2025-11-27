import { Client } from 'pg';
import fs from 'fs';

const conn = new Client({
  host: 'supermarketserver.postgres.database.azure.com',
  user: 'julitodev',
  password: 'tu_contraseña_real_aqui',
  database: 'postgres',
  port: 5432,
  ssl: true // Desactiva SSL temporalmente para probar la conexión sin él
});

conn.connect()
  .then(() => console.log('Conexión exitosa a PostgreSQL'))
  .catch((err) => console.error('Error de conexión:', err));

export default conn;
