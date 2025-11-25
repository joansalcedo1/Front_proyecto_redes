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
        const res = await http("GET",URL_DATOSIMULADOS);
        if (!res.ok) throw new Error("Error al cargar proyectos");

        proyectosData = await res.json();
        renderProyectos(proyectosData);

    } catch (e) {
        console.error(e);
    }
}


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
        p.estado=== "activo" ? colorBadge = "bg-green-300" :colorBadge="bg-sky-400" 
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

        const nuevo = {
            idProyecto: Date.now(),
            titulo: data.get("titulo"),
            descripcion: data.get("descripcion"),
            nombreOrganizador: data.get("nombreOrganizador"),
            estado: data.get("estado"),
            fechaInicio: data.get("fechaInicio"),
            fechaFin: data.get("fechaFin"),
            url: data.get("url") || "#",
            lucesDep: data.get("lucesDep") === "on",
            arteDep: data.get("arteDep") === "on",
            camaraDep: data.get("camaraDep") === "on",
            prodDep: data.get("prodDep") === "on",
            postProdDep: data.get("postProdDep") === "on",
            direccionDep: data.get("direccionDep") === "on",
        };

        proyectosData.push(nuevo);
        renderProyectos(proyectosData);

        form.reset();
        cerrar();
    });
}

// =============================
// CARGAR OPORTUNIDADES PARA TI
// =============================
async function cargarOportunidades() {
    try {
        const res = await fetch("./dataSimulada/proyectos.json");
        if (!res.ok) throw new Error("No se pudo cargar proyectos");

        const proyectos = await res.json();

        // Filtrar solo los proyectos activos
        const activos = proyectos.filter(p => p.estado === "activo");

        renderOportunidades(activos);

    } catch (err) {
        console.error("ERROR:", err);
    }
}


// =============================
// RENDERIZAR TARJETAS
// =============================
function renderOportunidades(lista) {
    const grid = document.getElementById("oportunidades-grid");
    const template = document.getElementById("oportunidad-template");

    if (!grid || !template) return;

    grid.innerHTML = "";

    lista.forEach(p => {
        const clone = template.content.cloneNode(true);

        clone.getElementById("titulo_op").textContent = p.titulo;
        clone.getElementById("proyecto_op").textContent = p.organizador;
        clone.getElementById("descripcion_op").textContent = p.descripcion;
        clone.getElementById("area_op").textContent = detectarArea(p);
        clone.getElementById("fecha_op").textContent = p.fechaFin;

        clone.getElementById("btn_postular").onclick = () => {
            alert(`Te has postulado al proyecto: ${p.titulo}`);
        };

        grid.appendChild(clone);
    });
}


// =============================
// DETERMINAR ÁREA REQUERIDA
// =============================
function detectarArea(p) {
    if (p.camaraDep) return "Cámara";
    if (p.direccionDep) return "Dirección";
    if (p.arteDep) return "Arte";
    if (p.lucesDep) return "Luces";
    if (p.postProdDep) return "Postproducción";
    return "General";
}

