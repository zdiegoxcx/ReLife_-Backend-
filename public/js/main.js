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

    // Lógica de Filtros (Se mantiene igual)
    const btnApplyFilter = document.getElementById('btn-apply-filter');
    if (btnApplyFilter) {
        btnApplyFilter.addEventListener('click', () => {
            const catId = document.getElementById('filter-category').value;
            const minPrice = document.getElementById('filter-min').value;
            const maxPrice = document.getElementById('filter-max').value;
            const params = new URLSearchParams();
            if (catId) params.append('categoryId', catId);
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);
            window.location.href = '/?' + params.toString();
        });
    }
});