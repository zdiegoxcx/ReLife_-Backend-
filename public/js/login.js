// =======================================================
// === CONSTANTES Y ELEMENTOS DEL DOM ===
// =======================================================

// URLs Base
const API_BASE_URL = 'http://localhost:3000/api'; // Base única para todas las peticiones
const API_URL_REGIONS = `${API_BASE_URL}/locations/regions`;
const API_URL_COMUNAS = `${API_BASE_URL}/locations/comunas`;
const API_URL_REGISTER = `${API_BASE_URL}/users/register`;
const API_URL_LOGIN = `${API_BASE_URL}/users/login`;

// Elementos del DOM
const InicioFormulario = document.getElementById('Login-Formulario');
const RegistroFormulario = document.getElementById('Register-Formulario');
const CambioFormulario = document.getElementById('Cambio-Formulario');
const FormularioTitulo = document.getElementById('Titulo');

const regionSelect = document.getElementById('region-select');
const comunaSelect = document.getElementById('comuna-select');

// El HTML necesita un elemento para mostrar el feedback del registro (ej: un <p id="message-display">)
// Asumo que lo tienes en el HTML
const messageDisplay = document.getElementById('message-display'); 

// =======================================================
// === 1. LÓGICA DE CAMBIO DE FORMULARIO ===
// =======================================================

CambioFormulario.addEventListener('click', () => {
    if (InicioFormulario.classList.contains('Activo')) {
        // Mostrar registro
        InicioFormulario.classList.remove('Activo');
        RegistroFormulario.classList.add('Activo');
        FormularioTitulo.textContent = 'Registrarse';
        CambioFormulario.textContent = '¿Ya tienes cuenta? Iniciar sesión';
    } else {
        // Mostrar login
        RegistroFormulario.classList.remove('Activo');
        InicioFormulario.classList.add('Activo');
        FormularioTitulo.textContent = 'Iniciar Sesión';
        CambioFormulario.textContent = '¿No tienes cuenta? Regístrate';
    }
});

// =======================================================
// === 2. LÓGICA DE CARGA DE UBICACIONES (REGIONS/COMUNAS) ===
// =======================================================

// Función genérica para llenar un <select> (Sin cambios, está correcta)
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

// Cargar Regiones
async function loadRegions() {
    try {
        const response = await fetch(API_URL_REGIONS);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const regions = await response.json();
        
        populateSelect(regionSelect, regions, 'treg_id', 'treg_nom', 'Seleccione región');
        
        regionSelect.addEventListener('change', loadComunas);

    } catch (error) {
        console.error('Error al cargar regiones:', error);
        regionSelect.innerHTML = '<option value="" disabled selected>Error de carga</option>';
    }
}

// Cargar Comunas
async function loadComunas() {
    const regionId = regionSelect.value;
    
    if (!regionId) {
        comunaSelect.innerHTML = '<option value="" disabled selected>Seleccione una región primero</option>';
        comunaSelect.disabled = true;
        return;
    }

    comunaSelect.innerHTML = '<option value="" selected>Cargando comunas...</option>';
    comunaSelect.disabled = true;

    try {
        const response = await fetch(`${API_URL_COMUNAS}/${regionId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const comunas = await response.json();
        
        populateSelect(comunaSelect, comunas, 'tcom_id', 'tcom_nom', 'Seleccione comuna');
        comunaSelect.disabled = false;
        
    } catch (error) {
        console.error('Error al cargar comunas:', error);
        comunaSelect.innerHTML = '<option value="" disabled selected>Error de carga</option>';
    }
}

// Iniciar la carga
document.addEventListener('DOMContentLoaded', loadRegions);

// =======================================================
// === 3. LÓGICA DE REGISTRO DE USUARIO (CORREGIDA) ===
// =======================================================

RegistroFormulario.addEventListener('submit', async (e) => { // Usamos la constante RegistroFormulario
    e.preventDefault();

    // 1. Recoger todos los valores USANDO LOS IDs CORRECTOS
    const email = document.getElementById('email-reg').value;
    const password = document.getElementById('password-reg').value;
    const confirmPassword = document.getElementById('confirm-password-reg').value;
    const nombre = document.getElementById('nombre-reg').value;
    const apellido = document.getElementById('apellido-reg').value;
    const contactos = document.getElementById('contactos-reg').value;
    const comunaId = comunaSelect.value; 

    // 🚨 Nueva validación: Asegurar que Nombre y Apellido no estén vacíos 
    // (Tu DB los requiere como NOT NULL)
    if (!nombre || !apellido) {
        messageDisplay.textContent = 'El Nombre y Apellido son obligatorios.';
        messageDisplay.style.color = 'red';
        return;
    }

    // 🚨 VALIDACIÓN ADICIONAL: Contraseñas
    if (password !== confirmPassword) {
        messageDisplay.textContent = 'Las contraseñas no coinciden.';
        messageDisplay.style.color = 'red';
        return;
    }
    
    // Validar Comuna
    if (!comunaId) {
        messageDisplay.textContent = 'Debe seleccionar una Comuna.';
        messageDisplay.style.color = 'red';
        return;
    }
    
    // Construir el objeto de datos
    const userData = {
        email,
        password,
        nombre,
        apellido,
        contactos,
        comunaId: parseInt(comunaId) 
    };
    
    // Enviar los datos al endpoint de registro
    try {
        messageDisplay.textContent = 'Enviando registro...';
        messageDisplay.style.color = 'blue';

        const response = await fetch(API_URL_REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        // Manejar la respuesta del Backend
        if (response.ok) {
            messageDisplay.textContent = '¡Registro exitoso! Ya puedes iniciar sesión.';
            messageDisplay.style.color = 'green';
            RegistroFormulario.reset(); 
            // Opcional: switchForm(); para llevarlo a Login
            CambioFormulario.click();
        } else {
            messageDisplay.textContent = `Error: ${data.error || 'Ocurrió un error en el servidor.'}`;
            messageDisplay.style.color = 'red';
        }

    } catch (error) {
        console.error('Error de red/servidor:', error);
        messageDisplay.textContent = 'Error de conexión. Asegúrate de que el servidor esté corriendo en el puerto 3000.';
        messageDisplay.style.color = 'red';
    }
});

// =======================================================
// === 4. Inicio de sesion ===
// =======================================================

const emailLoginInput = document.getElementById('email-login');
const passwordLoginInput = document.getElementById('password-login');


InicioFormulario.addEventListener('submit', async (e) => { // Escucha el formulario de Login
    e.preventDefault();

    const email = emailLoginInput.value;
    const password = passwordLoginInput.value;

    if (!email || !password) {
        // En el formulario de Login puedes usar el mismo messageDisplay
        messageDisplay.textContent = 'Por favor, ingrese sus credenciales.';
        messageDisplay.style.color = 'red';
        return;
    }

    const loginData = { email, password , };

    try {
        messageDisplay.textContent = 'Verificando credenciales...';
        messageDisplay.style.color = 'blue';

        const response = await fetch(API_URL_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (response.ok) {


            localStorage.setItem('userToken', data.token); // Asumo que el backend devuelve un token
            localStorage.setItem('userEmail', email); // Guardamos el email para usarlo después


            localStorage.setItem('userRole', data.role || 'user');

            
            messageDisplay.textContent = `¡Bienvenido, ${email} ! Sesión iniciada.`;
            messageDisplay.style.color = 'green';
            window.location.href = '/';

        } else {
            messageDisplay.textContent = `Error de inicio: ${data.error || 'Credenciales incorrectas.'}`;
            messageDisplay.style.color = 'red';
        }

    } catch (error) {
        console.error('Error de red/servidor:', error);
        messageDisplay.textContent = 'Error de conexión. Verifique el servidor.';
        messageDisplay.style.color = 'red';
    }
});