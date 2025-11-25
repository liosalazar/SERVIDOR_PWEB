const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Enviar código al correo
router.post('/send-code', async (req, res) => {
  const { email } = req.body;

  const users = await pool.query('SELECT * FROM users WHERE correo = $1', [email]);
  if (users.rows.length === 0) {
    return res.status(400).json({ message: 'Correo no encontrado' });
  }

  const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Enviar el código por correo (configura tu servicio de correo aquí)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Tu código de recuperación es: ${codigo}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error al enviar el correo' });
    }
    // Guardar el código en la base de datos (o usar un sistema más seguro)
    pool.query('UPDATE users SET recovery_code = $1 WHERE correo = $2', [codigo, email]);
    res.status(200).json({ message: 'Código enviado al correo' });
  });
});

// Verificar código
router.post('/verify-code', async (req, res) => {
  const { email, code } = req.body;

  const user = await pool.query('SELECT * FROM users WHERE correo = $1', [email]);
  if (user.rows.length === 0) {
    return res.status(400).json({ message: 'Correo no encontrado' });
  }

  const storedCode = user.rows[0].recovery_code;
  if (storedCode === code) {
    res.status(200).json({ message: 'Código correcto' });
  } else {
    res.status(400).json({ message: 'Código incorrecto' });
  }
});

// Cambiar contraseña
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await pool.query('SELECT * FROM users WHERE correo = $1', [email]);
  if (user.rows.length === 0) {
    return res.status(400).json({ message: 'Correo no encontrado' });
  }

  // Actualizar la contraseña
  await pool.query('UPDATE users SET contra = $1 WHERE correo = $2', [newPassword, email]);
  res.status(200).json({ message: 'Contraseña actualizada con éxito' });
});

module.exports = router;
