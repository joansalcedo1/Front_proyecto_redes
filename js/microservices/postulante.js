async function cargarPostulaciones() {
    try {
        const res = await fetch("./dataSimulada/postulantesGeneral.json");
        const data = await res.json();

        if (!data.ok) return;

        renderPostulaciones(data.data);

    } catch (err) {
        console.error("Error cargando postulaciones:", err);
    }
}


function renderPostulaciones(lista) {
    const cont = document.getElementById("postulaciones-container");
    const template = document.getElementById("postulacion-template");

    cont.innerHTML = "";

    lista.forEach(p => {
        const clone = template.content.cloneNode(true);

        clone.querySelector("#titulo_post").textContent = p.tituloConvocatoria;

        // Proyecto (placeholder si no existe)
        clone.querySelector("#proyecto_post").textContent =
            p.proyecto || "Proyecto no especificado";

        // Área requerida (placeholder)
        clone.querySelector("#area_post").textContent =
            p.areaRequerida || "No especificada";

        // Fecha límite (placeholder)
        clone.querySelector("#fecha_post").textContent =
            p.fechaLimite || "Sin fecha";

        // Estado visual
        const estadoTxt = clone.querySelector("#estado_post");
        const estadoIcon = clone.querySelector("#estado_icon");

        if (p.estadoPost === "aceptado") {
            estadoTxt.textContent = "Aceptado";
            estadoTxt.classList.add("text-green-600");
            estadoIcon.innerHTML = "🟢";
        } else if (p.estadoPost === "rechazado") {
            estadoTxt.textContent = "Rechazado";
            estadoTxt.classList.add("text-red-600");
            estadoIcon.innerHTML = "🔴";
        } else {
            estadoTxt.textContent = "Pendiente";
            estadoTxt.classList.add("text-yellow-500");
            estadoIcon.innerHTML = "🟡";
        }

        // Botón cancelar
        clone.querySelector("#btn_cancelar").onclick = () => {
            alert(`Cancelaste la postulación a: ${p.tituloConvocatoria}`);
        };

        cont.appendChild(clone);
    });
}


// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    cargarPostulaciones();
});
