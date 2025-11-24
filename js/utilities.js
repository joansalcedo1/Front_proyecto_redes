//importante para renderizar la seccion de perfilesInteresados/participantes
let convocatoriaSeleccionada = null;

//tosated's basicos creados para confirmar mensajes
const toastedCoreccto = document.querySelector("#correct_toasted");
const toastedInCoreccto = document.querySelector("#inCorrect_toasted");

//función para el login y el register
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password')
    const imgIcon = document.getElementById('iconPassword')
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    const icon = passwordInput.getAttribute('type') === 'password' ? 'https://cdn-icons-png.flaticon.com/512/9759/9759281.png' : 'https://cdn-icons-png.flaticon.com/512/6684/6684701.png '
    passwordInput.setAttribute('type', type);
    imgIcon.setAttribute('src', icon)

}

//codigo para el uso del modal en convocatorias
// 1. Obtener los elementos clave del DOM
const modalContainer = document.getElementById('modal-container');
const openBtn = document.getElementById('open-modal-btn');
const closeBtn = document.getElementById('close-modal-btn');
const overlay = document.getElementById('modal-overlay');

// 2. Función para Abrir el Modal
function openModal() {
    // Elimina la clase 'hidden' para mostrar el modal
    modalContainer.classList.remove('hidden');
    // Opcional: añade una clase para animaciones si las deseas
    console.log("abriendo modal")
}

// 3. Función para Cerrar el Modal
function closeModal() {
    // Añade la clase 'hidden' para ocultar el modal
    modalContainer.classList.add('hidden');
}

//Funciones para gestionar los toasted
function gestorToastedCorrecto(message) {
    //agrega el mensaje
    toastedCoreccto.querySelector("#toasted_message_content").textContent = message
    //Muestra el toasted
    toastedCoreccto.classList.remove("hidden")
    //lo cierra a los 5 segundos
    setTimeout(() => {
        toastedCoreccto.classList.add("hidden")
    }, 5000);
}
function gestorToastedINCorrecto(message) {
    //agrega el mensaje
    toastedInCoreccto.querySelector("#toasted_message_content").textContent = message
    //Muestra el toasted
    toastedInCoreccto.classList.remove("hidden")
    //lo cierra a los 5 segundos
    setTimeout(() => {
        toastedInCoreccto.classList.add("hidden")
    }, 5000);
}

//codigo para modificar la card seleccionada
document.getElementById("convocatorias-grid").addEventListener("click", function (e) {
    const btn = e.target.closest("#btn_convocatoria");
    if (!btn) return;

    const card = btn.closest("#template-card");

    // 1. Quitar selección previa
    document.querySelectorAll("#template-card").forEach(c => {
        c.classList.remove("ring-2", "ring-teal-600", "shadow-lg", "scale-[1.01]");
    });

    // 2. Activar estilo de la card seleccionada
    card.classList.add("ring-2", "ring-teal-600", "shadow-lg", "scale-[1.01]");

    // 3. Obtener ID y título de la convocatoria
    const id = card.querySelector("#id_convocatoria").textContent;
    const titulo = card.querySelector("#nombre_convocatoria").textContent;

    // 4. Mostrar nombre en el h4 externo
    document.querySelector("#titulo_convocatoria").textContent = titulo;

    // 5. Limpiar postulantes previos
    const gridPostulantes = document.getElementById("postulante-grid");
    gridPostulantes.innerHTML = "";

    // actualizar estado global
    convocatoriaSeleccionada = { id, titulo };

    // llamar al renderizador general
    renderSeccionConvocatoria();
});


function renderSeccionConvocatoria() {
    //funcion clave para mostrar los participantes o los postulantes
    if (!convocatoriaSeleccionada) return;

    const gridPostulantes = document.getElementById("postulante-grid");
    const selectSeccion = document.getElementById("verSeccion");
    selectSeccion.onchange = async (e) => {
        e.preventDefault()
        gridPostulantes.innerHTML = "";
        const opcion = selectSeccion.value;
        console.log("Renderizando sección:", opcion);
        if (opcion === "perfiles interesados") {
            await getPostulantes_convocatoria(convocatoriaSeleccionada.titulo);
        } else {
            await getParticipantes_convocatoria(convocatoriaSeleccionada.id);
        }
    }
}
