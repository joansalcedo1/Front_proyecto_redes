const URL_BASE = "http://localhost:"
const puertoConvocatoria = 3308
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const imgIcon = document.getElementById('iconPassword');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    const icon = passwordInput.getAttribute('type') === 'password' ? 'https://cdn-icons-png.flaticon.com/512/9759/9759281.png' : 'https://cdn-icons-png.flaticon.com/512/6684/6684701.png ';
    passwordInput.setAttribute('type', type);
    imgIcon.setAttribute('src', icon);

}

async function getAllconvocatorias() {
    const res = fetch(`${URL_BASE}${puertoConvocatoria}/apiRedes/convocatoria`)
    const convocatorias = await res.json();

    const template = document.getElementById("convocatoria-template");
    const grid = document.getElementById("convocatorias-grid");

    convocatorias.array.forEach(item => {
        const clone = template.content.cloneNode(true);
        clone.querySelector("[data-title]").textContent = item.titulo;
        clone.querySelector("[data-description]").textContent = item.descripcion;
        clone.querySelector("[data-date]").textContent = `Fecha: ${item.fecha}`;

        grid.appendChild(clone);

    });
}