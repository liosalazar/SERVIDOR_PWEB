const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Login del usuario
const loginUser = async (req, res) => {
  const { correo, contra } = req.body;

  try {
    // Buscar al usuario por correo y contraseña
    const result = await pool.query(
      'SELECT * FROM users WHERE correo = $1 AND contra = $2',
      [correo, contra]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    // Si el usuario existe, devolver sus datos
    const user = result.rows[0];
    res.status(200).json(user);
  } catch (err) {
    console.error("Error de autenticación", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { loginUser };
