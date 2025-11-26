// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();

// Importamos TODAS las funciones del controlador
const { 
    registerUser, 
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getUserProducts
} = require('../controllers/userController'); 


// Rutas originales
router.post('/register', registerUser);
router.post('/login', loginUser);

// =======================================================
// === NUEVAS RUTAS PARA EL PERFIL DE USUARIO ===
// =======================================================

// Obtener datos del perfil (usando el email como parámetro)
router.get('/profile/:email', getUserProfile);

// Actualizar datos del perfil
router.put('/profile/:email', updateUserProfile);

// Eliminar cuenta
router.delete('/profile/:email', deleteUserProfile);

// Obtener productos asociados al usuario
router.get('/products/:email', getUserProducts);

module.exports = router;