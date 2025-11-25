/* ==========================================================
   GESTIÓN DE POSTULACIONES (MICROSERVICIO USUARIOS/POSTULANTES)
=========================================================== */

// ============= CREAR POSTULACIÓN =============
async function crearPostulacion(idConvocatoria, buttonElement) {
    // Validar que el usuario esté logueado
    if (!userId) {
        gestorToastedINCorrecto("Debes iniciar sesión para postularte");
        return;
    }

    // Validar que exista la convocatoria
    if (!idConvocatoria) {
        gestorToastedINCorrecto("Error: ID de convocatoria no válido");
        return;
    }

    // Desabilitar el botón para evitar múltiples clics
    if (buttonElement) {
        buttonElement.disabled = true;
        buttonElement.textContent = "Postulando...";
    }

    // URL del endpoint: http://localhost:3310/apiRedes/usuarios/:idUsuario/postulacion/:idConvocatoria
    const endpoint = `${URL_usuarios}/${userId}/postulacion/${idConvocatoria}`;

    try {
        console.log(`Creando postulación en: ${endpoint}`);
        
        const res = await http("POST", endpoint, {});

        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Postulación creada:", data);

        // Mensaje de éxito
        gestorToastedCorrecto("¡Postulación enviada correctamente!");

        // Cambiar aspecto del botón a "Postulado"
        if (buttonElement) {
            buttonElement.disabled = true;
            buttonElement.textContent = "Postulado";
            buttonElement.classList.add("bg-green-500", "cursor-not-allowed");
            buttonElement.classList.remove("bg-gradient-to-r", "from-[#23CCE8]", "to-[#0FF0DE]", "hover:shadow-lg", "hover:scale-105");
        }

    } catch (error) {
        console.error("Error al crear postulación:", error);
        gestorToastedINCorrecto("Error al enviar la postulación. Intenta nuevamente.");

        // Restaurar el botón en caso de error
        if (buttonElement) {
            buttonElement.disabled = false;
            buttonElement.textContent = "Postularme";
        }
    }
}

// Función principal para obtener las postulaciones del usuario logueado
async function cargarMisPostulaciones() {
    const grid = document.getElementById("postulaciones-grid");
    const totalCounter = document.getElementById("total-postulaciones");
    const template = document.getElementById("postulacion-template");

    // Verificar si el usuario está logueado (userId viene de utilities.js / sessionStorage)
    if (!userId) {
        console.warn("No hay usuario logueado");
        grid.innerHTML = `<div class="col-span-full text-center py-10">
            <p class="text-gray-500">Debes iniciar sesión para ver tus postulaciones.</p>
            <a href="login.html" class="text-[#23CCE8] font-bold hover:underline">Ir al login</a>
        </div>`;
        return;
    }

    // Endpoint solicitado: http://localhost:3310/apiRedes/usuarios/{id}/postulaciones
    // URL_usuarios ya está definido en utilities.js como: `${URL_BASE}${puertoUsuarios}/apiredes/usuarios`
    const endpoint = `${URL_usuarios}/${userId}/postulaciones`;

    try {
        console.log(`Consultando postulaciones en: ${endpoint}`);
        const res = await http("GET", endpoint);

        if (!res.ok) {
            // Manejo de error si no es 200 OK
            if(res.status === 404) {
                 grid.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center py-20 opacity-70">
                    <img src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" class="w-24 h-24 mb-4 grayscale opacity-50">
                    <h3 class="text-xl font-bold text-gray-400">Aún no te has postulado</h3>
                    <p class="text-gray-400">Explora las convocatorias y aplica a tu próximo proyecto.</p>
                    <a href="misConvocatorias.html" class="mt-4 px-6 py-2 bg-[#23CCE8] text-white rounded-full font-bold hover:shadow-lg transition">Ver Convocatorias</a>
                </div>`;
                if(totalCounter) totalCounter.textContent = "0";
                return;
            }
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        
        // Limpiar grid (quitar spinner de carga)
        grid.innerHTML = "";

        // Validar si es array y tiene datos
        if (!Array.isArray(data) || data.length === 0) {
            grid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 opacity-70">
                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" class="w-24 h-24 mb-4 grayscale opacity-50">
                <h3 class="text-xl font-bold text-gray-400">No hay postulaciones registradas</h3>
                <p class="text-gray-400">Parece que aún no tienes historial de postulaciones.</p>
            </div>`;
            if(totalCounter) totalCounter.textContent = "0";
            return;
        }

        // Actualizar contador
        if(totalCounter) totalCounter.textContent = data.length;

        // Renderizar cada postulación
        data.forEach(postulacion => {
            const clone = template.content.cloneNode(true);

            // Mapeo de datos según la estructura JSON esperada:
            /*
            {
                "idPost": 5,
                "usuarioPos": "Juan Pablo Gutierrez",
                "tituloConvocatoria": "...",
                "fechaPost": "2025-11-25T07:29:13.000Z",
                "mensajePres": "Estoy interesado...",
                "estadoPost": ""
            }
            */

            // 1. Título
            clone.querySelector("#titulo-convocatoria").textContent = postulacion.tituloConvocatoria || "Convocatoria sin título";
            
            // 2. Nombre Usuario
            clone.querySelector("#nombre-usuario").textContent = postulacion.usuarioPos || "Usuario";

            // 3. Fecha (Formateo amigable)
            const fechaOriginal = postulacion.fechaPost;
            const fechaFormateada = fechaOriginal ? new Date(fechaOriginal).toLocaleDateString('es-ES', {
                year: 'numeric', month: 'long', day: 'numeric'
            }) : "Fecha desconocida";
            clone.querySelector("#fecha-post").textContent = fechaFormateada;

            // 4. Mensaje
            clone.querySelector("#mensaje-pres").textContent = postulacion.mensajePres || "Sin mensaje de presentación.";

            // 5. Estado (Lógica de colores)
            const badge = clone.querySelector("#estado-badge");
            const estado = (postulacion.estadoPost || "pendiente").toLowerCase();
            
            badge.textContent = estado.charAt(0).toUpperCase() + estado.slice(1); // Capitalizar

            // Clases dinámicas según estado
            badge.className = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap ";
            
            if (estado === "aceptado" || estado === "aprobado") {
                badge.classList.add("bg-green-100", "text-green-700");
            } else if (estado === "rechazado") {
                badge.classList.add("bg-red-100", "text-red-700");
            } else {
                // Pendiente o vacío
                badge.classList.add("bg-yellow-100", "text-yellow-700");
                if(!estado) badge.textContent = "Pendiente";
            }

            // Inyectar en el DOM
            grid.appendChild(clone);
        });

    } catch (error) {
        console.error("Error cargando postulaciones:", error);
        grid.innerHTML = `
        <div class="col-span-full text-center py-10 bg-red-50 rounded-2xl border border-red-100">
            <p class="text-red-500 font-bold">Ocurrió un error al cargar tus postulaciones.</p>
            <p class="text-sm text-red-400 mt-2">${error.message}</p>
            <button onclick="cargarMisPostulaciones()" class="mt-4 text-sm underline text-red-600">Reintentar</button>
        </div>`;
    }
}