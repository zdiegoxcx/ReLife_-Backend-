// =======================================================
// === SCRIPT PRINCIPAL PARA LA BARRA DE NAVEGACIÓN ===
// =======================================================

document.addEventListener('DOMContentLoaded', () => {

    // Elementos del DOM
    const welcomeUserDisplay = document.querySelector('.welcome-user');
    const logoutButton = document.querySelector('.logout-btn');
    const userEmail = localStorage.getItem('userEmail'); 

    // === CASO 1: USUARIO LOGUEADO ===
    if (userEmail) {
        // 1. Mostrar nombre del usuario
        const userName = userEmail.split('@')[0].toUpperCase();
        if (welcomeUserDisplay) {
            welcomeUserDisplay.textContent = `BIENVENIDO ${userName}`;
        }

        // 2. Configurar botón para "Cerrar Sesión"
        if (logoutButton) {
            logoutButton.textContent = 'Cerrar Sesión';
            // Limpiamos listeners anteriores (por seguridad) y agregamos el nuevo
            logoutButton.onclick = () => {
                console.log("Cerrando sesión...");
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userToken');
                window.location.href = '/login';
            };
        }

    // === CASO 2: VISITANTE (SIN SESIÓN) ===
    } else {
        // 1. Limpiar mensaje de bienvenida
        if (welcomeUserDisplay) {
            welcomeUserDisplay.textContent = ''; 
        }

        // 2. Configurar botón para "Iniciar Sesión" (¡SIN REDIRIGIR AUTOMÁTICAMENTE!)
        if (logoutButton) {
            logoutButton.textContent = 'Iniciar Sesión';
            logoutButton.onclick = () => {
                window.location.href = '/login';
            };
        }
        
        console.log("Modo visitante activo");
    }
});