// src/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

// GET /api/categories -> Obtener todas
router.get('/', getAllCategories);

// POST /api/categories -> Crear una nueva
router.post('/', createCategory);

// PUT /api/categories/:id -> Actualizar una por ID
router.put('/:id', updateCategory);

// DELETE /api/categories/:id -> Eliminar una por ID
router.delete('/:id', deleteCategory);

module.exports = router;