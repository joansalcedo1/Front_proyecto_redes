let message=""

/* ==========================================================
   PERFILES OFERTANTES DISPONIBLES — DINÁMICO 
   para index.html
=========================================================== */

async function cargarPerfilesDisponibles() {
    const URL_DATOSIMULADOS = "./dataSimulada/ofertantesGeneral.json";
    const template = document.getElementById("perfil-template");
    const container = document.getElementById("perfiles-container");

    try {
        const res = await fetch(URL_DATOSIMULADOS);
        if (!res.ok) throw new Error("Error al cargar perfiles");

        const ofertantes = await res.json();
        container.innerHTML = "";

        ofertantes.forEach(item => {
            const clone = template.content.cloneNode(true);

            clone.querySelector("#nombre_ofertante").textContent = item.nombre_usuario;
            clone.querySelector("#rol_ofertante").textContent = item.area;
            clone.querySelector("#estado_ofertante").textContent= item.estado_of
            clone.querySelector("#fecha_inicio_ofertante").textContent =item.fecha_inicio.substring(0, 10);
            clone.querySelector("#fecha_fin_ofertante").textContent = item.fecha_fin.substring(0, 10);

            container.appendChild(clone);
        });

    } catch (error) {
        console.error(error);
    }
}


//============= obtener todas las ofertas por area =============
async function getOfertantePorArea(areaRequerida) {
    /*
       Hay un problema con esta función y es que en el backend de los ofertantes no existe ninguna funcion para traer las ofertantes 
       por area en especifico. Así que creé un endpoint sugerido por chapeto para cuando esta función se cree.
       El puerto es el que esta actualmente (23/11/2025 4:07 pm) en la rama de juan david 
       |
       V
       http://localhost:3308/apiRedes/ofertante/:areaRequerida
    */
   const template = document.getElementById("card_ofertantes_template");
    const grid = document.getElementById("postulante-grid");
    const URL_DATOSIMULADOS = "/dataSimulada/ofertantesXArea.json"
    /*const idOfertante = document.getElementById("id_ofertantes")
    const nombreOfertante = document.getElementById("nombre_ofertantes")
    const areaOfertante = document.getElementById("rol_ofertantes")
    const fechaInicio = document.getElementById("fechaInicio_ofertantes")
    const fechaFin = document.getElementById("fechaFin_ofertantes")
    const estado = document.getElementById("estado_ofertantes")*/

    try {
        //cambiar cuando se conecte al backend
        //const result = await http("GET",`${URL_ofertantes}/${areaRequerida}`)
        
         const result = await http("GET",URL_DATOSIMULADOS)
        const ofertantes = await result.json()
        
        ofertantes.forEach(item => {
            const clone = template.content.cloneNode(true);
            clone.querySelector("#fechaInicio_ofertantes").textContent = item.fecha_inicio;
            clone.querySelector("#id_ofertantes").textContent = item.id_oferta
            clone.querySelector("#fechaFin_ofertantes").textContent = item.fecha_fin;
            clone.querySelector("#nombre_ofertantes").textContent = item.nombre_usuario;
            clone.querySelector("#rol_ofertantes").textContent = item.area;
            clone.querySelector("#estado_ofertantes").textContent = item.estado_of;
            grid.appendChild(clone);
        });
    } catch (error) {
        console.error(error)
        message="Error consultando los ofertantes"
        gestorToastedINCorrecto()
    }
}

//============= invitar a un ofertante y convertirlos en participante =============
async function invitarOfertante(buttonElement) {

    // se usa .closest() para encontrar el ancestro más cercano con la clase 'bg-white' (la tarjeta)
    const cardContainer = buttonElement.closest('.bg-white');
    const idPostElement = cardContainer.querySelector("#id_ofertantes");
    const idPost = idPostElement ? idPostElement.textContent.trim() : null;

    let message = ""
    const nuevoEstado = "aceptado"
    if (idPost) {
        console.log(`ID del Postulante Aceptado: ${idPost}`); // Esto debería ser 9

        try {
            /*DESCOMENTAR CUANDO SE CONECTE CON EL BACKEND y borrar lo indicado
            const resultPost = await http("POST", URL_convocatorias,payload)
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

//============= ignorar a un ofertante y BORRARLO DE LA TABLA =============
async function ignorarOfertante(buttonElement) {

    // se usa .closest() para encontrar el ancestro más cercano con la clase 'bg-white' (la tarjeta)
    const cardContainer = buttonElement.closest('.bg-white');
    const idOFElement = cardContainer.querySelector("#id_ofertantes");
    const idOf = idOFElement ? idOFElement.textContent.trim() : null;

    let message = ""
    if (idOf) {
        console.log(`ID del ofertante ignorado: ${idOf}`); // Esto debería ser 9

        try {
            /*DESCOMENTAR CUANDO SE CONECTE CON EL BACKEND y borrar lo indicado
            const resultPostOfertante = await http("DELETE", `${URL_ofertantes}/${idOf}`)
            if (resultPostOfertante.ok) {
                message= `Usuario ${idOf} IGNORADO con exito`
                cardContainer.classList.add("hidden")
                gestorToastedCorrecto(message)
            }*/
            //-------------------------------------BORRAR CUANDO SE CONECTE CON EL BACKEND--------------------
            message = `Usuario ${idOf} IGNORADO con exito`
            cardContainer.classList.add("hidden")
            gestorToastedCorrecto(message)
            //--------------------------------------------------------------------------------------------------
        } catch (error) {
            console.error(error)
            message = `Hubo un error aceptando al usuario ${idOf}`
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


