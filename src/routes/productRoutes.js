const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // <--- NECESARIO PARA BORRAR ARCHIVOS

// --- CONFIGURACIÓN DE MULTER ---
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
    limits: { fileSize: 2000000 },
    fileFilter: fileFilter
});

// --- RUTAS EXISTENTES ---
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

router.post('/publish', (req, res) => {
    upload.single('imagen')(req, res, async function (err) {
        if (err instanceof multer.MulterError) return res.status(400).send(`Error imagen: ${err.message}`);
        else if (err) return res.status(400).send(err.message);

        try {
            const { nombre, categoria, talla, precio, descripcion, emailUsuario } = req.body;
            const imagenFile = req.file;

            if (!emailUsuario) return res.status(401).send('Usuario no identificado.');
            if (!imagenFile) return res.status(400).send('Debes subir una imagen.');

            const queryProducto = `
                INSERT INTO tab_prd (tdp_nmb, tdp_des, tdp_pre, tdp_est, tdp_fch, tdp_usr, tdp_cat, tdp_talla)
                VALUES ($1, $2, $3, true, NOW(), $4, $5, $6) RETURNING tdp_id
            `;
            const valuesProducto = [nombre, descripcion, precio, emailUsuario, categoria, talla];
            const resultProducto = await db.query(queryProducto, valuesProducto);
            
            const nuevoProductoId = resultProducto.rows[0].tdp_id;
            const imageUrl = '/uploads/' + imagenFile.filename;
            
            await db.query('INSERT INTO tab_img (timg_url, timg_alt, timg_prd) VALUES ($1, $2, $3)', [imageUrl, nombre, nuevoProductoId]);

            res.redirect('/');
        } catch (error) {
            console.error('Error BD:', error);
            res.status(500).send('Error al guardar.');
        }
    });
});

router.get('/product/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const query = `
            SELECT p.*, c.tct_nmb as categoria, t.ttal_valor, t.ttal_tipo, i.timg_url,
                u.tus_nmb as vendedor_nombre, u.tus_ape as vendedor_apellido, u.tus_con as vendedor_contacto, u.tus_eml as vendedor_email
            FROM tab_prd p
            JOIN tab_cat c ON p.tdp_cat = c.tct_id
            JOIN tab_talla t ON p.tdp_talla = t.ttal_id
            JOIN tab_usr u ON p.tdp_usr = u.tus_eml
            LEFT JOIN tab_img i ON p.tdp_id = i.timg_prd
            WHERE p.tdp_id = $1
        `;
        const result = await db.query(query, [productId]);
        if (result.rows.length === 0) return res.status(404).send('Producto no encontrado');
        res.render('detail', { product: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// --- NUEVA RUTA: ELIMINAR PRODUCTO ---
router.delete('/delete/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        // 1. Obtener la imagen para borrarla físicamente
        const imgQuery = 'SELECT timg_url FROM tab_img WHERE timg_prd = $1';
        const imgResult = await db.query(imgQuery, [productId]);
        
        if (imgResult.rows.length > 0) {
            const imgPathRel = imgResult.rows[0].timg_url; // /uploads/imagen.jpg
            // Convertimos la ruta relativa en absoluta del sistema
            const imgPathAbs = path.join(__dirname, '../../public', imgPathRel);
            
            // Verificar y borrar archivo
            if (fs.existsSync(imgPathAbs)) {
                fs.unlinkSync(imgPathAbs);
            }
        }

        // 2. Borrar registros de la BD (Imagen primero por FK, luego Producto)
        await db.query('DELETE FROM tab_img WHERE timg_prd = $1', [productId]);
        await db.query('DELETE FROM tab_prd WHERE tdp_id = $1', [productId]);

        res.status(200).json({ message: 'Eliminado correctamente' });

    } catch (error) {
        console.error('Error al eliminar:', error);
        res.status(500).json({ error: 'No se pudo eliminar el producto' });
    }
});

// 1. RUTA GET: Mostrar formulario de edición
router.get('/product/edit/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        // Obtener el producto
        const prodQuery = `
            SELECT p.*, i.timg_url 
            FROM tab_prd p
            LEFT JOIN tab_img i ON p.tdp_id = i.timg_prd
            WHERE p.tdp_id = $1
        `;
        const prodResult = await db.query(prodQuery, [productId]);
        
        if (prodResult.rows.length === 0) return res.redirect('/user');

        // Obtener listas para los selects
        const catResult = await db.query('SELECT * FROM tab_cat ORDER BY tct_nmb ASC');
        const talResult = await db.query('SELECT * FROM tab_talla');

        res.render('edit_product', { 
            product: prodResult.rows[0],
            categories: catResult.rows,
            sizes: talResult.rows
        });

    } catch (error) {
        console.error(error);
        res.redirect('/user');
    }
});

// 2. RUTA POST: Procesar la actualización
router.post('/product/edit/:id', upload.single('imagen'), async (req, res) => {
    const productId = req.params.id;
    
    try {
        const { nombre, categoria, talla, precio, descripcion } = req.body;
        const imagenFile = req.file; // Puede venir o no

        // A. Actualizar datos básicos del producto
        const updateQuery = `
            UPDATE tab_prd 
            SET tdp_nmb = $1, tdp_des = $2, tdp_pre = $3, tdp_cat = $4, tdp_talla = $5
            WHERE tdp_id = $6
        `;
        await db.query(updateQuery, [nombre, descripcion, precio, categoria, talla, productId]);

        // B. Si subieron una imagen nueva, actualizarla
        if (imagenFile) {
            // 1. Obtener imagen vieja para borrarla (limpieza)
            const oldImgResult = await db.query('SELECT timg_url FROM tab_img WHERE timg_prd = $1', [productId]);
            if (oldImgResult.rows.length > 0) {
                const oldPath = path.join(__dirname, '../../public', oldImgResult.rows[0].timg_url);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            // 2. Actualizar registro en BD
            const newUrl = '/uploads/' + imagenFile.filename;
            // Usamos UPSERT (Insertar o Actualizar si ya existe) o DELETE/INSERT. 
            // Por simplicidad haremos UPDATE, asumiendo que ya tenía imagen (nuestra lógica siempre crea una).
            await db.query('UPDATE tab_img SET timg_url = $1 WHERE timg_prd = $2', [newUrl, productId]);
        }

        res.redirect('/user'); // Volver al dashboard

    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).send('Error al actualizar producto');
    }
});

module.exports = router;