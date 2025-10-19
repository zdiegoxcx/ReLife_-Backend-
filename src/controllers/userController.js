// src/controllers/userController.js

const db = require('../config/db');

// Función de REGISTRO (Ya implementada)
const registerUser = async (req, res) => {
    // ... tu lógica de registro aquí ...
    // Asegúrate de que el código esté limpio y sin errores de sintaxis.
    try {
        const { email, password, nombre, apellido, contactos, comunaId } = req.body;
        
        // ... validaciones ...

        const queryText = `
            INSERT INTO tab_usr (tus_eml, tus_nmb, tus_ape, tus_psw, tus_fec, tus_con, tus_com)
            VALUES ($1, $2, $3, $4, NOW(), $5, $6)
            RETURNING tus_eml;
        `;
        const values = [ email, nombre, apellido, password, contactos, comunaId ];
        
        await db.query(queryText, values);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });

    } catch (err) {
        // ... manejo de errores ...
        if (err.code === '23505') { 
            return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
        }
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ error: 'Error interno del servidor al registrar.' });
    }
};

// 🚨 FUNCIÓN DE LOGIN (Asegúrate de que esté correcta y completa) 🚨
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

        res.status(200).json({ 
            message: 'Inicio de sesión exitoso.',
            user: user.tus_eml
        });

    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).json({ error: 'Error interno del servidor durante el login.' });
    }
};

// 🚨 EXPORTACIÓN FINAL (¡CRÍTICO!) 🚨
module.exports = {
    registerUser,
    loginUser, // Asegúrate de que loginUser esté aquí.
};