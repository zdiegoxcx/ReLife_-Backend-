// config/db.js

const { Pool } = require('pg');
require('dotenv').config(); // Usaremos dotenv para leer las credenciales

// 1. Opciones de conexión
// Las credenciales se leen desde las variables de entorno para mayor seguridad.
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432, // 5432 es el puerto por defecto de PostgreSQL
});

// 2. Función para ejecutar consultas (query)
const query = (text, params) => {
    // Log para ver la consulta en la consola
    console.log('Ejecutando consulta:', text);
    return pool.query(text, params);
};

// 3. Opcional: Probar la conexión al iniciar
pool.connect()
    .then(client => {
        console.log('Conexión exitosa a PostgreSQL');
        client.release(); // Libera el cliente al pool
    })
    .catch(err => {
        console.error('Error al conectar a PostgreSQL:', err.stack);
    });

// Exportar la función para que otros módulos puedan usarla
module.exports = {
    query,
    pool
};

