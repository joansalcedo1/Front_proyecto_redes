// BASE DE LA URL
//cuando se suba a la vm se cambia el localhost por la direccion ip de la maquina del backen
const URL_BASE = "http://localhost:"
//cambiar localhost por direccion ip de maquina => 192.168.100.2

//DEFINIR PUERTOS DE CADA MICROSERVICIO
const puertoOfertante = 3303 
const puertoConvocatoria = 3308
const puertoUsuarios= 3310 
const puertoProyecto = 3312 
const puertoPostulante = 3314

/*
Postulante 3314
Ofertante 3303
Usuarios 3310
Convocatoria 3308
Proyectos 3312
*/

//DEFINIR URL'S DE CADA MICROSERVICIO
//en cada llamado de cada microservicio se le agrega lo necesario
const URL_postulantes = `${URL_BASE}${puertoPostulante}/proyecto_redes_capasback/postulante`
const URL_convocatorias = `${URL_BASE}${puertoConvocatoria}/apiRedes/convocatoria`
const URL_ofertantes = `${URL_BASE}${puertoOfertante}/apiredes/ofertante`
const URL_proyectos = `${URL_BASE}${puertoOfertante}/apiredes/proyecto`
const URL_usuarios = `${URL_BASE}${puertoOfertante}/apiredes/usuarios`
//limpiar el sessionStorage
let userId = sessionStorage.getItem("userId");
console.log(userId)
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

//============= Gestionar los toasted ============= 
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

//=============  Modificar la card seleccionada ============= 
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
    const areaRequerida = card.querySelector("#area_requerida_convocatoria").textContent;
    // 4. Mostrar nombre en el h4 externo
    document.querySelector("#titulo_convocatoria").textContent = titulo;
    
    // 5. Limpiar postulantes previos
    const gridPostulantes = document.getElementById("postulante-grid");
    gridPostulantes.innerHTML = "";

    // actualizar estado global
    convocatoriaSeleccionada = { id, titulo, areaRequerida };
    console.log(convocatoriaSeleccionada)
    // llamar al renderizador general
    renderSeccionConvocatoria();
});

/*=============  Hacer fetch =============
USO ==> await http("POST",URL_PROYECTOS,payload)         
*/
async function http(method, url, data) {
    const options = { method, headers: {} };

    if (data) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
    }

    const res = await fetch(url, options);
    return res;  
}

async function consultarInfoUsuario() {
    const URL_SIMULADA = "./dataSimulada/inicioSesion.json"
    try {
        //const result = await http("GET",`${URL_usuarios}/${userId}`)
        const result = await http("GET", URL_SIMULADA)
        const data = await result.json()

        console.log(data)
        document.querySelector("#nombre_perfil").textContent = data.nombre;
        document.querySelector("#rol_perfil").textContent = data.rol;
        document.querySelector("#img_perfil").src = data.srcFotoPerfil;
    } catch (error) {
        console.error(error.message)
        throw error;
    }
}