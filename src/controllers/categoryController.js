// src/controllers/categoryController.js
const db = require('../config/db');

// OBTENER TODAS las categorías
const getAllCategories = async (req, res) => {
    try {
        const result = await db.query('SELECT tct_id, tct_nmb FROM tab_cat ORDER BY tct_nmb ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener categorías:', err);
        res.status(500).json({ error: 'Error del servidor.' });
    }
};

// CREAR una categoría nueva
const createCategory = async (req, res) => {
    const { nombre } = req.body; // El frontend enviará un objeto { nombre: 'Nueva Categoria' }

    if (!nombre) {
        return res.status(400).json({ error: 'El nombre es obligatorio.' });
    }

    try {
        const queryText = 'INSERT INTO tab_cat (tct_nmb) VALUES ($1) RETURNING tct_id, tct_nmb';
        const result = await db.query(queryText, [nombre]);
        res.status(201).json(result.rows[0]); // Devuelve la categoría creada
    } catch (err) {
         // Código '23505' es error de unicidad (si ya existe una categoría con ese nombre)
        if (err.code === '23505') {
             return res.status(409).json({ error: 'Ya existe una categoría con ese nombre.' });
        }
        console.error('Error al crear categoría:', err);
        res.status(500).json({ error: 'Error del servidor.' });
    }
};

// ACTUALIZAR una categoría existente
const updateCategory = async (req, res) => {
    const { id } = req.params; // El ID viene de la URL (ej: /api/categories/5)
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: 'El nombre es obligatorio.' });
    }
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
    }

    try {
        const queryText = 'UPDATE tab_cat SET tct_nmb = $1 WHERE tct_id = $2 RETURNING tct_id, tct_nmb';
        const result = await db.query(queryText, [nombre, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada.' });
        }
        res.status(200).json(result.rows[0]); // Devuelve la categoría actualizada
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Ya existe otra categoría con ese nombre.' });
       }
        console.error('Error al actualizar categoría:', err);
        res.status(500).json({ error: 'Error del servidor.' });
    }
};

// ELIMINAR una categoría
const deleteCategory = async (req, res) => {
    const { id } = req.params;

     if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
    }

    try {
        // Antes de borrar, podrías verificar si hay productos usando esta categoría.
        // Por simplicidad, aquí solo la borramos.
        // Si hay productos con FK a esta categoría, la BD podría dar error si no tienes ON DELETE configurado.
        const queryText = 'DELETE FROM tab_cat WHERE tct_id = $1 RETURNING tct_id';
        const result = await db.query(queryText, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada.' });
        }
        res.status(200).json({ message: 'Categoría eliminada exitosamente.' });
    } catch (err) {
        // Error común si hay productos asociados (violación de FK)
        if (err.code === '23503') {
             return res.status(409).json({ error: 'No se puede eliminar la categoría porque tiene productos asociados.' });
        }
        console.error('Error al eliminar categoría:', err);
        res.status(500).json({ error: 'Error del servidor.' });
    }
};


module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};