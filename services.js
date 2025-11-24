const URL_BASE = "http://localhost:"
const puertoConvocatoria = 3308
const puertoPostulante = 3308

const URL_convocatorias = `${URL_BASE}${puertoConvocatoria}/apiRedes/convocatoria`
const URL_postulantes = `${URL_BASE}${puertoPostulante}/proyecto_redes_capasback/postulante/`

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

    // 6. Llamar microservicio
    getPostulantes_convocatoria(id);
});


function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password')
    const imgIcon = document.getElementById('iconPassword')
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    const icon = passwordInput.getAttribute('type') === 'password' ? 'https://cdn-icons-png.flaticon.com/512/9759/9759281.png' : 'https://cdn-icons-png.flaticon.com/512/6684/6684701.png '
    passwordInput.setAttribute('type', type);
    imgIcon.setAttribute('src', icon)

}

async function getAllconvocatorias() {
    //const URL_convocatorias = `${URL_BASE}${puertoConvocatoria}/apiRedes/convocatoria`
    const URL_DATOSIMULADOS = "./dataSimulada/convocatoria.json"
    const template = document.getElementById("convocatoria-template")
    const grid = document.getElementById("convocatorias-grid")

    try {
        //cambiar url cuando se conecté con el backend
        //const res = await fetch(`${URL_convocatorias}/`) //=> consulta convocatorias, sacado de la documentacion de convocatorias
        const res = await fetch(URL_DATOSIMULADOS)

        if (!res.ok) {
            throw new Error(`Error al cargar los datos: ${res.statusText}`);
        }

        const convocatorias = await res.json();

        convocatorias.forEach(item => {
            const clone = template.content.cloneNode(true)
            clone.querySelector("#id_convocatoria").textContent = item.idConvocatoria
            clone.querySelector("#nombre_convocatoria").textContent = item.tituloCon
            clone.querySelector("#titulo_proyecto").textContent = item.tituloProyecto
            clone.querySelector("#descripcion_convocatoria").textContent = item.descripcion
            clone.querySelector("#area_requerida_convocatoria").textContent = item.areaRequerida
            clone.querySelector("#fechaMax_convocatoria").textContent = item.fecha_cierre
            /*clone.querySelector("#btn_convocatoria").onclick = () => {
                const id = item.idConvocatoria
                const gridPostulantes = document.getElementById("postulante-grid")
                if (gridPostulantes.hasChildNodes()) {
                    gridPostulantes.innerHTML = '';
                }
                let tituloConvocatoria = document.querySelector("#titulo_convocatoria")
                tituloConvocatoria.textContent= item.tituloCon
                console.log(item.tituloCon)
                getPostulantes_convocatoria(id);
                console.log(id)
            }*/

            grid.appendChild(clone)
        })


    } catch (error) {
        console.error(error)
    }
}

async function getPostulantes_convocatoria(idConvocatoria) {
    /*
    Hay un problema con esta función y es que en el backend de los postulantes no existe ninguna funcion para traer los postulantes
    de una convocatoria en especifico. Así que creé un endpoint sugerido por chapeto para esta función para cuando se creé.
    El puerto es el que esta actualmente (23/11/2025 4:07 pm) en la rama de juan david 
    |
    V
    http://localhost:3308/api/postulantes/Corto/:idConvocatoria
    const URL_postulantesXconvocatoria = await fetch(`${URL_BASE}${puertoPostulante}/apiRedes/postulantes/Corto/:titulo_convocatoria`)
    */

    const URL_DATOSIMULADOS = "./dataSimulada/postulantesDeConvocatoria.json"
    const template = document.getElementById("card_postulantes_template")
    const grid = document.getElementById("postulante-grid")
    try {
        //cambiar url cuando se conecté con el backend
        const res = await fetch(URL_DATOSIMULADOS)

        if (!res.ok) {
            throw new Error(`Error al cargar los datos: ${res.statusText}`);
        }

        const postulantes = await res.json();

        postulantes.forEach(item => {
            const clone = template.content.cloneNode(true)
            clone.querySelector("#id_postulante").textContent = item.idPost
            clone.querySelector("#nombre_postulante").textContent = item.usuarioPos
            clone.querySelector("#rol_postulante").textContent = item.rolPos
            clone.querySelector("#estado_postulante").textContent = item.estadoPost

            grid.appendChild(clone)
        })
    } catch (error) {
        console.error(error)
    }

}


async function aceptarPostulante(buttonElement) {
    // se usa .closest() para encontrar el ancestro más cercano con la clase 'bg-white' (la tarjeta)
    const cardContainer = buttonElement.closest('.bg-white');
    const idPostElement = cardContainer.querySelector("#id_postulante");
    const idPost = idPostElement ? idPostElement.textContent.trim() : null;
    const toastedCoreccto = document.querySelector("#correct_toasted");
    const toastedInCoreccto = document.querySelector("#inCorrect_toasted");

    if (idPost) {
        console.log(`ID del Postulante Aceptado: ${idPost}`); // Esto debería ser 9
        cardContainer.classList.add("hidden")
        toastedCoreccto.querySelector("#id_usuario").textContent = idPost
        toastedCoreccto.classList.remove("hidden")
        toastedCoreccto.classList.add("animate-fadeIn");
        setTimeout(() => {
            toastedCoreccto.classList.add("hidden")
            // lo que quieres ejecutar
        }, 5000);
        try {

            //const URL_convocatorias = await axios.post(`${URL_BASE}${puertoConvocatoria}/apiRedes/convocatoria/participantes`)
            /*const resultPostParticipante = await axios.post(`${URL_convocatorias}/participantes`)
            const resultPutPostulante = await axios.put(`${URL_postulantes}/${idPost}/estado`)
            if(resultPostParticipante.ok & resultPutPostulante.ok){
                cardContainer.classList.add("hidden");
            }*/
        } catch (error) {
            console.error(error)
            toastedCoreccto.querySelector("#id_usuario").textContent = idPost
            toastedCoreccto.classList.remove("hidden")
            toastedCoreccto.classList.add("animate-fadeIn");
            setTimeout(() => {
                toastedCoreccto.classList.add("hidden")
                // lo que quieres ejecutar
            }, 5000);
            alert("Hubo un error aceptando al postulante", error)
        }

    } else {
        console.error("No se pudo encontrar el ID del postulante.");
    }
}

// Haz el mismo cambio para rechazarPostulante
async function rechazarPostulante(buttonElement) {
    const cardContainer = buttonElement.closest('.bg-white');
    const idPostElement = cardContainer.querySelector("#id_postulante");
    const idPost = idPostElement ? idPostElement.textContent.trim() : null;

    if (idPost) {
        console.log(`ID del Postulante Rechazado: ${idPost}`);
        // ... (Tu lógica de rechazo aquí) ...
    }
}