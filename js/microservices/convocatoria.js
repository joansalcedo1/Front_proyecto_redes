let idConvocatoriaSeleccionada = ""
let convocatorias = []

// ================================================================ MODAL ====================================
const modalContainer = document.getElementById('modal-container');
const openBtn = document.getElementById('open-modal-btn');
const closeBtn = document.getElementById('close-modal-btn');
const overlay = document.getElementById('modal-overlay');


//=============  TRAE TODAS LAS CONVOCATORIAS HECHAS POR UN USUARIO ============= 
async function cargarDatos(id_usuarioOrganizador) {
    //se llama en el script final de misConvocatorias.html

    /*
        Hay un problema con esta función y es que en el backend de las convocatorias no existe ninguna funcion para traer las convocatorias 
        de un usuario en especifico. Así que creé un endpoint sugerido por chapeto para esta función se creé.
        El puerto es el que esta actualmente (23/11/2025 4:07 pm) en la rama de juan david 
        |
        V

        http://localhost:3308/apiRedes/convocatoria/:id_usuarioOrganizador
     */

    const URL_DATOSIMULADOS = "./dataSimulada/convocatoria.json"
    try {
        //DESCOMENTAR CUANDO SE CONECTE CON EL BACKEND 
        //const res = await http("GET",`${URL_convocatorias}/${id_usuarioOrganizador}`) //=> consulta convocatorias, sacado de la documentacion de convocatorias
        const res = await http("GET", URL_DATOSIMULADOS)
        if (!res.ok) {
            throw new Error(`Error al cargar los datos: ${res.statusText}`);
        }

        convocatorias = await res.json();
        renderConvocatorias(convocatorias)
    } catch (error) {
        console.error(error)
    }
}


//=============  Renderiza todas las convocatorias ============= 
function renderConvocatorias(convocatorias) {


    const template = document.getElementById("convocatoria-template")
    const grid = document.getElementById("convocatorias-grid")


    convocatorias.forEach(item => {
        const clone = template.content.cloneNode(true)
        clone.querySelector("#id_convocatoria").textContent = item.idConvocatoria
        clone.querySelector("#nombre_convocatoria").textContent = item.tituloCon
        clone.querySelector("#titulo_proyecto").textContent = item.tituloProyecto
        clone.querySelector("#descripcion_convocatoria").textContent = item.descripcion
        clone.querySelector("#area_requerida_convocatoria").textContent = item.areaRequerida
        clone.querySelector("#fechaMax_convocatoria").textContent = item.fecha_cierre
        console.log("nombres convocatoria", item.tituloCon)
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



}


//========== función para crear una convocatoria =============
async function postConvocatoria(e) {
    const form = document.querySelector("#modal-container form");
    const URL_DATOSIMULADOS = "./dataSimulada/convocatoriaCreada.json"


    // Validación HTML5 manual
    if (!form.checkValidity()) {
        form.reportValidity(); // muestra mensajes nativos
        return; // corta el proceso
    }

    console.log("Formulario válido. Ejecutando lógica...");

    // Aquí tomas los valores
    const tituloConvocatoria = document.getElementById("titulo_convocatoria").value
    const descripcionConvocatoria = document.getElementById("descripcion_convocatoria_input").value
    const nombreProyecto = document.getElementById("titulo_proyecto_input").value
    const areaRequerida = document.getElementById("area_requerida_input").value
    const cantidadConvocatoria = document.getElementById("cantidad_convocatoria_input").value
    const fechaFin = document.getElementById("fecha_fin_input").value
    const payload = {
        tituloCon: tituloConvocatoria,
        descripcion: descripcionConvocatoria,
        areaRequerida: areaRequerida,
        estado: "abierta",
        fecha_cierre: fechaFin,
        numPersSolicitad: cantidadConvocatoria,
        tituloProyecto: nombreProyecto
    }
    try {
        /* DESCOMENTAR CUANDO SE CONECTE AL BACKEND Y BORRAR LO INDICADO
        const resultPost = await http("POST", URL_convocatorias,payload)
        if (resultPost.ok) {
            const idNuevaConv = resultPost.idConvocatoria
            message= `Convocatoria ${tituloConvocatoria} con id ${idNuevaConv} creada con exito`
            gestorToastedCorrecto(message)
            convocatorias.push(payload)
            renderConvocatorias(convocatorias)
        }*/
        //------------------------------------------------BORRAR------------------------
        const result = await http("GET", URL_DATOSIMULADOS)
        const data = await result.json();
        convocatorias.push(payload)
        renderConvocatorias(convocatorias)
        //------------------------------------------------------------------------------
        if (data) {
            const idNuevaConv = data.idConvocatoria

            message = `Convocatoria "${tituloConvocatoria}" con id ${idNuevaConv} creada con exito`
            gestorToastedCorrecto(message)
        }

    } catch (error) {
        console.error(error)
        message = "Hubo un error creando la convocatoria. Intentalo de nuevo"
        gestorToastedINCorrecto(message)
    }
    closeModal();
}


// ========== trae los participantes de la convocatoria =============
async function getParticipantes_convocatoria(idConvocatoria) {

    //se llama en utilites 
    const URL_DATOSIMULADOS = "./dataSimulada/participantesDeConvocatoria.json";
    const template = document.getElementById("card_participantes_template");
    const grid = document.getElementById("postulante-grid");
    idConvocatoriaSeleccionada = idConvocatoria
    try {
        /* CAMBIAR CUANDO SE CONECTE CON EL BACKEND */
        // CAMBIAR EL ENDPOINT CUANDO SE CREE NO ES PARTICIPANTES 
        //const res = await http("GET",`${URL_convocatorias}/participantes/${idConvocatoria}`)
        const res = await http("GET",URL_DATOSIMULADOS)
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


//=============  trae los postulantes de la convocatoria =============
async function getPostulantes_convocatoria(tituloConvocatoria) {

    //se llama en utilites 

    /*
    Hay un problema con esta función y es que en el backend de los postulantes no existe ninguna funcion para traer los postulantes
    de una convocatoria en especifico. Así que creé un endpoint sugerido por chapeto para cuando se cree esta función.
    El puerto es el que esta actualmente (23/11/2025 4:07 pm) en la rama de juan david
    |
    V
    http://localhost:3308/proyecto_redes_capasback/postulante/:nombre_convocatoria
    */

    const URL_DATOSIMULADOS = "./dataSimulada/postulantesDeConvocatoria.json"
    const template = document.getElementById("card_postulantes_template")
    const grid = document.getElementById("postulante-grid")

    try {
        /* CAMBIAR CUANDO SE CONECTE CON EL BACKEND */
        //const res = await http("GET",`${URL_postulantes}/${tituloConvocatoria}`)
        const res = await http("GET",URL_DATOSIMULADOS)

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



//============= aceptar los postulantes y convertirlos en participantes =============
async function aceptarPostulante(buttonElement) {
    //se llama en misConvocatorias.html
    // se usa .closest() para encontrar el ancestro más cercano con la clase 'bg-white' (la tarjeta)
    const cardContainer = buttonElement.closest('.bg-white');
    const idPostElement = cardContainer.querySelector("#id_postulante");
    const idPost = idPostElement ? idPostElement.textContent.trim() : null;
    const nombrePostulante = cardContainer.querySelector("#nombre_postulante")
    const payload = {
        nombre: nombrePostulante,
        idConvocatoria: idConvocatoriaSeleccionada
    }

    let message = ""
    const nuevoEstado = "aceptado"
    if (idPost) {
        console.log(`ID del Postulante Aceptado: ${idPost}`); // Esto debería ser 9

        try {
            /*DESCOMENTAR CUANDO SE CONECTE CON EL BACKEND y BORRAR LO INDICADO


            const resultPostParticipantes = await http("POST",`${URL_convocatorias}/participantes`,payload)
            const resultPutPostulante = await http("PUT",`${URL_postulantes}/${idPost}/estado`,{ estado: nuevoEstado })
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
            gestorToastedCorrecto(message)
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



//============= rechazar los postulantes y borrarlos del microservicio =============
async function rechazarPostulante(buttonElement) {
    //se llama en misConvocatorias.html
    /*
    Hay un problema con esta función(rechazarPostulante) y es que en el backend de los postulantes no existe ninguna funcion para eliminar el postulante de una convocatoria. 
    Así que pongo un endpoint sugerido por chapeto para esta función para cuando se creé. La idea es eliminar el postulante de la tabla postulante, pues fue rechazado
    El puerto es el que esta actualmente (23/11/2025 4:07 pm) en la rama de juan david 
    |
    V
    http://localhost:3308/proyecto_redes_capasback/postulante/:idPostulante
   
    */
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
            const resultRemovePostulacion = await http("DELETE",`${URL_postulantes}/${idPost}`)
            if (resultRemovePostulacion.ok) {
                gestorToastedCorrecto(message)
            }
        } catch (error) {
            console.error(error)
            message= `Hubo un error rechazando al usuario ${idPost}`
            gestorToastedINCorrecto(message)
        }*/
        //------------------------------------ BORRAR CUANDO SE CONECTE CON EL BACKEND ------------------------
        message = `Usuario ${idPost} RECHAZADO con exito`
        cardContainer.classList.add("hidden")
        gestorToastedCorrecto(message)
        //----------------------------------------------------------------------------------------------
    }
}


//=============  renderizar postulantes/ofertatantes/participantes de convocatoria ============= 
function renderSeccionConvocatoria() {
    //funcion clave para mostrar los participantes o los postulantes
    if (!convocatoriaSeleccionada) return;

    const gridPostulantes = document.getElementById("postulante-grid");
    const elementoSelectSeccion = document.getElementById("verSeccion");
    elementoSelectSeccion.onchange = async (e) => {
        e.preventDefault()
        gridPostulantes.innerHTML = "";
        const opcion = elementoSelectSeccion.value;
        console.log("Renderizando sección:", opcion);
        switch (opcion) {
            case "ofertantes":
                await getOfertantePorArea(convocatoriaSeleccionada.areaRequerida)
                break;
            case "perfiles interesados":
                await getPostulantes_convocatoria(convocatoriaSeleccionada.titulo);
                break;
            case "participantes":
                await getParticipantes_convocatoria(convocatoriaSeleccionada.id);
                break;

            default:

                break;
        }
    }
}


// ============= Función para Abrir el Modal =============
function openModal() {
    modalContainer.classList.remove('hidden');
    console.log("abriendo modal")
}


// =============  Función para Cerrar el Modal ============= 
function closeModal() {
    modalContainer.classList.add('hidden');
}
