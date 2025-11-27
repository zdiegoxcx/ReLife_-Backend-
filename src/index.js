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

// --- RUTAS API ---
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/', productRoutes); 

// --- RUTAS VISTAS SIMPLES ---
app.get('/login', (req, res) => res.render('login'));
// 1. Dashboard (Lectura)
app.get('/user', (req, res) => res.render('user'));

// 2. Edición (Formulario)
app.get('/user/edit', (req, res) => res.render('edit_profile'));

app.get('/categories', (req, res) => res.render('categories'));

// =======================================================
// === RUTA HOME: AQUI ESTA LA LOGICA DEL FILTRO ===
// =======================================================
app.get('/', async (req, res) => {
    try {
        // 1. Obtener TODAS las categorías para llenar el select del filtro
        const catListResult = await db.query('SELECT * FROM tab_cat ORDER BY tct_nmb ASC');
        const allCategories = catListResult.rows;

        // 2. Construir la consulta BASE
        let query = `
            SELECT p.tdp_id, p.tdp_nmb, p.tdp_pre, c.tct_id, c.tct_nmb as categoria, i.timg_url
            FROM tab_prd p
            JOIN tab_cat c ON p.tdp_cat = c.tct_id
            LEFT JOIN tab_img i ON p.tdp_id = i.timg_prd
            WHERE p.tdp_est = true
        `;
        
        const params = [];
        let paramIndex = 1; // Contador para $1, $2, $3...

        // 3. [IMPORTANTE] AQUI LEEMOS LA URL Y AGREGAMOS FILTROS AL SQL
        // Si la URL trae ?categoryId=5, agregamos el filtro al SQL
        if (req.query.categoryId) {
            query += ` AND p.tdp_cat = $${paramIndex}`;
            params.push(req.query.categoryId);
            paramIndex++;
        }

        // Si la URL trae ?minPrice=1000
        if (req.query.minPrice) {
            query += ` AND p.tdp_pre >= $${paramIndex}`;
            params.push(req.query.minPrice);
            paramIndex++;
        }

        // Si la URL trae ?maxPrice=50000
        if (req.query.maxPrice) {
            query += ` AND p.tdp_pre <= $${paramIndex}`;
            params.push(req.query.maxPrice);
            paramIndex++;
        }

        query += ` ORDER BY p.tdp_fch DESC`;

        // 4. Ejecutamos la consulta FINAL con todos los filtros aplicados
        const result = await db.query(query, params);
        
        // 5. Agrupar productos (Lógica visual)
        const groupedProducts = {};
        result.rows.forEach(prod => {
            if (!groupedProducts[prod.categoria]) {
                groupedProducts[prod.categoria] = { id: prod.tct_id, products: [] };
            }
            groupedProducts[prod.categoria].products.push(prod);
        });

        // 6. ENVIAR DATOS A LA VISTA
        res.render('index', { 
            categories: groupedProducts, 
            allCategories: allCategories, // Llena el select de categorías
            filters: req.query || {}      // Mantiene los números que escribiste en los inputs
        });

    } catch (error) {
        console.error('Error en el Home:', error);
        res.render('index', { categories: {}, allCategories: [], filters: {} });
    }
});

// --- RUTA CATEGORÍA INDIVIDUAL (Ver más) ---
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
    } catch (err) { 
        console.error(err);
        res.redirect('/'); 
    }
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));