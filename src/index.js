const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes'); // ¡Importar nuevo router!
const categoryRoutes = require('./routes/categoryRoutes');
const app = express();
const PORT = 3000;

// el dotenv siempre primero despues de las constantes
require('dotenv').config();
// Solo importamos para que se ejecute la conexión de prueba y se inicialice el pool
require('./config/db')

app.use(express.json());


// --- CONFIGURACIÓN DE EJS ---
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '../views'));


// --- RUTAS DE VISTAS ---
app.get('/', (req, res) => {
  res.render('index');
});

//este era el antiguo
//app.get('/', (req, res) => {
//  res.sendFile(path.join(__dirname, '../public/index.html'));
//});


// --- ARCHIVOS ESTÁTICOS ---
app.use(express.static(path.join(__dirname, '../public')));


// --- RUTAS API ---
app.use('/api/users', userRoutes); // <-- AQUÍ se define /api/users

app.use('/api/locations', locationRoutes); // <-- AQUÍ se define la nueva base

app.use('/api/categories', categoryRoutes);

// --- RUTAS DE VISTAS ---

// Ruta Home
app.get('/', (req, res) => {
  res.render('index');
});

// 1. Ruta Login
app.get('/login', (req, res) => {
  res.render('login');
});

// 2. Ruta Perfil de Usuario
app.get('/user', (req, res) => {
  res.render('user');
});

// 3. Ruta Categorías (Panel de admin)
app.get('/categories', (req, res) => {
  res.render('categories');
});


// Iniciar el servidor  
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

