// public/js/categories.js

const API_URL_CATEGORIES = 'http://localhost:3000/api/categories';

const categoryForm = document.getElementById('category-form');
const categoryIdInput = document.getElementById('category-id');
const categoryNameInput = document.getElementById('category-name');
const categoryList = document.getElementById('category-list');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// --- FUNCIONES ---

// 1. Cargar y mostrar todas las categorías
async function loadCategories() {
    categoryList.innerHTML = '<li>Cargando...</li>'; // Feedback visual
    try {
        const response = await fetch(API_URL_CATEGORIES);
        if (!response.ok) throw new Error('Error al cargar categorías');
        const categories = await response.json();

        categoryList.innerHTML = ''; // Limpiar lista

        if (categories.length === 0) {
            categoryList.innerHTML = '<li>No hay categorías registradas.</li>';
            return;
        }

        categories.forEach(cat => {
            const li = document.createElement('li');
            
            // Creamos un span para el texto (nombre + ID)
            const textSpan = document.createElement('span');
            textSpan.textContent = `${cat.tct_nmb} (ID: ${cat.tct_id})`;

            // Creamos un DIV contenedor para los botones
            const btnContainer = document.createElement('div');
            btnContainer.style.display = 'flex'; // Asegura que estén en fila
            btnContainer.style.gap = '10px';     // Separación entre ellos

            // Botón Editar
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.classList.add('edit-btn');
            editButton.onclick = () => populateFormForEdit(cat);

            // Botón Eliminar
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('delete-btn');
            deleteButton.onclick = () => deleteCategory(cat.tct_id);

            // Metemos los botones al contenedor
            btnContainer.appendChild(editButton);
            btnContainer.appendChild(deleteButton);

            // Metemos texto y contenedor al LI
            li.appendChild(textSpan);
            li.appendChild(btnContainer);
            
            categoryList.appendChild(li);
        });

    } catch (error) {
        console.error(error);
        categoryList.innerHTML = '<li>Error al cargar categorías.</li>';
    }
}

// 2. Rellenar el formulario para editar una categoría
function populateFormForEdit(category) {
    categoryIdInput.value = category.tct_id; // Guarda el ID en el campo oculto
    categoryNameInput.value = category.tct_nmb; // Pone el nombre en el input
    cancelEditBtn.style.display = 'inline-block'; // Muestra el botón de cancelar
    categoryNameInput.focus(); // Pone el foco en el input para editar
}

// 3. Limpiar el formulario (para añadir o después de cancelar)
function resetForm() {
    categoryIdInput.value = ''; // Limpia el ID oculto
    categoryNameInput.value = ''; // Limpia el nombre
    cancelEditBtn.style.display = 'none'; // Oculta el botón de cancelar
}

// 4. Eliminar una categoría
async function deleteCategory(id) {
    if (!confirm(`¿Estás seguro de que quieres eliminar la categoría con ID ${id}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL_CATEGORIES}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'No se pudo eliminar la categoría.');
        }

        alert(result.message || 'Categoría eliminada.');
        loadCategories(); // Recargar la lista

    } catch (error) {
        console.error(error);
        alert(`Error: ${error.message}`);
    }
}

// --- MANEJADORES DE EVENTOS ---

// 1. Al cargar la página, cargar las categorías
document.addEventListener('DOMContentLoaded', loadCategories);

// 2. Al enviar el formulario (Crear o Actualizar)
categoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = categoryIdInput.value; // Obtiene el ID (vacío si es nuevo)
    const nombre = categoryNameInput.value.trim(); // Obtiene el nombre y quita espacios extra

    if (!nombre) {
        alert('El nombre no puede estar vacío.');
        return;
    }

    const categoryData = { nombre };
    const method = id ? 'PUT' : 'POST'; // Si hay ID -> PUT, si no -> POST
    const url = id ? `${API_URL_CATEGORIES}/${id}` : API_URL_CATEGORIES;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData)
        });

        const result = await response.json();

        if (!response.ok) {
             // Si el servidor devolvió un error específico (ej: duplicado)
            throw new Error(result.error || `Error al ${id ? 'actualizar' : 'crear'} la categoría.`);
        }

        alert(`Categoría ${id ? 'actualizada' : 'creada'} exitosamente.`);
        resetForm(); // Limpiar el formulario
        loadCategories(); // Recargar la lista

    } catch (error) {
        console.error(error);
        alert(`Error: ${error.message}`);
    }
});

// 3. Botón Cancelar Edición
cancelEditBtn.addEventListener('click', resetForm);