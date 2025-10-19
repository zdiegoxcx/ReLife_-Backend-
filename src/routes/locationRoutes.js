const express = require('express');
const router = express.Router();
const { getRegions, getComunasByRegion } = require('../controllers/locationController');

// Endpoint 1: Obtener todas las regiones
router.get('/regions', getRegions);

// Endpoint 2: Obtener comunas por ID de región (ruta dinámica)
router.get('/comunas/:regionId', getComunasByRegion);

module.exports = router;