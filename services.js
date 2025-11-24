
// BASE DE LA URL
//cuando se suba a la vm se cambia el localhost por la direccion ip de la maquina del backen
const URL_BASE = "http://localhost:"
//DEFINIR PUERTOS DE CADA MICROSERVICIO
const puertoConvocatoria = 3308
const puertoPostulante = 3308

//DEFINIR URL'S DE CADA MICROSERVICIO
//en cada llamado de cada microservicio se le agrega lo necesario
const URL_convocatorias = `${URL_BASE}${puertoConvocatoria}/apiRedes/convocatoria`
const URL_postulantes = `${URL_BASE}${puertoPostulante}/proyecto_redes_capasback/postulante`

//importante para renderizar la seccion de perfilesInteresados/participantes
let convocatoriaSeleccionada = null;

//función para el login y el register
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password')
    const imgIcon = document.getElementById('iconPassword')
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    const icon = passwordInput.getAttribute('type') === 'password' ? 'https://cdn-icons-png.flaticon.com/512/9759/9759281.png' : 'https://cdn-icons-png.flaticon.com/512/6684/6684701.png '
    passwordInput.setAttribute('type', type);
    imgIcon.setAttribute('src', icon)

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

//TRAE TODAS LAS CONVOCATORIAS HECHAS POR UN USUARIO 
/*
    Hay un problema con esta función y es que en el backend de las convocatorias no existe ninguna funcion para traer las convocatorias 
    de un usuario en especifico. Así que creé un endpoint sugerido por chapeto para esta función se creé.
    El puerto es el que esta actualmente (23/11/2025 4:07 pm) en la rama de juan david 
    |
    V
    http://localhost:3308/apiRedes/convocatoria/:id_usuarioOrganizador
 */
//esta función se llama en el onload del body de misConvocatorias.html
async function getAllconvocatorias(id_usuarioOrganizador) {
    const URL_DATOSIMULADOS = "./dataSimulada/convocatoria.json"
    const template = document.getElementById("convocatoria-template")
    const grid = document.getElementById("convocatorias-grid")

    try {
        //cambiar url cuando se conecté con el backend
        //const res = await fetch(`${URL_convocatorias}/${id_usuarioOrganizador}`) //=> consulta convocatorias, sacado de la documentacion de convocatorias
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

async function getPostulantes_convocatoria(tituloConvocatoria) {
    /*
    Hay un problema con esta función y es que en el backend de los postulantes no existe ninguna funcion para traer los postulantes
    de una convocatoria en especifico. Así que creé un endpoint sugerido por chapeto para esta función para cuando se creé.
    El puerto es el que esta actualmente (23/11/2025 4:07 pm) en la rama de juan david 
    |
    V
    http://localhost:3308/proyecto_redes_capasback/postulante/:nombre_convocatoria
    */

    const URL_DATOSIMULADOS = "./dataSimulada/postulantesDeConvocatoria.json"
    const template = document.getElementById("card_postulantes_template")
    const grid = document.getElementById("postulante-grid")
    //codigo para verificar si se muestran los participantes o los postulantes
    const selectSeccion = document.getElementById("verSeccion");

    try {
        //cambiar url cuando se conecté con el backend
        //const res = await axios.fetch(`${URL_postulantes}/${tituloConvocatoria}`)
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

async function getParticipantes_convocatoria(idConvocatoria) {
    
    const URL_DATOSIMULADOS = "./dataSimulada/participantesDeConvocatoria.json";
    const template = document.getElementById("card_participantes_template");
    const grid = document.getElementById("postulante-grid");

    try {
        //const res = await axios.fetch(`${URL_convocatorias}/participantes/${idConvocatoria}`)
        const res = await fetch(URL_DATOSIMULADOS);
        const participantes = await res.json();

        participantes.forEach(item => {
            const clone = template.content.cloneNode(true);
            clone.querySelector("#id_participantes").textContent = item.idPart;
            clone.querySelector("#nombre_participantes").textContent = item.nombre;
            //clone.querySelector("#rol__participantes").textContent = item.rol;
            clone.querySelector("#estado_participantes").textContent = "Aceptado";
            grid.appendChild(clone);
        });

    } catch (err) {
        console.error("Error cargando participantes:", err);
    }
}


async function renderSeccionConvocatoria() {
    if (!convocatoriaSeleccionada) return;

    const gridPostulantes = document.getElementById("postulante-grid");
    const selectSeccion = document.getElementById("verSeccion");
    const opcion = selectSeccion.value;

    // limpiar grid
    gridPostulantes.innerHTML = "";

    console.log("Renderizando sección:", opcion);

    if (opcion === "perfiles interesados") {
        await getPostulantes_convocatoria(convocatoriaSeleccionada.titulo);
    } else {
        await getParticipantes_convocatoria(convocatoriaSeleccionada.id);
    }
}

async function aceptarPostulante(buttonElement) {
    // se usa .closest() para encontrar el ancestro más cercano con la clase 'bg-white' (la tarjeta)
    const cardContainer = buttonElement.closest('.bg-white');
    const idPostElement = cardContainer.querySelector("#id_postulante");
    const idPost = idPostElement ? idPostElement.textContent.trim() : null;
    const toastedCoreccto = document.querySelector("#correct_toasted");
    const toastedInCoreccto = document.querySelector("#inCorrect_toasted");
    let message = ""
    const nuevoEstado = "aceptado"
    if (idPost) {
        console.log(`ID del Postulante Aceptado: ${idPost}`); // Esto debería ser 9

        try {
            /*DESCOMENTAR CUANDO SE CONECTE CON EL BACKEND y borrar lo indicado
            const resultPostParticipante = await axios.post(`${URL_convocatorias}/participantes`)
            const resultPutPostulante = await axios.put(
            `${URL_postulantes}/${idPost}/estado`,
            { estado: nuevoEstado }   // <-- Aquí va el body
        );

            if (resultPostParticipante.ok & resultPutPostulante.ok) {
                message= `Usuario ${idPost} aceptado con exito`
                cardContainer.classList.add("hidden")
                toastedCoreccto.querySelector("#id_usuario").textContent = message
                toastedCoreccto.classList.remove("hidden")
                setTimeout(() => {
                    toastedCoreccto.classList.add("hidden")
                    // lo que quieres ejecutar
                }, 5000);
            }*/
            //-------------------------------------BORRAR CUANDO SE CONECTE CON EL BACKEND--------------------
            message = `Usuario ${idPost} aceptado con exito`
            cardContainer.classList.add("hidden")
            toastedCoreccto.querySelector("#toasted_message_content").textContent = message
            toastedCoreccto.classList.remove("hidden")
            setTimeout(() => {
                toastedCoreccto.classList.add("hidden")
            }, 5000);
            //--------------------------------------------------------------------------------------------------
        } catch (error) {
            console.error(error)
            message = `Hubo un error aceptando al usuario ${idPost}`
            toastedInCoreccto.querySelector("#id_usuario").textContent = message
            toastedInCoreccto.classList.remove("hidden")
            setTimeout(() => {
                toastedInCoreccto.classList.add("hidden")
                // lo que quieres ejecutar
            }, 5000);
        }

    } else {
        console.error("No se pudo encontrar el ID del postulante.");
    }
}

/*
    Hay un problema con esta función(rechazarPostulante) y es que en el backend de los postulantes no existe ninguna funcion para traer los postulantes
    de una convocatoria en especifico. Así que creé un endpoint sugerido por chapeto para esta función para cuando se creé. La idea es eliminar el postulante de la tabla
    El puerto es el que esta actualmente (23/11/2025 4:07 pm) en la rama de juan david 
    |
    V
    http://localhost:3308/proyecto_redes_capasback/postulante/:idPostulante
   
    */
async function rechazarPostulante(buttonElement) {
    // se usa .closest() para encontrar el ancestro más cercano con la clase 'bg-white' (la tarjeta)
    const cardContainer = buttonElement.closest('.bg-white');
    const idPostElement = cardContainer.querySelector("#id_postulante");
    const idPost = idPostElement ? idPostElement.textContent.trim() : null;
    const toastedCoreccto = document.querySelector("#correct_toasted");
    const toastedInCoreccto = document.querySelector("#inCorrect_toasted");

    if (idPost) {
        console.log(`ID del Postulante Rechazado: ${idPost}`);
        /*DESCOMENTAR CUANDO SE CONECTE CON EL BACKEND Y BORRAR LO INDICADO
        try {
            const resultRemovePostulacion = axios.remove(`${URL_postulantes}/${idPost}`)
            if (resultRemovePostulacion.ok) {
                toastedCoreccto.querySelector("#toasted_message_content").textContent = message
                toastedCoreccto.classList.remove("hidden")
                setTimeout(() => {
                toastedCoreccto.classList.add("hidden")
                }, 5000);
            }
        } catch (error) {
            console.error(error)
            message= `Hubo un error rechazando al usuario ${idPost}`
            toastedInCoreccto.querySelector("#toasted_message_content").textContent = message
        }*/
        //------------------------------------ BORRAR CUANDO SE CONECTE CON EL BACKEND ------------------------
        message = `Usuario ${idPost} RECHAZADO con exito`
        cardContainer.classList.add("hidden")
        toastedCoreccto.querySelector("#toasted_message_content").textContent = message
        toastedCoreccto.classList.remove("hidden")
        setTimeout(() => {
            toastedCoreccto.classList.add("hidden")
        }, 5000);
        //----------------------------------------------------------------------------------------------
    }
}