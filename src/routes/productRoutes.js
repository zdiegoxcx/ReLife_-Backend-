const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

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

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/; // Extensiones permitidas
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Error: Solo se permiten imágenes (jpeg, jpg, png, webp)'));
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2000000 }, // Límite de 2MB (2,000,000 bytes)
    fileFilter: fileFilter
});

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
// --- RUTA POST MEJORADA (Con manejo de errores de Multer) ---
router.post('/publish', (req, res) => {
    // Usamos upload como función dentro de la ruta para capturar errores
    upload.single('imagen')(req, res, async function (err) {
        
        // 1. Errores de Multer (Tamaño, tipo de archivo)
        if (err instanceof multer.MulterError) {
            // Error de tamaño, etc.
            return res.status(400).send(`Error al subir imagen: ${err.message}. Máximo 2MB.`);
        } else if (err) {
            // Error del fileFilter (tipo de archivo incorrecto)
            return res.status(400).send(err.message);
        }

        // Si la imagen pasó los filtros, seguimos con la lógica normal:
        try {
            const { nombre, categoria, talla, precio, descripcion, emailUsuario } = req.body;
            const imagenFile = req.file;

            if (!emailUsuario) return res.status(401).send('Usuario no identificado.');
            if (!imagenFile) return res.status(400).send('Debes subir una imagen válida.');

            const queryProducto = `
                INSERT INTO tab_prd (tdp_nmb, tdp_des, tdp_pre, tdp_est, tdp_fch, tdp_usr, tdp_cat, tdp_talla)
                VALUES ($1, $2, $3, true, NOW(), $4, $5, $6)
                RETURNING tdp_id
            `;
            const valuesProducto = [nombre, descripcion, precio, emailUsuario, categoria, talla];
            const resultProducto = await db.query(queryProducto, valuesProducto);
            
            const nuevoProductoId = resultProducto.rows[0].tdp_id;
            const imageUrl = '/uploads/' + imagenFile.filename;
            
            const queryImagen = `
                INSERT INTO tab_img (timg_url, timg_alt, timg_prd)
                VALUES ($1, $2, $3)
            `;
            await db.query(queryImagen, [imageUrl, nombre, nuevoProductoId]);

            res.redirect('/');

        } catch (error) {
            console.error('Error de BD:', error);
            res.status(500).send('Error interno al guardar en base de datos.');
        }
    });
});

// --- RUTA: Ver Detalle de Producto ---
router.get('/product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // Consultamos TODO: Producto, Categoría, Talla, Imagen y DATOS DEL VENDEDOR
        const query = `
            SELECT 
                p.*, 
                c.tct_nmb as categoria,
                t.ttal_valor as talla_valor,
                t.ttal_tipo as talla_tipo,
                i.timg_url,
                u.tus_nmb as vendedor_nombre,
                u.tus_ape as vendedor_apellido,
                u.tus_con as vendedor_contacto,
                u.tus_eml as vendedor_email
            FROM tab_prd p
            JOIN tab_cat c ON p.tdp_cat = c.tct_id
            JOIN tab_talla t ON p.tdp_talla = t.ttal_id
            JOIN tab_usr u ON p.tdp_usr = u.tus_eml
            LEFT JOIN tab_img i ON p.tdp_id = i.timg_prd
            WHERE p.tdp_id = $1
        `;

        const result = await db.query(query, [productId]);

        if (result.rows.length === 0) {
            return res.status(404).send('Producto no encontrado');
        }

        // Renderizamos la vista 'detail' con los datos
        res.render('detail', { product: result.rows[0] });

    } catch (error) {
        console.error('Error al cargar producto:', error);
        res.redirect('/');
    }
});

module.exports = router;