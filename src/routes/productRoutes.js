const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- CONFIGURACIÓN DE MULTER (Subida de imágenes) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Error: Solo se permiten imágenes (jpeg, jpg, png, webp)'));
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2000000 }, // 2MB por archivo
    fileFilter: fileFilter
});

// ==========================================
// RUTA 1: Mostrar formulario de publicación
// ==========================================
router.get('/publish', async (req, res) => {
    try {
        const catResult = await db.query('SELECT * FROM tab_cat ORDER BY tct_nmb ASC');
        const talResult = await db.query('SELECT * FROM tab_talla');
        res.render('publish', { categories: catResult.rows, sizes: talResult.rows });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar formulario');
    }
});

// ==========================================
// RUTA 2: PROCESAR PUBLICACIÓN (MÚLTIPLES FOTOS)
// ==========================================
router.post('/publish', (req, res) => {
    // CAMBIO CLAVE: .array('imagen', 5) permite subir hasta 5 fotos
    upload.array('imagen', 5)(req, res, async function (err) {
        if (err instanceof multer.MulterError) return res.status(400).send(`Error imagen: ${err.message}`);
        else if (err) return res.status(400).send(err.message);

        try {
            const { nombre, categoria, talla, precio, descripcion, emailUsuario } = req.body;
            const files = req.files; // Ahora es un ARREGLO de archivos

            // Validaciones
            if (!emailUsuario) return res.status(401).send('Usuario no identificado.');
            if (!files || files.length === 0) return res.status(400).send('Debes subir al menos una imagen.');

            // 1. Insertar Producto
            const queryProducto = `
                INSERT INTO tab_prd (tdp_nmb, tdp_des, tdp_pre, tdp_est, tdp_fch, tdp_usr, tdp_cat, tdp_talla)
                VALUES ($1, $2, $3, true, NOW(), $4, $5, $6) RETURNING tdp_id
            `;
            const valuesProducto = [nombre, descripcion, precio, emailUsuario, categoria, talla];
            
            const resultProducto = await db.query(queryProducto, valuesProducto);
            const nuevoProductoId = resultProducto.rows[0].tdp_id;
            
            // 2. Insertar Múltiples Imágenes (Bucle)
            for (const file of files) {
                const imageUrl = '/uploads/' + file.filename;
                await db.query(
                    'INSERT INTO tab_img (timg_url, timg_alt, timg_prd) VALUES ($1, $2, $3)', 
                    [imageUrl, nombre, nuevoProductoId]
                );
            }

            res.redirect('/');

        } catch (error) {
            console.error('Error BD:', error);
            res.status(500).send('Error al guardar.');
        }
    });
});

// ==========================================
// RUTA 3: Ver detalle de producto
// ==========================================
router.get('/product/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        // Obtenemos los datos del producto
        const queryProd = `
            SELECT p.*, c.tct_nmb as categoria, t.ttal_valor, t.ttal_tipo,
                u.tus_nmb as vendedor_nombre, u.tus_ape as vendedor_apellido, u.tus_con as vendedor_contacto, u.tus_eml as vendedor_email
            FROM tab_prd p
            JOIN tab_cat c ON p.tdp_cat = c.tct_id
            JOIN tab_talla t ON p.tdp_talla = t.ttal_id
            JOIN tab_usr u ON p.tdp_usr = u.tus_eml
            WHERE p.tdp_id = $1
        `;
        const resultProd = await db.query(queryProd, [productId]);
        
        if (resultProd.rows.length === 0) return res.status(404).send('Producto no encontrado');

        // Obtenemos TODAS las imágenes asociadas
        const queryImgs = 'SELECT * FROM tab_img WHERE timg_prd = $1';
        const resultImgs = await db.query(queryImgs, [productId]);

        // Pasamos el producto y la lista de imágenes a la vista
        // Nota: En la vista detail.ejs tendrás que actualizar para usar 'images' en vez de 'product.timg_url'
        const productData = resultProd.rows[0];
        // Para compatibilidad temporal con el dashboard, le ponemos la primera imagen como principal
        productData.timg_url = resultImgs.rows.length > 0 ? resultImgs.rows[0].timg_url : null;

        res.render('detail', { 
            product: productData,
            images: resultImgs.rows // Enviamos el array de fotos
        });

    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// ==========================================
// RUTA 4: Eliminar producto (Y todas sus fotos)
// ==========================================
router.delete('/delete/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        // 1. Obtener TODAS las imágenes
        const imgQuery = 'SELECT timg_url FROM tab_img WHERE timg_prd = $1';
        const imgResult = await db.query(imgQuery, [productId]);
        
        // 2. Borrar archivos físicos
        imgResult.rows.forEach(img => {
            const imgPathRel = img.timg_url;
            const imgPathAbs = path.join(__dirname, '../../public', imgPathRel);
            if (fs.existsSync(imgPathAbs)) {
                fs.unlinkSync(imgPathAbs);
            }
        });

        // 3. Borrar registros de BD
        await db.query('DELETE FROM tab_img WHERE timg_prd = $1', [productId]);
        await db.query('DELETE FROM tab_prd WHERE tdp_id = $1', [productId]);

        res.status(200).json({ message: 'Eliminado correctamente' });

    } catch (error) {
        console.error('Error al eliminar:', error);
        res.status(500).json({ error: 'No se pudo eliminar el producto' });
    }
});

// ==========================================
// RUTA 5: Mostrar formulario de edición
// ==========================================
router.get('/product/edit/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const prodQuery = `SELECT * FROM tab_prd WHERE tdp_id = $1`;
        const prodResult = await db.query(prodQuery, [productId]);
        
        if (prodResult.rows.length === 0) return res.redirect('/user');

        // Obtener imágenes actuales
        const imgQuery = 'SELECT * FROM tab_img WHERE timg_prd = $1';
        const imgResult = await db.query(imgQuery, [productId]);

        const catResult = await db.query('SELECT * FROM tab_cat ORDER BY tct_nmb ASC');
        const talResult = await db.query('SELECT * FROM tab_talla');

        // Preparamos el objeto producto con una imagen principal para que no rompa la vista actual
        const productData = prodResult.rows[0];
        productData.timg_url = imgResult.rows.length > 0 ? imgResult.rows[0].timg_url : '';

        res.render('edit_product', { 
            product: productData,
            categories: catResult.rows,
            sizes: talResult.rows
        });

    } catch (error) {
        console.error(error);
        res.redirect('/user');
    }
});

// ==========================================
// RUTA 6: Procesar edición (AGREGAR FOTOS)
// ==========================================
router.post('/product/edit/:id', upload.array('imagen', 5), async (req, res) => {
    const productId = req.params.id;
    
    try {
        const { nombre, categoria, talla, precio, descripcion, estado } = req.body;
        const files = req.files; // Array de nuevas fotos

        // A. Actualizar datos
        const updateQuery = `
            UPDATE tab_prd 
            SET tdp_nmb = $1, tdp_des = $2, tdp_pre = $3, tdp_cat = $4, tdp_talla = $5, tdp_est = $6
            WHERE tdp_id = $7
        `;
        await db.query(updateQuery, [nombre, descripcion, precio, categoria, talla, estado, productId]);

        // B. Si hay nuevas imágenes, LAS AGREGAMOS (No borramos las viejas)
        if (files && files.length > 0) {
            for (const file of files) {
                const newUrl = '/uploads/' + file.filename;
                await db.query('INSERT INTO tab_img (timg_url, timg_alt, timg_prd) VALUES ($1, $2, $3)', [newUrl, nombre, productId]);
            }
        }

        res.redirect('/user');

    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).send('Error al actualizar producto');
    }
});

module.exports = router;