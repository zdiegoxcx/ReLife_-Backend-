const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// --- CONFIGURACIÓN DE MULTER (Subida de imágenes) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Guardamos en la carpeta public/uploads que creaste
        cb(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: function (req, file, cb) {
        // Generamos un nombre único: fecha + extensión original
        // Ej: producto-167891234.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// --- RUTA GET: Muestra el formulario ---
router.get('/publish', async (req, res) => {
    try {
        const catResult = await db.query('SELECT * FROM tab_cat ORDER BY tct_nmb ASC');
        const talResult = await db.query('SELECT * FROM tab_talla');

        res.render('publish', { 
            categories: catResult.rows,
            sizes: talResult.rows 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar formulario');
    }
});

// --- RUTA POST: Procesa la publicación ---
// 'upload.single('imagen')' procesa el archivo del input name="imagen"
router.post('/publish', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, categoria, talla, precio, descripcion, emailUsuario } = req.body;
        const imagenFile = req.file; // Aquí está la info de la imagen subida

        // Validaciones básicas
        if (!emailUsuario) {
            return res.status(401).send('Usuario no identificado. Inicia sesión nuevamente.');
        }
        if (!imagenFile) {
            return res.status(400).send('Debes subir una imagen.');
        }

        // 1. Insertar el Producto en tab_prd
        // Usamos RETURNING tdp_id para obtener el ID del producto recién creado
        const queryProducto = `
            INSERT INTO tab_prd (tdp_nmb, tdp_des, tdp_pre, tdp_est, tdp_fch, tdp_usr, tdp_cat, tdp_talla)
            VALUES ($1, $2, $3, true, NOW(), $4, $5, $6)
            RETURNING tdp_id
        `;
        
        const valuesProducto = [nombre, descripcion, precio, emailUsuario, categoria, talla];
        const resultProducto = await db.query(queryProducto, valuesProducto);
        
        const nuevoProductoId = resultProducto.rows[0].tdp_id;

        // 2. Insertar la Imagen en tab_img vinculada al producto
        // Guardamos la ruta relativa para poder usarla en el src del HTML
        const imageUrl = '/uploads/' + imagenFile.filename;
        
        const queryImagen = `
            INSERT INTO tab_img (timg_url, timg_alt, timg_prd)
            VALUES ($1, $2, $3)
        `;
        
        await db.query(queryImagen, [imageUrl, nombre, nuevoProductoId]);

        // ¡Éxito! Redirigimos al Home para ver el producto publicado
        res.redirect('/');

    } catch (error) {
        console.error('Error al publicar producto:', error);
        res.status(500).send('Error interno al publicar el producto.');
    }
});

module.exports = router;