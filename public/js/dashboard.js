document.addEventListener('DOMContentLoaded', () => {
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName'); // <--- RECUPERAMOS EL NOMBRE
    
    if (!userEmail) {
        window.location.href = '/login';
        return;
    }

    // Header
    const display = document.getElementById('welcome-display');
    const logoutBtn = document.getElementById('logout-btn');
    
    if(display) {
        // CAMBIO AQUÍ: Usamos el nombre si existe, sino el email
        const displayName = userName ? userName.toUpperCase() : userEmail.split('@')[0].toUpperCase();
        display.textContent = 'BIENVENIDO ' + displayName;
    }

    if(logoutBtn) {
        logoutBtn.onclick = () => {
            // Limpiamos todo al salir
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            window.location.href = '/login';
        };
    }

    loadUserInfo(userEmail);
    loadUserProducts(userEmail);
});

async function loadUserInfo(email) {
    try {
        const response = await fetch(`http://localhost:3000/api/users/profile/${email}`);
        const data = await response.json();
        if(response.ok) {
            document.getElementById('info-nombre').textContent = data.nombre || '-';
            document.getElementById('info-apellido').textContent = data.apellido || '-';
            document.getElementById('info-email').textContent = email;
            document.getElementById('info-contacto').textContent = data.contactos || '-';
        }
    } catch (error) { console.error(error); }
}

async function loadUserProducts(email) {
    const container = document.getElementById('my-products-list');
    try {
        const response = await fetch(`http://localhost:3000/api/users/products/${email}`);
        const products = await response.json();

        container.innerHTML = ''; 

        products.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'my-product-card';
            card.innerHTML = `
                <img src="${prod.timg_url || 'https://via.placeholder.com/150'}" alt="${prod.tdp_nmb}">
                <h4>${prod.tdp_nmb}</h4>
                <p>$ ${prod.tdp_pre}</p>
                <div class="card-actions">
                    <button class="edit-item-btn" onclick="window.location.href='/product/edit/${prod.tdp_id}'">Editar</button>
                    <button class="delete-item-btn" onclick="deleteProduct(${prod.tdp_id})">Eliminar</button>
                </div>
            `;
            container.appendChild(card);
        });

        // Botón AGREGAR (+)
        const addBtn = document.createElement('div');
        addBtn.className = 'add-product-card';
        addBtn.innerHTML = `<div class="plus-circle" onclick="window.location.href='/publish'"><i class="fas fa-plus"></i></div>`;
        container.appendChild(addBtn);

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p>Error al cargar productos.</p>';
    }
}

async function deleteProduct(id) {
    if(!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
        const res = await fetch(`/delete/${id}`, { method: 'DELETE' });
        if (res.ok) {
            const email = localStorage.getItem('userEmail');
            loadUserProducts(email);
        } else {
            alert('Error al eliminar');
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
}