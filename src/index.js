const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes'); // ¡Importar nuevo router!
const app = express();
const PORT = 3000;
// el dotenv siempre primerom despues de las constantes
require('dotenv').config();

// Solo importamos para que se ejecute la conexión de prueba y se inicialice el pool
require('./config/db');

app.use(express.json());

app.use('/api/users', userRoutes); // <-- AQUÍ se define /api/users

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/locations', locationRoutes); // <-- AQUÍ se define la nueva base

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});