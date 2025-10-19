// src/routes/userRoutes.js (Tu código)

const express = require('express');
const router = express.Router();

const { 
    registerUser, 
    loginUser // <--- Si esto es 'undefined', da el error.
} = require('../controllers/userController'); 


router.post('/register', registerUser);
router.post('/login', loginUser); // <--- Si loginUser es 'undefined', ¡TypeError!

module.exports = router;