// src/db/data/probar_sp.js

// Ahora importamos 'query' y 'pool'
const { query, pool } = require('../../config/db.js'); 

async function agregarNuevoProducto() {
    
    console.log('--- Iniciando prueba de Stored Procedure ---');
    console.log('Intentando registrar un nuevo producto...');

    const sql = 'SELECT * FROM sp_RegistrarProducto($1, $2, $3, $4, $5, $6)';
    
    const params = [
        'Chaqueta de Cuero Vintage', 
        'Chaqueta en buen estado, talla M, años 80',
        25000,
        'aaa@gmail.com', 
        1, //categoria
        2  //talla
    ];

    try {
        const result = await query(sql, params);
        const nuevoId = result.rows[0].sp_registrarproducto; 

        console.log(`Producto registrado con éxito`);
        console.log(`El ID del nuevo producto es: ${nuevoId}`);

    } catch (err) {
        console.error('Error al ejecutar el Stored Procedure:', err.message);
        console.error('RECUERDA: Asegúrate de que el usuario, la categoría y la talla existan.');
    } finally {
        // AÑADIDO: Cierra la conexión
        await pool.end();
        console.log('--- Prueba finalizada (Conexión cerrada) ---');
    }
}

agregarNuevoProducto();