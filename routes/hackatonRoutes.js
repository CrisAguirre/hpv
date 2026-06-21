const express = require('express');
const router = express.Router();
const hackatonController = require('../controllers/hackatonController');
const authMiddleware = require('../middleware/authMiddleware');

// Validar que el usuario sea admin
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado: Se requiere rol de administrador' });
  }
};

// Rutas protegidas (todas requieren token)
router.use(authMiddleware);

// Rutas de estudiante (invitado)
router.post('/submit', hackatonController.submitPhase);
router.get('/my-submissions', hackatonController.getMySubmissions);

// Rutas de admin
router.get('/submissions', adminMiddleware, hackatonController.getSubmissions);

module.exports = router;
