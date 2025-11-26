// src/controllers/userController.js
const db = require('../config/db');

// Función de REGISTRO (Tu código original)
const registerUser = async (req, res) => {
    try {
        const { email, password, nombre, apellido, contactos, comunaId } = req.body;
        
        const queryText = `
            INSERT INTO tab_usr (tus_eml, tus_nmb, tus_ape, tus_psw, tus_fec, tus_con, tus_com)
            VALUES ($1, $2, $3, $4, NOW(), $5, $6)
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

// FUNCIÓN DE LOGIN (Tu código original)
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Debe ingresar email y contraseña.' });
    }

    try {
        const queryText = 'SELECT tus_eml, tus_psw FROM tab_usr WHERE tus_eml = $1';
        const result = await db.query(queryText, [email]);
        const user = result.rows[0];

        if (!user || password !== user.tus_psw) { // Compara password en texto plano
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Devolvemos el email del usuario (que login.js guarda en localStorage)
        // y un token falso (ya que login.js espera un token)
        res.status(200).json({ 
            message: 'Inicio de sesión exitoso.',
            user: user.tus_eml,
            token: 'fake-jwt-token' // login.js lo necesita
        });

    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).json({ error: 'Error interno del servidor durante el login.' });
    }
};

// =======================================================
// === NUEVAS FUNCIONES PARA EL PERFIL DE USUARIO ===
// =======================================================

// FUNCIÓN PARA OBTENER LOS DATOS DEL PERFIL
const getUserProfile = async (req, res) => {
    const { email } = req.params;

    try {
        // Hacemos un JOIN para obtener el ID de la región (tcom_reg) 
        // basado en la comuna del usuario (tus_com)
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

    // Validación básica
    if (!nombre || !apellido || !comunaId) {
        return res.status(400).json({ error: 'Nombre, Apellido y Comuna son obligatorios.' });
    }

    try {
        let queryText;
        let values;

        // Construimos la consulta dinámicamente
        // Si el usuario envió una contraseña nueva, la actualizamos.
        if (password && password.length > 0) {
            queryText = `
                UPDATE tab_usr 
                SET tus_nmb = $1, tus_ape = $2, tus_con = $3, tus_com = $4, tus_psw = $5
                WHERE tus_eml = $6;
            `;
            values = [nombre, apellido, contactos, comunaId, password, email];
        } else {
            // Si no envió contraseña, mantenemos la antigua
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

// FUNCIÓN PARA ELIMINAR CUENTA
const deleteUserProfile = async (req, res) => {
    const { email } = req.params;

    try {
        // NOTA: En una app real, esto requeriría borrar productos, etc. (ON DELETE CASCADE)
        // Por ahora, solo borramos el usuario.
        const queryText = 'DELETE FROM tab_usr WHERE tus_eml = $1;';
        await db.query(queryText, [email]);
        
        res.status(200).json({ message: 'Cuenta eliminada exitosamente.' });

    } catch (err) {
        console.error('Error al eliminar cuenta:', err);
        res.status(500).json({ error: 'Error interno del servidor al eliminar.' });
    }
};

// NUEVO: Obtener productos de un usuario por su email
const getUserProducts = async (req, res) => {
    const { email } = req.params;
    try {
        const query = `
            SELECT p.tdp_id, p.tdp_nmb, p.tdp_pre, i.timg_url 
            FROM tab_prd p
            LEFT JOIN tab_img i ON p.tdp_id = i.timg_prd
            WHERE p.tdp_usr = $1 AND p.tdp_est = true
            ORDER BY p.tdp_fch DESC
        `;
        const result = await db.query(query, [email]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error interno.' });
    }
};

// EXPORTACIÓN FINAL (¡ESTA ES LA PARTE CLAVE!)
module.exports = {
    registerUser,
    loginUser, 
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getUserProducts
};