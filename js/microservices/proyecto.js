let proyectosData = [];
// Definimos la URL base del microservicio de proyectos
const URL_PROYECTOS_MS = "http://localhost:3312/apiRedes/proyecto";

// Inicialización general
async function initMisProyectosPage() {
    const grid = document.getElementById("proyectos-grid");
    if (!grid) return;

    await cargarProyectos();
    configurarBuscadorProyectos();
    configurarModalProyectos();      // Modal 1
    configurarModalConvocatoria();   // Modal 2 (Nuevo)
}


// ========== CARGAR JSON (API) =============
async function cargarProyectos() {
    try {
        // Usamos userId global (asumiendo que utilities.js lo define)
        const res = await http("GET", `${URL_usuarios}/${userId}/proyectos`);

        if (!res.ok) throw new Error("Error al cargar proyectos");

        proyectosData = await res.json();
        console.log("Proyectos cargados:", proyectosData);
        renderProyectos(proyectosData);

    } catch (e) {
        console.error(e);
        gestorToastedINCorrecto("No se pudieron cargar los proyectos");
    }
}

// ========== RENDER DE TARJETAS ==========
function renderProyectos(lista) {
    const grid = document.getElementById("proyectos-grid");
    const template = document.getElementById("proyecto-template");
    let colorBadge = "";

    grid.innerHTML = "";

    if (lista.length === 0) {
        grid.innerHTML = "<p class='text-gray-500 text-center col-span-2'>No tienes proyectos creados aún.</p>";
        return;
    }

    lista.forEach(p => {
        const clone = template.content.cloneNode(true);

        clone.querySelector("#titulo-proyecto").textContent = p.titulo;
        clone.querySelector("#descripcion-proyecto").textContent = p.descripcion;
        clone.querySelector("#fecha-inicio-proyecto").textContent = p.fechaInicio;
        clone.querySelector("#fecha-fin-proyecto").textContent = p.fechaFin || p.fecha_cierre; // Ajuste para compatibilidad

        // enlace
        clone.querySelector("#link-proyecto").href = p.url || "#";

        // badge
        const badge = clone.querySelector("#estado-proyecto");
        badge.textContent = p.estado;
        p.estado === "activo" || p.estado === "En curso" ? colorBadge = "bg-green-100 text-green-800" : colorBadge = "bg-gray-200 text-gray-800";
        badge.className = `text-xs font-semibold px-3 py-1 rounded-full ${colorBadge}`;

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
            (p.organizador && p.organizador.toLowerCase().includes(term))
        );
        renderProyectos(filtrados);
    });
}


// ==========================================
// 1. MODAL AGREGAR PROYECTO
// ==========================================
function configurarModalProyectos() {
    const modal = document.getElementById("modal-proyecto");
    const btnAbrir = document.getElementById("btn-abrir-modal");
    const btnCerrar = document.getElementById("btn-cerrar-modal");
    const form = document.getElementById("form-proyecto");

    // Autocompletar nombre
    let nombreUsuario = sessionStorage.getItem("user_name");
    const inputOrg = document.getElementById("nombreOrganizador");
    if (inputOrg && nombreUsuario) inputOrg.value = nombreUsuario;

    if (!modal || !btnAbrir || !btnCerrar || !form) return;

    const abrir = () => modal.classList.remove("hidden");
    const cerrar = () => modal.classList.add("hidden");

    btnAbrir.addEventListener("click", abrir);
    btnCerrar.addEventListener("click", cerrar);
    modal.addEventListener("click", e => { if (e.target === modal) cerrar(); });

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const data = new FormData(form);

        // Helper para checkbox
        const isChecked = (id) => document.getElementById(id)?.checked ? 1 : 0;

        const nuevoProyectoPayload = {
            titulo: data.get("titulo"),
            descripcion: data.get("descripcion"),
            estado: data.get("estado"),
            fechaInicio: data.get("fechaInicio"),
            fechaFin: data.get("fechaFin"),
            url: data.get("url") || "#",
            lucesDep: isChecked("lucesDep_check"),
            arteDep: isChecked("arteDep_check"),
            camaraDep: isChecked("camaraDep_check"),
            postProdDep: isChecked("postProdDep_check"),
            direccionDep: isChecked("direccionDep_check"),
        };

        try {
            // Usamos userId global definido en utilities.js o sessionStorage
            const idU = sessionStorage.getItem("userId");
            const res = await http("POST", `${URL_usuarios}/${idU}/proyecto`, nuevoProyectoPayload);

            // CORRECCIÓN: Esperar al json y verificar res.ok
            const dataRes = await res.json();

            if (res.ok) {
                console.log("✅ Proyecto creado. ID:", dataRes.idProyecto);

                // 1. Renderizar 
                await cargarProyectos();

                // 2. Cerrar Modal 1
                form.reset();
                cerrar();
                gestorToastedCorrecto("Proyecto creado. Configurando convocatoria...");

                // 3. ABRIR EL SEGUNDO MODAL PASANDO LOS DATOS (CAMBIO AQUÍ)
                // Pasamos el ID y TAMBIÉN el objeto con los datos que acabamos de enviar (payload)
                abrirModalConvocatoria(dataRes.idProyecto, nuevoProyectoPayload);
            } else {
                console.error("Error:", dataRes);
                gestorToastedINCorrecto(dataRes.error || "Error al crear proyecto");
            }
        } catch (error) {
            console.error(error);
            gestorToastedINCorrecto("Error de conexión al crear proyecto");
        }
    });
}


// ==========================================
// 2. MODAL LANZAR CONVOCATORIA (Nuevo)
// ==========================================
function configurarModalConvocatoria() {
    const modal = document.getElementById("modal-convocatoria");
    const btnCerrar = document.getElementById("btn-cerrar-modal-conv");
    const btnOmitir = document.getElementById("btn-omitir-conv");
    const form = document.getElementById("form-convocatoria");

    if (!modal || !form) return;

    const cerrar = () => modal.classList.add("hidden");

    // Eventos cerrar
    if (btnCerrar) btnCerrar.addEventListener("click", cerrar);
    if (btnOmitir) btnOmitir.addEventListener("click", cerrar);

    // LOGICA SUBMIT CONVOCATORIA
    form.addEventListener("submit", async e => {
        e.preventDefault();

        const data = new FormData(form);
        const idProyecto = document.getElementById("idProyectoRelacionado").value;

        // Construir el objeto numPersSolicitad dinámicamente
        const numPersSolicitadMap = {};

        // Función helper para agregar solo si es > 0
        const addIfValid = (key, formKey) => {
            const val = parseInt(data.get(formKey));
            if (val > 0) numPersSolicitadMap[key] = val;
        };

        addIfValid("Luces", "cant_luces");
        addIfValid("Arte", "cant_arte");
        addIfValid("Cámara", "cant_camara");
        addIfValid("Dirección", "cant_direccion");
        addIfValid("Post-Producción", "cant_postprod");

        // Validación: Al menos 1 persona
        if (Object.keys(numPersSolicitadMap).length === 0) {
            gestorToastedINCorrecto("Solicita al menos 1 persona en algún área.");
            return;
        }

        const payload = {
            titulo: data.get("titulo"),
            numPersSolicitad: numPersSolicitadMap
        };

        try {
            // URL: http://localhost:3312/apiRedes/proyecto/:id/lanzar-convocatorias
            const url = `${URL_proyectos}/${idProyecto}/lanzar-convocatorias`;

            const res = await http("POST", url, payload);
            const dataRes = await res.json();

            if (res.ok || res.status === 202) {
                console.log("✅ Convocatorias lanzadas:", dataRes);
                gestorToastedCorrecto("¡Convocatorias lanzadas exitosamente!");
                form.reset();
                cerrar();
            } else {
                console.error("Error:", dataRes);
                gestorToastedINCorrecto(dataRes.error || "Error al lanzar convocatorias");
            }

        } catch (error) {
            console.error("Error en convocatoria:", error);
            gestorToastedINCorrecto("Error de conexión");
        }
    });
}


// ==========================================
// 3. PUENTE ENTRE MODALES (Modificado)
// ==========================================
function abrirModalConvocatoria(idProyectoRecienCreado, departamentosActivos) {
    const modal = document.getElementById("modal-convocatoria");
    const inputHidden = document.getElementById("idProyectoRelacionado");
    const form = document.getElementById("form-convocatoria");

    if (modal && inputHidden && form) {
        // 1. Guardamos el ID
        inputHidden.value = idProyectoRecienCreado;

        // 2. Mapeo: Relaciona la llave del Proyecto (Modal 1) con el name del Input (Modal 2)
        const mapaDepartamentos = {
            "lucesDep": "cant_luces",
            "arteDep": "cant_arte",
            "camaraDep": "cant_camara",
            "direccionDep": "cant_direccion",
            "postProdDep": "cant_postprod"
        };

        // 3. Iteramos y bloqueamos/desbloqueamos
        Object.keys(mapaDepartamentos).forEach(depKey => {
            const inputName = mapaDepartamentos[depKey];
            const input = form.querySelector(`[name="${inputName}"]`);

            if (input) {
                // Verificamos si en el objeto departamentosActivos viene en 1 (true) o 0 (false)
                const estaActivo = departamentosActivos[depKey] === 1;

                if (estaActivo) {
                    // Habilitar
                    input.disabled = false;
                    input.value = ""; // Limpiar valor previo
                    input.placeholder = "Cantidad...";
                    // Quitamos estilo visual de deshabilitado al contenedor padre
                    input.parentElement.classList.remove("opacity-40", "pointer-events-none");
                } else {
                    // Deshabilitar
                    input.disabled = true;
                    input.value = "0"; // Valor por defecto
                    // Agregamos estilo visual para que se vea apagado
                    input.parentElement.classList.add("opacity-40", "pointer-events-none");
                }
            }
        });

        // 4. Mostramos el modal
        modal.classList.remove("hidden");
    }
}