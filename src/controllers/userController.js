// src/controllers/userController.js
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Función de REGISTRO
const registerUser = async (req, res) => {
    try {
        const { email, password, nombre, apellido, contactos, comunaId } = req.body;
        
        const queryText = `
            INSERT INTO tab_usr (tus_eml, tus_nmb, tus_ape, tus_psw, tus_fec, tus_con, tus_com, tus_rol)
            VALUES ($1, $2, $3, $4, NOW(), $5, $6, 'user')
            RETURNING tus_eml;
        `;
        const values = [ email, nombre, apellido, password, contactos, comunaId ];
        
        await db.query(queryText, values);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });

    } catch (err) {
        if (err.code === '23505') { 
            return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
        }
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ error: 'Error interno del servidor al registrar.' });
    }
};

// FUNCIÓN DE LOGIN
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Debe ingresar email y contraseña.' });
    }

    try {
        const queryText = 'SELECT tus_eml, tus_psw, tus_nmb, tus_rol FROM tab_usr WHERE tus_eml = $1';
        const result = await db.query(queryText, [email]);
        const user = result.rows[0];

        if (!user || password !== user.tus_psw) { 
            return res.status(401).json({ error: 'Correo o contraseña inválidas.' });
        }

        res.status(200).json({ 
            message: 'Inicio de sesión exitoso.',
            user: user.tus_eml,
            name: user.tus_nmb,
            role: user.tus_rol,
            token: 'fake-jwt-token' 
        });

    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).json({ error: 'Error interno del servidor durante el login.' });
    }
};

// =======================================================
// === FUNCIONES PARA EL PERFIL DE USUARIO ===
// =======================================================

// FUNCIÓN PARA OBTENER LOS DATOS DEL PERFIL
const getUserProfile = async (req, res) => {
    const { email } = req.params;

    try {
        const queryText = `
            SELECT 
                tus_nmb, 
                tus_ape, 
                tus_con, 
                tus_com, 
                T2.tcom_reg 
            FROM tab_usr T1
            JOIN tab_com T2 ON T1.tus_com = T2.tcom_id
            WHERE tus_eml = $1;
        `;
        
        const result = await db.query(queryText, [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const profileData = {
            nombre: result.rows[0].tus_nmb,
            apellido: result.rows[0].tus_ape,
            contactos: result.rows[0].tus_con,
            comunaId: result.rows[0].tus_com,
            regionId: result.rows[0].tcom_reg 
        };

        res.status(200).json(profileData);

    } catch (err) {
        console.error('Error al obtener perfil:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// FUNCIÓN PARA ACTUALIZAR EL PERFIL
const updateUserProfile = async (req, res) => {
    const { email } = req.params;
    const { nombre, apellido, contactos, comunaId, password } = req.body;

    if (!nombre || !apellido || !comunaId) {
        return res.status(400).json({ error: 'Nombre, Apellido y Comuna son obligatorios.' });
    }

    try {
        let queryText;
        let values;

        if (password && password.length > 0) {
            queryText = `
                UPDATE tab_usr 
                SET tus_nmb = $1, tus_ape = $2, tus_con = $3, tus_com = $4, tus_psw = $5
                WHERE tus_eml = $6;
            `;
            values = [nombre, apellido, contactos, comunaId, password, email];
        } else {
            queryText = `
                UPDATE tab_usr 
                SET tus_nmb = $1, tus_ape = $2, tus_con = $3, tus_com = $4
                WHERE tus_eml = $5;
            `;
            values = [nombre, apellido, contactos, comunaId, email];
        }

        await db.query(queryText, values);
        res.status(200).json({ message: 'Perfil actualizado exitosamente.' });

    } catch (err) {
        console.error('Error al actualizar perfil:', err);
        res.status(500).json({ error: 'Error interno del servidor al actualizar.' });
    }
};

// FUNCIÓN PARA ELIMINAR CUENTA (Y SUS PRODUCTOS)
const deleteUserProfile = async (req, res) => {
    const { email } = req.params;

    try {
        // 1. Obtener todos los productos del usuario
        const productsQuery = 'SELECT tdp_id FROM tab_prd WHERE tdp_usr = $1';
        const productsResult = await db.query(productsQuery, [email]);
        
        // 2. Iterar sobre cada producto para borrar imágenes y registros
        for (const product of productsResult.rows) {
            const prodId = product.tdp_id;

            // A. Borrar imagen física del servidor
            const imgQuery = 'SELECT timg_url FROM tab_img WHERE timg_prd = $1';
            const imgResult = await db.query(imgQuery, [prodId]);
            
            if (imgResult.rows.length > 0) {
                const imgPathRel = imgResult.rows[0].timg_url;
                // Construir ruta absoluta para borrar el archivo
                const imgPathAbs = path.join(__dirname, '../../public', imgPathRel);
                if (fs.existsSync(imgPathAbs)) {
                    fs.unlinkSync(imgPathAbs); // Borrado físico
                }
            }

            // B. Borrar de la tabla de imágenes (tab_img)
            await db.query('DELETE FROM tab_img WHERE timg_prd = $1', [prodId]);

            // C. Borrar de la tabla de productos (tab_prd)
            await db.query('DELETE FROM tab_prd WHERE tdp_id = $1', [prodId]);
        }

        // 3. Finalmente, borrar el usuario (tab_usr)
        const userQuery = 'DELETE FROM tab_usr WHERE tus_eml = $1';
        await db.query(userQuery, [email]);
        
        res.status(200).json({ message: 'Cuenta y productos eliminados exitosamente.' });

    } catch (err) {
        console.error('Error al eliminar cuenta:', err);
        res.status(500).json({ error: 'Error interno del servidor al eliminar.' });
    }
};

// Obtener productos de un usuario (Versión corregida para traer también agotados)
const getUserProducts = async (req, res) => {
    const { email } = req.params;
    try {
        // CORRECCIÓN: Agregamos DISTINCT ON (p.tdp_id) y ajustamos el ORDER BY
        const query = `
            SELECT DISTINCT ON (p.tdp_id) p.tdp_id, p.tdp_nmb, p.tdp_pre, p.tdp_est, i.timg_url 
            FROM tab_prd p
            LEFT JOIN tab_img i ON p.tdp_id = i.timg_prd
            WHERE p.tdp_usr = $1
            ORDER BY p.tdp_id, p.tdp_fch DESC
        `;
        const result = await db.query(query, [email]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error interno.' });
    }
};

module.exports = {
    registerUser,
    loginUser, 
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getUserProducts
};