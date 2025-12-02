import { Router } from 'express';
import { Pool } from 'pg';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

const router = Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/send-code', async (req, res) => {
  const { email } = req.body;

  try {
    const users = await pool.query('SELECT * FROM users WHERE correo = $1', [email]);
    if (users.rows.length === 0) {
      return res.status(400).json({ message: 'Correo no encontrado' });
    }

    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Tu código de recuperación es: ${codigo}`,
    };

    await transporter.sendMail(mailOptions);

    await pool.query('UPDATE users SET recovery_code = $1 WHERE correo = $2', [codigo, email]);

    res.status(200).json({ message: 'Código enviado al correo' });
  } catch (error) {
    console.error('Error en /send-code:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud de código' });
  }
});

router.post('/verify-code', async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await pool.query('SELECT recovery_code FROM users WHERE correo = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Correo no encontrado' });
    }

    const storedCode = user.rows[0].recovery_code;

    if (storedCode === code) {
      res.status(200).json({ message: 'Código correcto' });
    } else {
      res.status(400).json({ message: 'Código incorrecto' });
    }
  } catch (error) {
    console.error('Error en /verify-code:', error);
    res.status(500).json({ message: 'Error al verificar el código' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE correo = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Correo no encontrado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query('UPDATE users SET contra = $1, recovery_code = NULL WHERE correo = $2', [hashedPassword, email]);

    res.status(200).json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.error('Error en /reset-password:', error);
    res.status(500).json({ message: 'Error al actualizar la contraseña' });
  }
});

export default router;
