const URL_BASE = "http://localhost:"
const puertoConvocatoria = 3308
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password')
    const imgIcon = document.getElementById('iconPassword')
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    const icon = passwordInput.getAttribute('type') === 'password' ? 'https://cdn-icons-png.flaticon.com/512/9759/9759281.png' : 'https://cdn-icons-png.flaticon.com/512/6684/6684701.png '
    passwordInput.setAttribute('type', type);
    imgIcon.setAttribute('src', icon)

}

async function getAllconvocatorias() {
    //const URL_convocatorias = await fetch(`${URL_BASE}${puertoConvocatoria}/apiRedes/convocatoria`)
    const URL_DATOSIMULADOS = "./dataSimulada/convocatoria.json"
    const template = document.getElementById("convocatoria-template")
    const grid = document.getElementById("convocatorias-grid")

    try {
        //cambiar url cuando se conecté con el backend
        //const res = await fetch(`${URL_convocatorias}/`) //=> consulta convocatorias, sacado de la documentacion de convocatorias
        const res = await fetch(URL_DATOSIMULADOS)

        if (!res.ok) {
            throw new Error(`Error al cargar los datos: ${res.statusText}`);
        }

        const convocatorias = await res.json();

        convocatorias.forEach(item => {
        const clone = template.content.cloneNode(true)

        clone.querySelector("#nombre_convocatoria").textContent = item.tituloCon
        clone.querySelector("#titulo_proyecto").textContent = item.tituloProyecto
        clone.querySelector("#descripcion_convocatoria").textContent = item.descripcion
        clone.querySelector("#area_requerida_convocatoria").textContent = item.areaRequerida
        clone.querySelector("#fechaMax_convocatoria").textContent = item.fecha_cierre

        grid.appendChild(clone)
    })
    } catch (error) {
        console.error(error)
    }
    
}

async function getParticipantes() {
    //const URL_convocatorias = await fetch(`${URL_BASE}${puertoConvocatoria}/apiRedes/convocatoria`)
    const URL_DATOSIMULADOS = "./dataSimulada/convocatoria.json"
    const template = document.getElementById("convocatoria-template")
    const grid = document.getElementById("convocatorias-grid")

    try {
        //cambiar url cuando se conecté con el backend
        //const res = await fetch(`${URL_convocatorias}/`) //=> consulta convocatorias, sacado de la documentacion de convocatorias
        const res = await fetch(URL_DATOSIMULADOS)

        if (!res.ok) {
            throw new Error(`Error al cargar los datos: ${res.statusText}`);
        }

        const convocatorias = await res.json();

        convocatorias.forEach(item => {
        const clone = template.content.cloneNode(true)

        clone.querySelector("#nombre_convocatoria").textContent = item.tituloCon
        clone.querySelector("#titulo_proyecto").textContent = item.tituloProyecto
        clone.querySelector("#descripcion_convocatoria").textContent = item.descripcion
        clone.querySelector("#area_requerida_convocatoria").textContent = item.areaRequerida
        clone.querySelector("#fechaMax_convocatoria").textContent = item.fecha_cierre

        grid.appendChild(clone)
    })
    } catch (error) {
        console.error(error)
    }
    
}