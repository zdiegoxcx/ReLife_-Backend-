// =======================================================
// === SCRIPT PRINCIPAL PARA index.html ===
// =======================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Lógica de Bienvenida y Autenticación (Básica) ---
    const welcomeUserDisplay = document.querySelector('.welcome-user');
    const logoutButton = document.querySelector('.logout-btn');
    const userEmail = localStorage.getItem('userEmail'); // Recupera el email del login

    if (userEmail) {
        // Si hay un email guardado, muestra el mensaje de bienvenida
        // Extrae la parte antes del '@' y la pone en mayúsculas
        const userName = userEmail.split('@')[0].toUpperCase();
        welcomeUserDisplay.textContent = `BIENVENIDO ${userName}`;
    } else {
        // Si no hay usuario logueado, redirige a login.html
        console.warn("Usuario no autenticado, redirigiendo a login...");
        window.location.href = '/login';
        return; // Detiene la ejecución adicional si no hay usuario
    }

    // --- 2. Funcionalidad del Botón Cerrar Sesión ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Cerrando sesión...");
            // Limpia los datos de sesión guardados en localStorage
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userToken'); // Limpia ambos

            // Redirige al usuario a la página de login
            window.location.href = '/login';
        });
    }

    // --- 3. (Futuro) Añadir aquí más lógica para index.html ---
    // Ej: Cargar productos desde una API, manejar filtros, etc.
    // console.log("Página principal cargada y scripts listos.");

});