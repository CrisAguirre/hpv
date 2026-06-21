require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const { initializeUsers } = require('./controllers/authController');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Conectado a MongoDB');
    // Inicializar usuarios por defecto
    initializeUsers();
  })
  .catch(err => {
    console.error('Error conectando a MongoDB:', err);
  });

// Rutas API
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API de Hackaton Pedagógica Virtual en funcionamiento');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
