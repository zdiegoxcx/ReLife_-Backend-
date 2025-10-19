const db = require('../config/db');

// Función para obtener todas las regiones
const getRegions = async (req, res) => {
    try {
        // Consulta SQL: selecciona el ID y nombre de la tabla de regiones
        const result = await db.query('SELECT treg_id, treg_nom FROM tab_reg ORDER BY treg_nom ASC');
        
        // El resultado se devuelve como un arreglo de objetos JSON
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener regiones:', err);
        res.status(500).json({ error: 'Error del servidor al consultar regiones.' });
    }
};

// Función para obtener comunas por ID de región
const getComunasByRegion = async (req, res) => {
    // El ID de la región se obtiene de los parámetros de la URL (ej: /api/locations/comunas/1)
    const regionId = req.params.regionId;

    if (!regionId || isNaN(regionId)) {
        return res.status(400).json({ error: 'Debe proporcionar un ID de región válido.' });
    }

    try {
        // Consulta SQL con parámetro de seguridad ($1)
        const queryText = 'SELECT tcom_id, tcom_nom FROM tab_com WHERE tcom_reg = $1 ORDER BY tcom_nom ASC';
        
        // Pasamos el ID de la región como parámetro seguro
        const result = await db.query(queryText, [regionId]); 

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener comunas:', err);
        res.status(500).json({ error: 'Error del servidor al consultar comunas.' });
    }
};

module.exports = {
    getRegions,
    getComunasByRegion,
};