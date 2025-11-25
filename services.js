/* ==========================================================
   OPORTUNIDADES PARA TI – USANDO TEMPLATE UNIVERSAL
========================================================== */

let oportunidadesData = [];

// Cargar JSON (convocatorias)
async function cargarOportunidades() {
    const URL = "./dataSimulada/convocatoria.json";
    const container = document.getElementById("oportunidades-grid");

    if (!container) return;

    try {
        const res = await fetch(URL);
        oportunidadesData = await res.json();
        renderOportunidades(oportunidadesData);

        // ⚡ NUEVO: cargar también las oportunidades desde proyectos.json
        cargarOportunidadesProyectos();

    } catch (err) {
        console.error("Error cargando oportunidades:", err);
    }
}

// Render de convocatorias (template card-template EXISTENTE)
function renderOportunidades(lista) {
    const container = document.getElementById("oportunidades-grid");
    const template = document.getElementById("card-template");

    container.innerHTML = "";

    lista.forEach(op => {
        const card = template.content.cloneNode(true);

        card.querySelector("#card-img").classList.add("hidden");

        card.querySelector("#card-title").textContent = op.tituloCon;
        card.querySelector("#card-subtitle").textContent = "Proyecto: " + op.tituloProyecto;
        card.querySelector("#card-description").textContent = op.descripcion;

        card.querySelector("#extra-container").innerHTML = `
            <b>Área requerida:</b> ${op.areaRequerida}<br>
            <b>Fecha límite:</b> ${op.fecha_cierre}
        `;

        const btn = card.querySelector("#card-button");
        btn.textContent = "Postularme";
        btn.classList.remove("hidden");

        container.appendChild(card);
    });
}

// Buscador
document.getElementById("buscar_oportunidad")?.addEventListener("input", e => {
    const text = e.target.value.toLowerCase();
    const filtrados = oportunidadesData.filter(op =>
        op.tituloCon.toLowerCase().includes(text) ||
        op.tituloProyecto.toLowerCase().includes(text)
    );
    renderOportunidades(filtrados);
});

// Filtro por área
document.getElementById("filtrar_area")?.addEventListener("change", e => {
    const area = e.target.value;

    if (area === "") return renderOportunidades(oportunidadesData);

    const filtrados = oportunidadesData.filter(op =>
        op.areaRequerida.toLowerCase() === area.toLowerCase()
    );

    renderOportunidades(filtrados);
});


/* ==========================================================
   ⚡⚡ NUEVA FUNCIONALIDAD
   OPORTUNIDADES ADICIONALES DESDE proyectos.json
   USANDO <template id="oportunidad-template">
========================================================== */

async function cargarOportunidadesProyectos() {
    const URL = "./dataSimulada/proyectos.json";
    const container = document.getElementById("oportunidades-grid");

    try {
        const res = await fetch(URL);
        const proyectos = await res.json();

        renderOportunidadesProyectos(proyectos);

    } catch (err) {
        console.error("Error cargando proyectos:", err);
    }
}

function renderOportunidadesProyectos(lista) {
    const container = document.getElementById("oportunidades-grid");
    const template = document.getElementById("oportunidad-template");

    lista.forEach(proy => {
        const card = template.content.cloneNode(true);

        card.querySelector("#titulo_op").textContent = proy.titulo;
        card.querySelector("#proyecto_op").textContent = proy.organizador;
        card.querySelector("#descripcion_op").textContent = proy.descripcion;

        // Detectar áreas según los "Dep"
        let area = "";
        if (proy.camaraDep) area = "cámara";
        else if (proy.direccionDep) area = "dirección";
        else if (proy.lucesDep) area = "luces";
        else if (proy.arteDep) area = "arte";
        else if (proy.postProdDep) area = "postproducción";

        card.querySelector("#area_op").textContent = area;
        card.querySelector("#fecha_op").textContent = proy.fechaFin;

        // botón
        card.querySelector("#btn_postular").addEventListener("click", () => {
            alert("Postulado al proyecto: " + proy.titulo);
        });

        // Agregar sin borrar lo previo
        container.appendChild(card);
    });
}


/* ==========================================================
   PERFILES DISPONIBLES – USANDO TEMPLATE UNIVERSAL
========================================================== */

async function cargarPerfilesDisponibles() {
    const URL = "./dataSimulada/participantesDeConvocatoria.json";
    const container = document.getElementById("perfiles-container");

    try {
        const res = await fetch(URL);
        const data = await res.json();
        renderPerfiles(data);
    } catch (err) {
        console.error("Error cargando perfiles:", err);
    }
}

function renderPerfiles(lista) {
    const container = document.getElementById("perfiles-container");
    const template = document.getElementById("card-template");

    container.innerHTML = "";

    lista.forEach(p => {
        const card = template.content.cloneNode(true);

        const img = card.querySelector("#card-img");
        img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgGVslZPcLCSkPtpM5-XBaZ6-y8yTGdXd-Fg&s";
        img.classList.remove("hidden");

        card.querySelector("#card-title").textContent = p.nombre_usuario;
        card.querySelector("#card-subtitle").textContent = p.area;
        card.querySelector("#card-description").textContent = "";

        card.querySelector("#extra-container").innerHTML = `
            <b>Disponibilidad:</b> ${p.estado_of}<br>
            <b>Desde:</b> ${p.fecha_inicio} — <b>Hasta:</b> ${p.fecha_fin}
        `;

        container.appendChild(card);
    });
}
