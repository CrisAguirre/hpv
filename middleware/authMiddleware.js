const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Obtener el token del header
  const token = req.header('Authorization');

  // Comprobar si no hay token
  if (!token) {
    return res.status(401).json({ message: 'No hay token, permiso denegado' });
  }

  try {
    // Extraer token de 'Bearer token'
    const actualToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
    
    // Verificar el token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET || 'secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token no válido' });
  }
};
