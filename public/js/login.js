const API_BASE_URL = 'http://localhost:3000/api';
const API_URL_REGIONS = `${API_BASE_URL}/locations/regions`;
const API_URL_COMUNAS = `${API_BASE_URL}/locations/comunas`;
const API_URL_REGISTER = `${API_BASE_URL}/users/register`;
const API_URL_LOGIN = `${API_BASE_URL}/users/login`;

const InicioFormulario = document.getElementById('Login-Formulario');
const RegistroFormulario = document.getElementById('Register-Formulario');
const CambioFormulario = document.getElementById('Cambio-Formulario');
const FormularioTitulo = document.getElementById('Titulo');
const regionSelect = document.getElementById('region-select');
const comunaSelect = document.getElementById('comuna-select');
const messageDisplay = document.getElementById('message-display');

// CAMBIAR FORMULARIO
CambioFormulario.addEventListener('click', () => {
    // Limpiar mensajes al cambiar
    messageDisplay.textContent = ''; 
    messageDisplay.style.color = 'inherit';

    if (InicioFormulario.classList.contains('Activo')) {
        InicioFormulario.classList.remove('Activo');
        RegistroFormulario.classList.add('Activo');
        FormularioTitulo.textContent = 'Registrarse';
        CambioFormulario.textContent = '¿Ya tienes cuenta? Iniciar sesión';
    } else {
        RegistroFormulario.classList.remove('Activo');
        InicioFormulario.classList.add('Activo');
        FormularioTitulo.textContent = 'Iniciar Sesión';
        CambioFormulario.textContent = '¿No tienes cuenta? Regístrate';
    }
});

// CARGA DE REGIONES Y COMUNAS
function populateSelect(selectElement, itemsArray, valueKey, textKey, defaultText, isDisabled = false) {
    selectElement.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = defaultText;
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);
    itemsArray.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[textKey];
        selectElement.appendChild(option);
    });
    selectElement.disabled = isDisabled;
}

async function loadRegions() {
    try {
        const response = await fetch(API_URL_REGIONS);
        if (!response.ok) throw new Error('Error');
        const regions = await response.json();
        populateSelect(regionSelect, regions, 'treg_id', 'treg_nom', 'Seleccione región');
        regionSelect.addEventListener('change', loadComunas);
    } catch (error) { console.error(error); }
}

async function loadComunas() {
    const regionId = regionSelect.value;
    if (!regionId) return;
    try {
        const response = await fetch(`${API_URL_COMUNAS}/${regionId}`);
        const comunas = await response.json();
        populateSelect(comunaSelect, comunas, 'tcom_id', 'tcom_nom', 'Seleccione comuna');
        comunaSelect.disabled = false;
    } catch (error) { console.error(error); }
}

document.addEventListener('DOMContentLoaded', loadRegions);

// ==========================================
// REGISTRO CON DEMORA
// ==========================================
RegistroFormulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. Obtener datos
    const email = document.getElementById('email-reg').value;
    const password = document.getElementById('password-reg').value;
    const confirmPassword = document.getElementById('confirm-password-reg').value;
    const nombre = document.getElementById('nombre-reg').value;
    const apellido = document.getElementById('apellido-reg').value;
    const contactos = document.getElementById('contactos-reg').value;
    const comunaId = comunaSelect.value;

    if (password !== confirmPassword) {
        messageDisplay.textContent = 'Las contraseñas no coinciden.';
        messageDisplay.style.color = 'red';
        return;
    }

    // 2. Efecto de carga (Bloquear botón y cambiar texto)
    const btnSubmit = RegistroFormulario.querySelector('button');
    const textoOriginal = btnSubmit.textContent;
    btnSubmit.textContent = 'Procesando...';
    btnSubmit.disabled = true;
    messageDisplay.textContent = ''; // Limpiar mensajes previos

    // 3. LA DEMORA DE 2 SEGUNDOS
    await new Promise(resolve => setTimeout(resolve, 2000));

    const userData = { email, password, nombre, apellido, contactos, comunaId: parseInt(comunaId) };

    try {
        const response = await fetch(API_URL_REGISTER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await response.json();

        if (response.ok) {
            messageDisplay.textContent = '¡Registro exitoso! Inicia sesión.';
            messageDisplay.style.color = 'green';
            RegistroFormulario.reset();
            
            // Esperar un poquito más para cambiar al login automáticamente (opcional, pero se ve bien)
            setTimeout(() => {
                CambioFormulario.click();
            }, 1000);
            
        } else {
            messageDisplay.textContent = `Error: ${data.error}`;
            messageDisplay.style.color = 'red';
        }
    } catch (error) {
        messageDisplay.textContent = 'Error de conexión.';
        messageDisplay.style.color = 'red';
    } finally {
        // Restaurar botón
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
    }
});

// ==========================================
// LOGIN CON DEMORA
// ==========================================
const emailLoginInput = document.getElementById('email-login');
const passwordLoginInput = document.getElementById('password-login');

InicioFormulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailLoginInput.value;
    const password = passwordLoginInput.value;

    // 1. Efecto de carga
    const btnSubmit = InicioFormulario.querySelector('button');
    const textoOriginal = btnSubmit.textContent;
    btnSubmit.textContent = 'Verificando...';
    btnSubmit.disabled = true;
    messageDisplay.textContent = '';

    // 2. LA DEMORA DE 2 SEGUNDOS
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        const response = await fetch(API_URL_LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            // Guardamos datos
            localStorage.setItem('userToken', data.token);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', data.name);
            localStorage.setItem('userRole', data.role || 'user');

            messageDisplay.textContent = `¡Bienvenido!`;
            messageDisplay.style.color = 'green';
            
            // Redirigir
            window.location.href = '/';
        } else {
            messageDisplay.textContent = data.error; 
            messageDisplay.style.color = 'red';
            
            // Solo restauramos el botón si falló (si funcionó, nos vamos de la página)
            btnSubmit.textContent = textoOriginal;
            btnSubmit.disabled = false;
        }
    } catch (error) {
        messageDisplay.textContent = 'Error de conexión.';
        messageDisplay.style.color = 'red';
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
    }
});