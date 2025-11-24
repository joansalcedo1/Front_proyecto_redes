/* ==========================================================
   CONFIGURACIONES INICIALES
=========================================================== */

const URL_BASE = "http://localhost:"
const puertoConvocatoria = 3308
const puertoPostulante = 3308

// ===================== LOGIN ======================
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password')
    const imgIcon = document.getElementById('iconPassword')
    const type = passwordInput.type === 'password' ? 'text' : 'password';

    const icon = passwordInput.type === 'password'
        ? 'https://cdn-icons-png.flaticon.com/512/9759/9759281.png'
        : 'https://cdn-icons-png.flaticon.com/512/6684/6684701.png'

    passwordInput.type = type;
    imgIcon.src = icon;
}


/* ==========================================================
   CONVOCATORIAS — CARGA DINÁMICA (TU CÓDIGO)
=========================================================== */

async function getAllconvocatorias() {
    const URL_DATOSIMULADOS = "./dataSimulada/convocatoria.json"
    const template = document.getElementById("convocatoria-template")
    const grid = document.getElementById("convocatorias-grid")

    try {
        const res = await fetch(URL_DATOSIMULADOS)
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);

        const convocatorias = await res.json();

        convocatorias.forEach(item => {
            const clone = template.content.cloneNode(true)

            clone.querySelector("#id_convocatoria").textContent = item.idConvocatoria
            clone.querySelector("#nombre_convocatoria").textContent = item.tituloCon
            clone.querySelector("#titulo_proyecto").textContent = item.tituloProyecto
            clone.querySelector("#descripcion_convocatoria").textContent = item.descripcion
            clone.querySelector("#area_requerida_convocatoria").textContent = item.areaRequerida
            clone.querySelector("#fechaMax_convocatoria").textContent = item.fecha_cierre
            clone.querySelector("#btn_convocatoria").onclick =
                () => getPostulantes_convocatoria(item.idConvocatoria);

            grid.appendChild(clone)
        })

    } catch (error) {
        console.error(error)
    }
}





/* ==========================================================
   POSTULANTES POR CONVOCATORIA
=========================================================== */

async function getPostulantes_convocatoria(idConvocatoria) {
    const URL_DATOSIMULADOS = "./dataSimulada/postulantesDeConvocatoria.json"
    const template = document.getElementById("card_postulantes_template")
    const grid = document.getElementById("postulante-grid")

    try {
        const res = await fetch(URL_DATOSIMULADOS)
        if (!res.ok) throw new Error("Error al cargar postulantes");

        const data = await res.json();
        grid.innerHTML = "";

        data.forEach(item => {
            const clone = template.content.cloneNode(true)

            clone.querySelector("#nombre_postulante").textContent = item.usuarioPos
            clone.querySelector("#rol_postulante").textContent = item.rolPos
            clone.querySelector("#estado_postulante").textContent = item.estadoPost

            grid.appendChild(clone)
        })

    } catch (error) {
        console.error(error)
    }
}


/* ==========================================================
   MIS PROYECTOS — NUEVA SECCIÓN
=========================================================== */

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
    const URL = "./dataSimulada/proyectos.json";

    try {
        const res = await fetch(URL);
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

        badge.className = "text-xs font-semibold px-3 py-1 rounded-full";

        if (p.estado === "En curso") {
            badge.classList.add("bg-[#D8E8FF]", "text-[#3A7DFF]");
        } else if (p.estado === "Finalizado") {
            badge.classList.add("bg-[#D7F5E5]", "text-[#2F9E67]");
        } else {
            badge.classList.add("bg-gray-200", "text-gray-600");
        }

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
