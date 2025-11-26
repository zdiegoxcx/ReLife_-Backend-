const API_URL_LOCATIONS = 'http://localhost:3000/api/locations';
const API_URL_USERS = 'http://localhost:3000/api/users';

// Elementos DOM (Usamos ?. para evitar errores si no existen)
const profileForm = document.getElementById('profile-form');
const userEmail = localStorage.getItem('userEmail');
const myProductsList = document.getElementById('my-products-list'); // Solo existe en Dashboard

// Inputs
const inputs = {
    nombre: document.getElementById('perfil-nombre'),
    apellido: document.getElementById('perfil-apellido'),
    email: document.getElementById('perfil-email'),
    contactos: document.getElementById('perfil-contactos'),
    region: document.getElementById('perfil-region'),
    comuna: document.getElementById('perfil-comuna'),
    password: document.getElementById('perfil-password')
};

// Botones
const btns = {
    editar: document.getElementById('editar-btn'),
    guardar: document.getElementById('guardar-btn'), // Ojo con el ID
    cancelar: document.getElementById('cancelar-btn'),
    eliminar: document.getElementById('eliminar-btn'),
    logout: document.getElementById('logout-btn'),
    displayUser: document.getElementById('welcome-display'),
    editActions: document.getElementById('edit-actions'),
    passGroup: document.getElementById('pass-group')
};

// --- 1. INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', async () => {
    if (!userEmail) {
        window.location.href = '/login';
        return;
    }
    
    // Configurar Header (Si existe)
    if(btns.displayUser) btns.displayUser.textContent = 'BIENVENIDO ' + userEmail.split('@')[0].toUpperCase();
    
    if(btns.logout) {
        btns.logout.onclick = () => {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userToken');
            window.location.href = '/login';
        };
    }

    // Cargar Datos del Perfil (Siempre)
    await loadUserProfile();

    // Cargar Productos (SOLO si existe el contenedor, es decir, en el Dashboard)
    if (myProductsList) {
        loadUserProducts();
    } else {
        // Si NO hay lista de productos, estamos en EDICIÓN.
        // Forzamos la habilitación de campos para que puedas editar.
        enableEditFields();
    }
});

// --- 2. CARGAR PRODUCTOS (ACTUALIZADO) ---
async function loadUserProducts() {
    if (!myProductsList) return;

    try {
        const response = await fetch(`${API_URL_USERS}/products/${userEmail}`);
        const products = await response.json();

        myProductsList.innerHTML = ''; 

        if (products.length === 0) {
            myProductsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">No tienes prendas publicadas.</p>';
        }

        products.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'my-product-card';
            // Agregamos botones Editar y Eliminar
            card.innerHTML = `
                <img src="${prod.timg_url || 'https://via.placeholder.com/150'}" alt="${prod.tdp_nmb}">
                <h4>${prod.tdp_nmb}</h4>
                <p>$ ${prod.tdp_pre}</p>
                <div class="card-actions" style="display: flex; gap: 5px; width: 100%;">
                    <button class="edit-item-btn" onclick="window.location.href='/product/edit/${prod.tdp_id}'">Editar</button>
                    <button class="delete-item-btn" onclick="deleteProduct(${prod.tdp_id})" style="flex: 1; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Eliminar</button>
                </div>
            `;
            myProductsList.appendChild(card);
        });

        const addCard = document.createElement('div');
        addCard.className = 'add-product-card';
        addCard.onclick = () => window.location.href = '/publish';
        addCard.innerHTML = `<div class="plus-btn"><i class="fas fa-plus"></i></div>`;
        myProductsList.appendChild(addCard);

    } catch (error) {
        console.error(error);
        myProductsList.innerHTML = '<p>Error al cargar productos.</p>';
    }
}

// --- 3. CARGAR PERFIL ---
async function loadUserProfile() {
    try {
        const response = await fetch(`${API_URL_USERS}/profile/${userEmail}`);
        if(!response.ok) throw new Error('Error perfil');
        const data = await response.json();

        // Llenar datos si los inputs existen
        if(inputs.nombre) inputs.nombre.value = data.nombre || '';
        if(inputs.apellido) inputs.apellido.value = data.apellido || '';
        if(inputs.email) inputs.email.value = userEmail;
        if(inputs.contactos) inputs.contactos.value = data.contactos || ''; // Maneja nulos
        // Para span (modo lectura)
        const infoContacto = document.getElementById('info-contacto');
        if(infoContacto) infoContacto.textContent = data.contactos || '';

        // Cargar regiones y seleccionar
        await loadRegions(data.regionId, data.comunaId);
        
        // Lógica de bloqueo:
        // Si estamos en el Dashboard (hay lista de productos), bloqueamos todo.
        if (myProductsList) {
            if(inputs.region) inputs.region.disabled = true;
            if(inputs.comuna) inputs.comuna.disabled = true;
        } 
        // Si NO estamos en Dashboard (estamos en edición), NO bloqueamos.

    } catch (error) {
        console.error("Error al cargar perfil:", error);
    }
}

// --- UTILIDADES DE UBICACIÓN ---
async function loadRegions(userReg, userCom) {
    if(!inputs.region) return; // Si no hay select de región, salir

    try {
        const res = await fetch(`${API_URL_LOCATIONS}/regions`);
        const regions = await res.json();
        populateSelect(inputs.region, regions, 'treg_id', 'treg_nom');
        
        if(userReg) {
            inputs.region.value = userReg;
            await loadComunas(userReg, userCom);
        }
    } catch (e) { console.error(e); }
}

async function loadComunas(regionId, userCom) {
    if(!inputs.comuna || !regionId) return;

    try {
        const res = await fetch(`${API_URL_LOCATIONS}/comunas/${regionId}`);
        const comunas = await res.json();
        populateSelect(inputs.comuna, comunas, 'tcom_id', 'tcom_nom');
        if(userCom) inputs.comuna.value = userCom;
    } catch (e) { console.error(e); }
}

function populateSelect(el, items, val, txt) {
    el.innerHTML = '<option value="" disabled selected>Seleccione</option>';
    items.forEach(i => {
        const opt = document.createElement('option');
        opt.value = i[val];
        opt.textContent = i[txt];
        el.appendChild(opt);
    });
}

if(inputs.region) {
    inputs.region.addEventListener('change', () => loadComunas(inputs.region.value));
}

// --- 4. MODO EDICIÓN ---
function enableEditFields() {
    // Habilitar todos los inputs excepto email
    Object.values(inputs).forEach(inp => {
        if(inp && inp !== inputs.email) inp.disabled = false;
    });
}

// Toggle manual (Para el dashboard antiguo o si se requiere)
if(btns.editar) {
    btns.editar.addEventListener('click', () => {
        // Si estamos en Dashboard, redirigimos a la página de edición
        if(myProductsList) {
            window.location.href = '/user/edit';
        } else {
            // Fallback por si acaso
            enableEditFields();
        }
    });
}

if(btns.cancelar) {
    btns.cancelar.addEventListener('click', () => {
        window.location.href = '/user'; // Volver al dashboard
    });
}

// --- 5. GUARDAR Y ELIMINAR ---
if(profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            nombre: inputs.nombre.value,
            apellido: inputs.apellido.value,
            contactos: inputs.contactos.value,
            comunaId: inputs.comuna.value,
            password: inputs.password ? inputs.password.value : ''
        };
        
        try {
            const res = await fetch(`${API_URL_USERS}/profile/${userEmail}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            if(res.ok) {
                alert('Perfil actualizado correctamente');
                window.location.href = '/user'; // Volver al dashboard
            } else {
                alert('Error al actualizar perfil');
            }
        } catch (e) { console.error(e); }
    });
}

if(btns.eliminar) {
    btns.eliminar.addEventListener('click', async () => {
        if(confirm('¿Estás seguro de que deseas ELIMINAR tu cuenta? Esta acción es irreversible.')) {
            await fetch(`${API_URL_USERS}/profile/${userEmail}`, { method: 'DELETE' });
            localStorage.clear();
            window.location.href = '/login';
        }
    });
}

// --- NUEVA FUNCIÓN: ELIMINAR PRODUCTO ---
async function deleteProduct(id) {
    if(!confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) return;

    try {
        const response = await fetch(`/delete/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Producto eliminado correctamente.');
            loadUserProducts(); // Recargar la lista
        } else {
            alert('Hubo un error al eliminar el producto.');
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión.');
    }
}