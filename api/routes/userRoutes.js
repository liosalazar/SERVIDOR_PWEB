import { Router } from 'express';  // Usamos import en lugar de require
import { Pool } from 'pg';  // Usamos import en lugar de require
import bcrypt from 'bcrypt';  // Usamos import en lugar de require
import jwt from 'jsonwebtoken';  // Usamos import en lugar de require

const router = Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Asegúrate de tener la URL de la base de datos en .env
});

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { nombre, correo, pais, celular, contra } = req.body;

  // Validar la entrada
  if (!nombre || !correo || !pais || !celular || !contra) {
    return res.status(400).json({ message: 'Por favor, completa todos los campos' });
  }

  // Verificar si el usuario ya existe
  const checkUserQuery = 'SELECT * FROM users WHERE correo = $1';
  const checkUserValues = [correo];

  try {
    const existingUser = await pool.query(checkUserQuery, checkUserValues);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña antes de guardarla
    const saltRounds = 10; // Puedes ajustar el número de rondas de sal según tus necesidades
    const hashedPassword = await bcrypt.hash(contra, saltRounds);

    // Insertar el nuevo usuario en la base de datos
    const insertUserQuery = `
      INSERT INTO users (nombre, correo, pais, celular, contra)
      VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, correo, pais, celular
    `;
    const insertUserValues = [nombre, correo, pais, celular, hashedPassword];

    const result = await pool.query(insertUserQuery, insertUserValues);
    const newUser = result.rows[0];

    // Crear un JWT para el nuevo usuario
    const token = jwt.sign(
      { id: newUser.id, correo: newUser.correo },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // El token expirará en 1 hora
    );

    return res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});

// Ruta para login de usuario
router.post('/iniciar-sesion', async (req, res) => {
  const { correo, contra } = req.body;

  if (!correo || !contra) {
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
  }

  try {
    // Verificar si el usuario existe
    const checkUserQuery = 'SELECT * FROM users WHERE correo = $1';
    const checkUserValues = [correo];
    const result = await pool.query(checkUserQuery, checkUserValues);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Correo no encontrado' });
    }

    const user = result.rows[0];

    // Comparar la contraseña proporcionada con la almacenada
    const isMatch = await bcrypt.compare(contra, user.contra);

    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Crear un JWT para el usuario que ha iniciado sesión
    const token = jwt.sign(
      { id: user.id, correo: user.correo },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // El token expirará en 1 hora
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});

// Ruta para obtener los datos del usuario autenticado
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Obtener el token desde el encabezado

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó el token de autenticación' });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obtener los datos del usuario
    const result = await pool.query('SELECT id, nombre, correo, pais, celular FROM users WHERE id = $1', [decoded.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]); // Enviar los datos del usuario
  } catch (err) {
    console.error("Error al verificar el token", err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para obtener todos los usuarios (opcional, para administración)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, correo, pais, celular FROM users');
    res.json(result.rows); // Retorna los usuarios en formato JSON
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;  // Usamos export default para exportar el router
