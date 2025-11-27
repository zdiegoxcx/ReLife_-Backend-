document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE USUARIO (NAVBAR) ---
    const welcomeUserDisplay = document.querySelector('.welcome-user');
    const logoutButton = document.querySelector('button.logout-btn');
    const userEmail = localStorage.getItem('userEmail'); 

    if (userEmail) {
        if (welcomeUserDisplay) welcomeUserDisplay.textContent = `BIENVENIDO ${userEmail.split('@')[0].toUpperCase()}`;
        if (logoutButton) {
            logoutButton.textContent = 'Cerrar Sesión';
            logoutButton.onclick = () => {
                localStorage.clear();
                window.location.href = '/login';
            };
        }
    } else {
        if (welcomeUserDisplay) welcomeUserDisplay.textContent = ''; 
        if (logoutButton) {
            logoutButton.textContent = 'Iniciar Sesión';
            logoutButton.onclick = () => window.location.href = '/login';
        }
    }

    // ==========================================
    // === LÓGICA DEL BOTÓN FILTRAR ===
    // ==========================================
    const btnApplyFilter = document.getElementById('btn-apply-filter');

    if (btnApplyFilter) {
        btnApplyFilter.addEventListener('click', () => {
            // 1. Obtener valores de los inputs
            const catId = document.getElementById('filter-category').value;
            const minPrice = document.getElementById('filter-min').value;
            const maxPrice = document.getElementById('filter-max').value;

            // 2. Construir la URL mágica (Query Params)
            const params = new URLSearchParams();

            if (catId) params.append('categoryId', catId);
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);

            // 3. Recargar la página enviando los datos al servidor
            window.location.href = '/?' + params.toString();
        });
    }
});