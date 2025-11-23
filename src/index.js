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
app.get('/', async (req, res) => {
    try {
        // Traemos productos + ID de categoría
        const query = `
            SELECT 
                p.tdp_id, 
                p.tdp_nmb, 
                p.tdp_pre, 
                c.tct_id,            -- Necesitamos el ID para agrupar
                c.tct_nmb as categoria,
                i.timg_url
            FROM tab_prd p
            JOIN tab_cat c ON p.tdp_cat = c.tct_id
            LEFT JOIN tab_img i ON p.tdp_id = i.timg_prd
            WHERE p.tdp_est = true
            ORDER BY p.tdp_fch DESC
        `;
        
        const result = await db.query(query);
        const allProducts = result.rows;

        // LÓGICA DE AGRUPACIÓN:
        // Convertimos la lista plana en un Objeto: { 'Calzado': [prod1, prod2], 'Chaquetas': [...] }
        const groupedProducts = {};

        allProducts.forEach(prod => {
            const catName = prod.categoria;
            const catId = prod.tct_id;

            if (!groupedProducts[catName]) {
                // Si la categoría no existe en el grupo, la inicializamos
                groupedProducts[catName] = {
                    id: catId,
                    products: []
                };
            }
            // Agregamos el producto a su categoría
            groupedProducts[catName].products.push(prod);
        });

        // Enviamos 'categories' a la vista
        res.render('index', { categories: groupedProducts });

    } catch (error) {
        console.error('Error al cargar home:', error);
        res.render('index', { categories: {} });
    }
});

// --- NUEVA RUTA: Ver todos los productos de una categoría ---
app.get('/category/:id', async (req, res) => {
    const catId = req.params.id;
    try {
        // 1. Obtener nombre de la categoría
        const catQuery = 'SELECT tct_nmb FROM tab_cat WHERE tct_id = $1';
        const catResult = await db.query(catQuery, [catId]);
        
        if(catResult.rows.length === 0) return res.redirect('/');
        const catName = catResult.rows[0].tct_nmb;

        // 2. Obtener TODOS los productos de esa categoría
        const prodQuery = `
            SELECT p.*, i.timg_url 
            FROM tab_prd p
            LEFT JOIN tab_img i ON p.tdp_id = i.timg_prd
            WHERE p.tdp_cat = $1 AND p.tdp_est = true
        `;
        const prodResult = await db.query(prodQuery, [catId]);

        // Renderizamos una vista nueva (o reutilizamos category.ejs si quieres crearla)
        // Para hacerlo simple ahora, renderizamos 'category_view.ejs' (paso siguiente)
        res.render('category_view', { 
            categoryName: catName, 
            products: prodResult.rows 
        });

    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});