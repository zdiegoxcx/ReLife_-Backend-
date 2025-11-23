const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes'); 
const db = require('./config/db'); 

const app = express();
const PORT = 3000;

require('dotenv').config();

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

// --- RUTAS ---
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/', productRoutes); 

app.get('/login', (req, res) => res.render('login'));
app.get('/user', (req, res) => res.render('user'));
app.get('/categories', (req, res) => res.render('categories'));

// --- RUTA HOME (La importante) ---
app.get('/', async (req, res) => {
    try {
        const query = `
            SELECT p.tdp_id, p.tdp_nmb, p.tdp_pre, c.tct_id, c.tct_nmb as categoria, i.timg_url
            FROM tab_prd p
            JOIN tab_cat c ON p.tdp_cat = c.tct_id
            LEFT JOIN tab_img i ON p.tdp_id = i.timg_prd
            WHERE p.tdp_est = true
            ORDER BY p.tdp_fch DESC
        `;
        const result = await db.query(query);
        
        // Agrupamos los productos
        const groupedProducts = {};
        result.rows.forEach(prod => {
            if (!groupedProducts[prod.categoria]) {
                groupedProducts[prod.categoria] = { id: prod.tct_id, products: [] };
            }
            groupedProducts[prod.categoria].products.push(prod);
        });

        // Enviamos 'categories' a la vista
        res.render('index', { categories: groupedProducts });

    } catch (error) {
        console.error(error);
        res.render('index', { categories: {} });
    }
});

// --- RUTA CATEGORÍA INDIVIDUAL ---
app.get('/category/:id', async (req, res) => {
    const catId = req.params.id;
    try {
        const catRes = await db.query('SELECT tct_nmb FROM tab_cat WHERE tct_id = $1', [catId]);
        if(catRes.rows.length === 0) return res.redirect('/');
        
        const prodRes = await db.query(`
            SELECT p.*, i.timg_url FROM tab_prd p
            LEFT JOIN tab_img i ON p.tdp_id = i.timg_prd
            WHERE p.tdp_cat = $1 AND p.tdp_est = true`, [catId]);

        res.render('category_view', { categoryName: catRes.rows[0].tct_nmb, products: prodRes.rows });
    } catch (err) { res.redirect('/'); }
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));