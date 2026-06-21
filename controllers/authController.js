const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Inicializar usuarios por defecto
exports.initializeUsers = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedAdminPassword = await bcrypt.hash('@cceso2026', 10);
      await User.create({
        username: 'admin',
        password: hashedAdminPassword,
        role: 'admin'
      });
      console.log('Usuario admin creado');
    }

    const guestExists = await User.findOne({ username: 'invitado' });
    if (!guestExists) {
      const hashedGuestPassword = await bcrypt.hash('Cl@v32026', 10);
      await User.create({
        username: 'invitado', // Se corrigió el typo de inivitado a invitado
        password: hashedGuestPassword,
        role: 'guest'
      });
      console.log('Usuario invitado creado');
    }
  } catch (error) {
    console.error('Error inicializando usuarios:', error);
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Aceptar 'inivitado' como alias de 'invitado' por el typo
    const searchUsername = username === 'inivitado' ? 'invitado' : username;

    const user = await User.findOne({ username: searchUsername });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const payload = {
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.role });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
};
