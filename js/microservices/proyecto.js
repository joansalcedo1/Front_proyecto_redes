let proyectosData = [];

// Inicialización general
async function initMisProyectosPage() {
    const grid = document.getElementById("proyectos-grid");
    if (!grid) return;

    await cargarProyectos();
    configurarBuscadorProyectos();
    configurarModalProyectos();
}


// ========== CARGAR JSON SIMULADO =============
async function cargarProyectos() {
    const URL_DATOSIMULADOS = "./dataSimulada/proyectos.json";

    try {
        //const res = await http("GET",URL_proyectos);
        const res = await http("GET", URL_DATOSIMULADOS);
        if (!res.ok) throw new Error("Error al cargar proyectos");

        proyectosData = await res.json();
        console.log(proyectosData)
        renderProyectos(proyectosData);

    } catch (e) {
        console.error(e);
    }
}


//=================== mostrar proyectos en las convocatorias (select)==================

document.getElementById("open-modal-btn").addEventListener("click", async () => {
    await cargarProyectos()
    console.log("detecte que se abrio el modal")
    const select = document.getElementById("titulo_proyecto_input");
    const fecha = document.getElementById("fecha_fin_input");

    // limpiar opciones existentes
    select.innerHTML = "";
    console.log(proyectosData)
    proyectosData.forEach(proyecto => {
        const option = document.createElement("option");
        option.value = proyecto.titulo;
        option.textContent = proyecto.titulo;
        select.appendChild(option);
        fecha.textContent = proyecto.fechaFin
    });


    // Cuando el usuario elige un proyecto, autocompleta la fecha fin
    select.addEventListener("change", (e) => {
        const tituloSeleccionado = e.target.value;

        // buscar el proyecto por título
        const proyecto = proyectosData.find(p => p.titulo === tituloSeleccionado);

        if (proyecto) {
            const inputFechaFin = document.getElementById("fecha_fin_input");

            // cargar la fecha fin del proyecto
            inputFechaFin.value = proyecto.fechaFin;

            console.log("Fecha fin asignada automáticamente:", proyecto.fechaFin);
        }
    });

})



// ========== RENDER DE TARJETAS ==========
function renderProyectos(lista) {
    const grid = document.getElementById("proyectos-grid");
    const template = document.getElementById("proyecto-template");
    let colorBadge = "";

    grid.innerHTML = "";

    lista.forEach(p => {
        const clone = template.content.cloneNode(true);

        clone.querySelector("#titulo-proyecto").textContent = p.titulo;
        clone.querySelector("#organizador-proyecto").textContent = p.nombreOrganizador;
        clone.querySelector("#descripcion-proyecto").textContent = p.descripcion;

        clone.querySelector("#fecha-inicio-proyecto").textContent = p.fechaInicio;
        clone.querySelector("#fecha-fin-proyecto").textContent = p.fechaFin;

        // enlace
        clone.querySelector("#link-proyecto").href = p.url || "#";

        // badge
        const badge = clone.querySelector("#estado-proyecto");
        badge.textContent = p.estado;
        p.estado === "activo" ? colorBadge = "bg-green-300" : colorBadge = "bg-sky-400"
        badge.className = `text-xs  font-semibold px-3 ${colorBadge} py-1 rounded-full`;

        grid.appendChild(clone);
    });
}


// ========== BUSCADOR ==========
function configurarBuscadorProyectos() {
    const input = document.getElementById("buscar-proyecto");
    if (!input) return;

    input.addEventListener("input", e => {
        const term = e.target.value.toLowerCase();

        const filtrados = proyectosData.filter(p =>
            p.titulo.toLowerCase().includes(term) ||
            p.nombreOrganizador.toLowerCase().includes(term)
        );

        renderProyectos(filtrados);
    });
}


// ========== MODAL (Agregar Proyecto) ==========
function configurarModalProyectos() {
    const modal = document.getElementById("modal-proyecto");
    const btnAbrir = document.getElementById("btn-abrir-modal");
    const btnCerrar = document.getElementById("btn-cerrar-modal");
    const form = document.getElementById("form-proyecto");
    let nombreUsuario = sessionStorage.getItem("user_name")
    console.log(nombreUsuario)
    document.getElementById("nombreOrganizador").value = nombreUsuario ;

   

    if (!modal || !btnAbrir || !btnCerrar || !form) return;

    const abrir = () => modal.classList.remove("hidden");
    const cerrar = () => modal.classList.add("hidden");

    btnAbrir.addEventListener("click", abrir);
    btnCerrar.addEventListener("click", cerrar);

    modal.addEventListener("click", e => {
        if (e.target === modal) cerrar();
    });

    form.addEventListener("submit", e => {
        e.preventDefault();

        const data = new FormData(form);

        // ====== Tomamos los checkbox ======
        const lucesDep = document.getElementById("lucesDep_check")?.checked ? 1 : 0;
        const arteDep = document.getElementById("arteDep_check")?.checked ? 1 : 0;
        const camaraDep = document.getElementById("camaraDep_check")?.checked ? 1 : 0;
        const postProdDep = document.getElementById("postProdDep_check")?.checked ? 1 : 0;
        const direccionDep = document.getElementById("direccionDep_check")?.checked ? 1 : 0;
        const prodDep = document.getElementById("prodDep_check")?.checked ? 1 : 0;

        const nuevo = {
            idProyecto: Date.now(),
            titulo: data.get("titulo"),
            descripcion: data.get("descripcion"),
            nombreOrganizador: data.get("nombreOrganizador"),
            estado: data.get("estado"),
            fechaInicio: data.get("fechaInicio"),
            fechaFin: data.get("fechaFin"),
            url: data.get("url") || "#",

            // ====== Aquí los nuevos valores ======
            lucesDep,
            arteDep,
            camaraDep,
            postProdDep,
            direccionDep,
            prodDep,
        };

        proyectosData.push(nuevo);
        renderProyectos(proyectosData);

        form.reset();
        cerrar();
    });
}
