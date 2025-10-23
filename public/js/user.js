// js/user.js

// =======================================================
// === CONSTANTES Y URLs ===
// =======================================================

const API_BASE_URL = 'http://localhost:3000/api'; 
const API_URL_REGIONS = `${API_BASE_URL}/locations/regions`;
const API_URL_COMUNAS = `${API_BASE_URL}/locations/comunas`;
// Asumo endpoints para el usuario autenticado. Usamos el email para la ruta.
const API_URL_USER_PROFILE = `${API_BASE_URL}/users/profile`; 
const API_URL_USER_UPDATE = (email) => `${API_BASE_URL}/users/${email}`; 
const API_URL_USER_DELETE = (email) => `${API_BASE_URL}/users/${email}`; 

// =======================================================
// === ELEMENTOS DEL DOM ===
// =======================================================

const profileForm = document.getElementById('profile-form');
const messageDisplay = document.getElementById('message-display-perfil');

const emailInput = document.getElementById('perfil-email');
const nombreInput = document.getElementById('perfil-nombre');
const apellidoInput = document.getElementById('perfil-apellido');
const contactosInput = document.getElementById('perfil-contactos');
const passwordInput = document.getElementById('perfil-password');
const regionSelect = document.getElementById('perfil-region');
const comunaSelect = document.getElementById('perfil-comuna');
const passwordChangeGroup = document.getElementById('password-change-group');

const editarBtn = document.getElementById('editar-btn');
const guardarBtn = document.getElementById('guardar-btn');
const cancelarBtn = document.getElementById('cancelar-btn');
const eliminarBtn = document.getElementById('eliminar-btn');

// =======================================================
// === VARIABLES DE ESTADO Y DATOS ===
// =======================================================

let isEditing = false;
let regionsData = [];
// El token y email del usuario deben venir del Login
let currentUserEmail = localStorage.getItem('userEmail');
let userToken = localStorage.getItem('userToken');

// =======================================================
// === FUNCIONES DE UTILIDAD (SELECTS) ===
// =======================================================

/**
 * Función genérica para llenar un <select>.
 * @param {HTMLElement} selectElement El elemento select a llenar.
 * @param {Array<object>} itemsArray Los datos.
 * @param {string} valueKey La clave para el valor de la opción.
 * @param {string} textKey La clave para el texto visible.
 * @param {string} defaultText Texto de la opción por defecto.
 * @param {boolean} isDisabled Si el select debe estar deshabilitado.
 * @param {string|number|null} selectedValue El valor que debe quedar seleccionado.
 */
function populateSelect(selectElement, itemsArray, valueKey, textKey, defaultText, isDisabled = false, selectedValue = null) {
    selectElement.innerHTML = '';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = defaultText;
    defaultOption.disabled = true;
    if (!selectedValue) defaultOption.selected = true;
    selectElement.appendChild(defaultOption);

    itemsArray.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[textKey];
        if (String(item[valueKey]) === String(selectedValue)) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });

    selectElement.disabled = isDisabled;
}

async function loadRegions(selectedRegionId = null) {
    try {
        const response = await fetch(API_URL_REGIONS);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        regionsData = await response.json(); 
        
        // El select se deshabilita si NO estamos editando
        populateSelect(regionSelect, regionsData, 'treg_id', 'treg_nom', 'Seleccione región', !isEditing, selectedRegionId);

    } catch (error) {
        console.error('Error al cargar regiones:', error);
        regionSelect.innerHTML = '<option value="" disabled selected>Error de carga</option>';
    }
}

async function loadComunas(regionId, selectedComunaId = null) {
    if (!regionId) {
        populateSelect(comunaSelect, [], 'tcom_id', 'tcom_nom', 'Seleccione una región primero', true);
        return;
    }

    comunaSelect.innerHTML = '<option value="" selected>Cargando comunas...</option>';
    comunaSelect.disabled = true;

    try {
        const response = await fetch(`${API_URL_COMUNAS}/${regionId}`); 
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const comunasData = await response.json(); 
        
        // El select se deshabilita si NO estamos editando
        populateSelect(comunaSelect, comunasData, 'tcom_id', 'tcom_nom', 'Seleccione comuna', !isEditing, selectedComunaId);
        if (isEditing) comunaSelect.disabled = false;
        
    } catch (error) {
        console.error('Error al cargar comunas:', error);
        comunaSelect.innerHTML = '<option value="" disabled selected>Error de carga</option>';
    }
}

// =======================================================
// === LÓGICA DE PERFIL Y EDICIÓN ===
// =======================================================

/** Verifica la autenticación y redirige si no hay sesión. */
function checkAuthentication() {
    if (!userToken || !currentUserEmail) {
        alert('Sesión no encontrada o expirada. Redirigiendo a Login.');
        localStorage.clear();
        window.location.href = 'login.html'; // O index.html si allí está tu login
        return false;
    }
    return true;
}

/** Obtiene los datos del usuario desde la API y los carga en el formulario. */
async function fetchUserProfile() {
    if (!checkAuthentication()) return;

    try {
        messageDisplay.textContent = 'Cargando perfil...';
        messageDisplay.style.color = 'blue';
        
        // Uso del email en la URL como parámetro para el perfil
        const response = await fetch(`${API_URL_USER_PROFILE}?email=${currentUserEmail}`, {
            method: 'GET',
            headers: {
                // El token es crucial para que el backend sepa quién eres
                'Authorization': `Bearer ${userToken}`, 
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expirado o inválido
                localStorage.clear();
                alert('Sesión expirada. Por favor, inicie sesión de nuevo.');
                window.location.href = 'login.html'; // O index.html
                return;
            }
            throw new Error(`Error al obtener perfil: ${response.status}`);
        }

        const user = await response.json();

        // Llenar los campos con los datos obtenidos
        emailInput.value = user.email;
        nombreInput.value = user.nombre || '';
        apellidoInput.value = user.apellido || '';
        contactosInput.value = user.contactos || '';

        // Cargar y seleccionar las ubicaciones
        await loadRegions(user.regionId); 
        await loadComunas(user.regionId, user.comunaId);
        
        messageDisplay.textContent = 'Perfil cargado.';
        messageDisplay.style.color = 'green';
        
    } catch (error) {
        console.error('Error al cargar el perfil:', error);
        messageDisplay.textContent = 'Error al cargar el perfil. Inténtalo más tarde.';
        messageDisplay.style.color = 'red';
    }
}

/** Activa o desactiva el modo de edición. */
function toggleEditMode(enable) {
    isEditing = enable;
    
    // Habilitar/deshabilitar campos
    nombreInput.disabled = !enable;
    apellidoInput.disabled = !enable;
    contactosInput.disabled = !enable;
    passwordInput.disabled = !enable; 
    
    // Habilitar/deshabilitar selects
    regionSelect.disabled = !enable;
    comunaSelect.disabled = !enable; // Se controla de nuevo en loadComunas

    // Mostrar/ocultar botones y campos
    editarBtn.style.display = enable ? 'none' : 'inline-block';
    guardarBtn.style.display = enable ? 'inline-block' : 'none';
    cancelarBtn.style.display = enable ? 'inline-block' : 'none';
    eliminarBtn.style.display = enable ? 'none' : 'inline-block';
    passwordChangeGroup.style.display = enable ? 'block' : 'none';
    
    // Si se activa la edición, se activa el listener para la carga dinámica de comunas
    if (enable) {
         regionSelect.addEventListener('change', () => loadComunas(regionSelect.value));
    } else {
         // Quitar el listener cuando no se edita para evitar llamadas innecesarias
         regionSelect.removeEventListener('change', () => loadComunas(regionSelect.value));
    }
}

// =======================================================
// === LISTENERS Y ACCIONES ===
// =======================================================

// 1. Botón Editar
editarBtn.addEventListener('click', () => {
    toggleEditMode(true);
    messageDisplay.textContent = 'Modifica los campos y pulsa Guardar.';
    messageDisplay.style.color = 'orange';
});

// 2. Botón Cancelar
cancelarBtn.addEventListener('click', () => {
    // Recargar los datos originales y salir del modo edición
    toggleEditMode(false);
    fetchUserProfile(); 
});

// 3. Formulario (Guardar Cambios)
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!isEditing || !checkAuthentication()) return;

    // Validación mínima de campos
    if (!nombreInput.value || !apellidoInput.value || !regionSelect.value || !comunaSelect.value) {
        messageDisplay.textContent = 'Nombre, Apellido y Ubicación son obligatorios.';
        messageDisplay.style.color = 'red';
        return;
    }

    const updatedData = {
        nombre: nombreInput.value,
        apellido: apellidoInput.value,
        contactos: contactosInput.value,
        comunaId: parseInt(comunaSelect.value),
    };
    
    // Incluir password solo si el campo no está vacío
    if (passwordInput.value) {
        updatedData.password = passwordInput.value;
    }
    
    try {
        messageDisplay.textContent = 'Guardando cambios...';
        messageDisplay.style.color = 'blue';

        // Petición PATCH para actualizar los datos
        const response = await fetch(API_URL_USER_UPDATE(currentUserEmail), {
            method: 'PATCH', 
            headers: {
                'Authorization': `Bearer ${userToken}`, 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        const data = await response.json();

        if (response.ok) {
            messageDisplay.textContent = '¡Perfil actualizado con éxito!';
            messageDisplay.style.color = 'green';
            passwordInput.value = ''; // Limpiar campo password después de guardar
            toggleEditMode(false);
            fetchUserProfile(); // Recargar datos para asegurar consistencia
        } else {
            messageDisplay.textContent = `Error al actualizar: ${data.error || 'Inténtalo de nuevo.'}`;
            messageDisplay.style.color = 'red';
        }

    } catch (error) {
        console.error('Error de red/servidor:', error);
        messageDisplay.textContent = 'Error de conexión al actualizar. Verifique el servidor.';
        messageDisplay.style.color = 'red';
    }
});

// 4. Botón Eliminar
eliminarBtn.addEventListener('click', async () => {
    if (!checkAuthentication()) return;

    if (!confirm('⚠️ ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.')) {
        return;
    }
    
    try {
        messageDisplay.textContent = 'Eliminando cuenta...';
        messageDisplay.style.color = 'red';

        // Petición DELETE para eliminar la cuenta
        const response = await fetch(API_URL_USER_DELETE(currentUserEmail), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userToken}`, 
                'Content-Type': 'application/json'
            }
        });

        if (response.ok || response.status === 204) { 
            localStorage.clear(); // Limpiar la sesión
            alert('Tu cuenta ha sido eliminada. Redirigiendo al login.');
            window.location.href = 'login.html'; // Redirige al login o a la página de inicio
        } else {
            const data = await response.json();
            messageDisplay.textContent = `Error al eliminar: ${data.error || 'Inténtalo de nuevo.'}`;
        }

    } catch (error) {
        console.error('Error de red/servidor:', error);
        messageDisplay.textContent = 'Error de conexión al eliminar. Verifique el servidor.';
    }
});

// =======================================================
// === INICIO: Carga el perfil al cargar la página ===
// =======================================================
document.addEventListener('DOMContentLoaded', fetchUserProfile);