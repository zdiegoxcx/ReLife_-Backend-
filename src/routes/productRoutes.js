// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importamos la conexión a la BD

// GET /publish -> Muestra el formulario
router.get('/publish', async (req, res) => {
    try {
        // 1. Necesitamos las categorías para el <select> del diseño
        const catResult = await db.query('SELECT * FROM tab_cat ORDER BY tct_nmb ASC');
        
        // 2. IMPORTANTE: Tu base de datos OBLIGA a tener una Talla (tab_talla). 
        // Aunque no está en tu dibujo, debemos agregar el campo o fallará al guardar.
        const talResult = await db.query('SELECT * FROM tab_talla');

        // Renderizamos la vista 'publish.ejs' pasando los datos
        res.render('publish', { 
            categories: catResult.rows,
            sizes: talResult.rows 
        });

    } catch (error) {
        console.error('Error al cargar formulario de publicación:', error);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;