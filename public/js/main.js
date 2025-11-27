// public/js/main.js

document.addEventListener('DOMContentLoaded', () => {

    const welcomeUserDisplay = document.querySelector('.welcome-user');
    const logoutButton = document.querySelector('.logout-btn');
    
    const userEmail = localStorage.getItem('userEmail'); 
    const userName = localStorage.getItem('userName'); // Recuperamos el nombre

    if (userEmail) {
        // Usamos el nombre si existe, si no el correo
        const displayName = userName ? userName.toUpperCase() : userEmail.split('@')[0].toUpperCase();

        if (welcomeUserDisplay) welcomeUserDisplay.textContent = `BIENVENIDO ${displayName}`;
        
        if (logoutButton) {
            logoutButton.textContent = 'Cerrar Sesión';
            logoutButton.onclick = () => {
                // Limpiamos todo al salir
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userToken');
                localStorage.removeItem('userName');
                localStorage.removeItem('userRole');
                window.location.href = '/';
            };
        }
    } else {
        if (welcomeUserDisplay) welcomeUserDisplay.textContent = ''; 
        if (logoutButton) {
            logoutButton.textContent = 'Iniciar Sesión';
            logoutButton.onclick = () => window.location.href = '/login';
        }
    }

    // Lógica de Filtros 
    const btnApplyFilter = document.getElementById('btn-apply-filter');
    if (btnApplyFilter) {
        btnApplyFilter.addEventListener('click', () => {
            const catId = document.getElementById('filter-category').value;
            // Obtenemos los valores directos de los inputs
            const minVal = document.getElementById('filter-min').value;
            const maxVal = document.getElementById('filter-max').value;

            // --- INICIO DE VALIDACIÓN ---
            
            // 1. Convertimos a números si existen datos, para poder comparar matemáticamente
            const minNum = minVal ? parseFloat(minVal) : null;
            const maxNum = maxVal ? parseFloat(maxVal) : null;

            // 2. Validar que no sean negativos (opcional pero recomendado)
            if ((minNum !== null && minNum < 0) || (maxNum !== null && maxNum < 0)) {
                alert("Los precios no pueden ser negativos.");
                return; // Detenemos la ejecución
            }

            // 3. Validar lógica cruzada: Máximo menor que Mínimo
            if (minNum !== null && maxNum !== null) {
                if (maxNum < minNum) {
                    alert("¡Error! El precio máximo no puede ser menor que el precio mínimo.");
                    return; // Detenemos la ejecución, no se recarga la página
                }
            }
            // --- FIN DE VALIDACIÓN ---

            const params = new URLSearchParams();
            if (catId) params.append('categoryId', catId);
            if (minVal) params.append('minPrice', minVal);
            if (maxVal) params.append('maxPrice', maxVal);
            
            // Si todo está correcto, aplicamos el filtro
            window.location.href = '/?' + params.toString();
        });
    }
});