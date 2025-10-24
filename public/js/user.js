// =======================================================
// === SCRIPT PARA PÁGINA DE PERFIL (user.html) ===
// =======================================================

// =======================================================
// === 1. URLs Y ELEMENTOS DEL DOM ===
// =======================================================

// URLs (Reutilizando la lógica de login.js)
const API_BASE_URL = 'http://localhost:3000/api';
const API_URL_LOCATIONS = `${API_BASE_URL}/locations`;
const API_URL_USERS = `${API_BASE_URL}/users`;

// Elementos del Formulario
const profileForm = document.getElementById('profile-form');
const messageDisplay = document.getElementById('message-display'); // ID unificado

// Inputs
const emailInput = document.getElementById('perfil-email');
const nombreInput = document.getElementById('perfil-nombre');
const apellidoInput = document.getElementById('perfil-apellido');
const contactosInput = document.getElementById('perfil-contactos');
const passwordInput = document.getElementById('perfil-password');
const regionSelect = document.getElementById('perfil-region');
const comunaSelect = document.getElementById('perfil-comuna');
const passwordGroup = document.getElementById('password-change-group');
const emailDisplayGroup = document.getElementById('email-display-group'); // Para ocultar/mostrar email

// Botones
const editarBtn = document.getElementById('editar-btn');
const guardarBtn = document.getElementById('guardar-btn');
const cancelarBtn = document.getElementById('cancelar-btn');
const eliminarBtn = document.getElementById('eliminar-btn');

// Guardar el email del usuario (¡Importante!)
const userEmail = localStorage.getItem('userEmail');

// =======================================================
// === 2. LÓGICA DE CARGA DE UBICACIONES (REUTILIZADA) ===
// =======================================================

// Función genérica para llenar <select>
function populateSelect(selectElement, itemsArray, valueKey, textKey, defaultText, isDisabled = false) {
    selectElement.innerHTML = '';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = defaultText;
    defaultOption.disabled = true;
    defaultOption.selected = !itemsArray.some(item => item[valueKey]); // Selecciona default si no hay valor
    selectElement.appendChild(defaultOption);

    itemsArray.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[textKey];
        selectElement.appendChild(option);
    });
    selectElement.disabled = isDisabled;
}

// Cargar Comunas (basado en la región seleccionada)
async function loadComunas() {
    const regionId = regionSelect.value;
    if (!regionId) return;

    comunaSelect.innerHTML = '<option value="" selected>Cargando...</option>';
    comunaSelect.disabled = true;
    
    try {
        const response = await fetch(`${API_URL_LOCATIONS}/comunas/${regionId}`);
        if (!response.ok) throw new Error('Error al cargar comunas');
        const comunas = await response.json();
        populateSelect(comunaSelect, comunas, 'tcom_id', 'tcom_nom', 'Seleccione comuna');
    } catch (error) {
        console.error(error);
        comunaSelect.innerHTML = '<option value="" disabled selected>Error de carga</option>';
    }
}

// Cargar Regiones (y luego seleccionar la del usuario)
async function loadRegions(userRegionId, userComunaId) {
    try {
        const response = await fetch(`${API_URL_LOCATIONS}/regions`);
        if (!response.ok) throw new Error('Error al cargar regiones');
        const regions = await response.json();
        
        populateSelect(regionSelect, regions, 'treg_id', 'treg_nom', 'Seleccione región');
        
        // Si tenemos los datos del usuario, los seleccionamos
        if (userRegionId) {
            regionSelect.value = userRegionId;
            // Una vez seleccionada la región, cargamos sus comunas
            await loadComunas();
            // Y seleccionamos la comuna del usuario
            if (userComunaId) {
                comunaSelect.value = userComunaId;
            }
        }
    } catch (error) {
        console.error(error);
        regionSelect.innerHTML = '<option value="" disabled selected>Error de carga</option>';
    }
}

// =======================================================
// === 3. LÓGICA DEL PERFIL (MODO EDICIÓN/VISTA) ===
// =======================================================

// Habilita/Deshabilita los campos del formulario
function setFormEditable(isEditable) {
    // Habilita/deshabilita inputs (el email NUNCA se habilita)
    [nombreInput, apellidoInput, contactosInput, passwordInput, regionSelect, comunaSelect].forEach(input => {
        input.disabled = !isEditable;
    });

    // Muestra/Oculta botones
    editarBtn.style.display = isEditable ? 'none' : 'block';
    eliminarBtn.style.display = isEditable ? 'none' : 'block';
    guardarBtn.style.display = isEditable ? 'block' : 'none';
    cancelarBtn.style.display = isEditable ? 'block' : 'none';
    
    // Muestra/Oculta campo de contraseña
    passwordGroup.style.display = isEditable ? 'block' : 'none';
    
    // Muestra/Oculta el campo de email (que siempre está deshabilitado)
    emailDisplayGroup.style.display = isEditable ? 'block' : 'none';

    // Limpia el campo de contraseña y mensajes
    passwordInput.value = '';
    messageDisplay.textContent = '';
}

// Función para cargar los datos del usuario en el formulario
async function loadUserProfile() {
    if (!userEmail) {
        messageDisplay.textContent = 'Error: No se encontró usuario. Redirigiendo...';
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }

    setFormEditable(false);
    emailInput.value = userEmail; // El email no es editable, pero lo cargamos

    try {
        const response = await fetch(`${API_URL_USERS}/profile/${userEmail}`);
        if (!response.ok) {
            throw new Error('No se pudieron cargar los datos del perfil.');
        }
        
        const data = await response.json();
        
        // Llenar inputs
        nombreInput.value = data.nombre;
        apellidoInput.value = data.apellido;
        contactosInput.value = data.contactos;
        
        // Cargar y seleccionar Región/Comuna
        await loadRegions(data.regionId, data.comunaId);

    } catch (error) {
        console.error(error);
        messageDisplay.style.color = 'red';
        messageDisplay.textContent = error.message;
    }
}

// =======================================================
// === 4. MANEJADORES DE EVENTOS (LISTENERS) ===
// =======================================================

// 1. Cargar datos cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    // Si el usuario no está logueado, fuera de aquí.
    if (!userEmail) {
        window.location.href = 'login.html';
        return;
    }
    loadUserProfile();
});

// 2. Botón Editar
editarBtn.addEventListener('click', () => {
    setFormEditable(true);
});

// 3. Botón Cancelar
cancelarBtn.addEventListener('click', () => {
    // Simplemente volvemos a cargar los datos originales
    loadUserProfile(); 
    setFormEditable(false);
});

// 4. Actualizar Región -> Cargar Comunas
regionSelect.addEventListener('change', loadComunas);

// 5. Guardar Cambios (Submit del formulario)
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageDisplay.textContent = 'Guardando...';
    messageDisplay.style.color = '#333'; // Reutiliza estilo de login.js

    const dataToUpdate = {
        nombre: nombreInput.value,
        apellido: apellidoInput.value,
        contactos: contactosInput.value,
        comunaId: parseInt(comunaSelect.value),
        password: passwordInput.value // Se envía vacío o con data
    };
    
    try {
        const response = await fetch(`${API_URL_USERS}/profile/${userEmail}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToUpdate)
        });

        const result = await response.json();

        if (response.ok) {
            messageDisplay.textContent = result.message;
            messageDisplay.style.color = 'green';
            setFormEditable(false);
        } else {
            throw new Error(result.error || 'Error al guardar.');
        }
    } catch (error) {
        console.error(error);
        messageDisplay.style.color = 'red';
        messageDisplay.textContent = error.message;
    }
});

// 6. Botón Eliminar Cuenta
eliminarBtn.addEventListener('click', async () => {
    
    if (!confirm('¿Estás seguro de que deseas ELIMINAR tu cuenta? Esta acción es irreversible.')) {
        return;
    }

    messageDisplay.textContent = 'Eliminando cuenta...';
    try {
        const response = await fetch(`${API_URL_USERS}/profile/${userEmail}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();

        if (response.ok) {
            messageDisplay.textContent = result.message;
            messageDisplay.style.color = 'green';
            // Limpiar datos locales y redirigir
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userToken'); // Limpiamos ambos
            setTimeout(() => window.location.href = 'login.html', 2000);
        } else {
            throw new Error(result.error || 'No se pudo eliminar la cuenta.');
        }

    } catch (error) {
        console.error(error);
        messageDisplay.style.color = 'red';
        messageDisplay.textContent = error.message;
    }
});