document.addEventListener('DOMContentLoaded', () => {
    const userEmail = localStorage.getItem('userEmail');
    
    // Validación de sesión
    if (!userEmail) {
        window.location.href = '/login';
        return;
    }

    // Configurar Header
    const display = document.getElementById('welcome-display');
    const logoutBtn = document.getElementById('logout-btn');
    
    if(display) display.textContent = 'BIENVENIDO ' + userEmail.split('@')[0].toUpperCase();
    if(logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.clear();
            window.location.href = '/login';
        };
    }

    // Cargar datos
    loadUserInfo(userEmail);
    loadUserProducts(userEmail);
});

// 1. Cargar Información Personal (Izquierda)
async function loadUserInfo(email) {
    try {
        const response = await fetch(`http://localhost:3000/api/users/profile/${email}`);
        const data = await response.json();

        if(response.ok) {
            document.getElementById('info-nombre').textContent = data.nombre || '-';
            document.getElementById('info-apellido').textContent = data.apellido || '-';
            document.getElementById('info-email').textContent = email;
            document.getElementById('info-contacto').textContent = data.contactos || '-';
            
            // Para la ubicación necesitamos hacer otro fetch o guardarla mejor, 
            // por ahora mostraremos el ID de comuna si no hacemos el join complejo.
            // Si quieres mostrar "Los Angeles, Chile", necesitamos mejorar el endpoint del perfil
            // para que haga JOIN con tab_com y tab_reg.
            document.getElementById('info-ubicacion').textContent = "Chile"; 
        }
    } catch (error) {
        console.error(error);
    }
}

// 2. Cargar Productos (Derecha)
async function loadUserProducts(email) {
    const container = document.getElementById('my-products-list');
    
    try {
        const response = await fetch(`http://localhost:3000/api/users/products/${email}`);
        const products = await response.json();

        container.innerHTML = ''; // Limpiar

        // Renderizar cada producto
        products.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'my-product-card';
            card.innerHTML = `
                <img src="${prod.timg_url || 'https://via.placeholder.com/150'}" alt="${prod.tdp_nmb}">
                <h4>${prod.tdp_nmb}</h4>
                <p>$ ${prod.tdp_pre} clp</p>
                <button class="edit-item-btn" onclick="alert('Editar producto ${prod.tdp_id}')">Editar</button>
            `;
            container.appendChild(card);
        });

        // Agregar el botón "+" al final
        const addBtn = document.createElement('div');
        addBtn.className = 'add-product-card';
        addBtn.innerHTML = `
            <div class="plus-circle" onclick="window.location.href='/publish'">
                <i class="fas fa-plus"></i>
            </div>
        `;
        container.appendChild(addBtn);

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p>Error al cargar productos.</p>';
    }
}