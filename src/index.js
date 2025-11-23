const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes'); // Importamos rutas de productos
const db = require('./config/db'); // Importamos la conexión a la BD

const app = express();
const PORT = 3000;

// Configuración de variables de entorno
require('dotenv').config();

// Middleware para procesar JSON
app.use(express.json());

// --- CONFIGURACIÓN DE EJS ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// --- ARCHIVOS ESTÁTICOS (CSS, JS, Imágenes subidas) ---
app.use(express.static(path.join(__dirname, '../public')));

// --- RUTAS API ---
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/categories', categoryRoutes);

// --- RUTAS DE VISTAS ---

// 1. Conectamos las rutas de productos (incluye /publish y el proceso de subida)
app.use('/', productRoutes); 

// 2. Ruta Login
app.get('/login', (req, res) => {
  res.render('login');
});

// 3. Ruta Perfil de Usuario
app.get('/user', (req, res) => {
  res.render('user');
});

// 4. Ruta Categorías (Panel de admin)
app.get('/categories', (req, res) => {
  res.render('categories');
});

// 5. RUTA HOME (Raíz) - Con carga de productos
// Esta es la ÚNICA definición para '/' que debes tener
app.get('/', async (req, res) => {
    try {
        // Consultamos los productos activos desde la base de datos
        const query = `
            SELECT 
                p.tdp_id, 
                p.tdp_nmb, 
                p.tdp_pre, 
                c.tct_nmb as categoria,
                i.timg_url
            FROM tab_prd p
            JOIN tab_cat c ON p.tdp_cat = c.tct_id
            LEFT JOIN tab_img i ON p.tdp_id = i.timg_prd
            WHERE p.tdp_est = true
            ORDER BY p.tdp_fch DESC
        `;
        
        const result = await db.query(query);
        const products = result.rows;

        // Renderizamos la vista enviando los datos
        res.render('index', { products: products });

    } catch (error) {
        console.error('Error al cargar productos:', error);
        // En caso de error, enviamos lista vacía para evitar fallos
        res.render('index', { products: [] });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});