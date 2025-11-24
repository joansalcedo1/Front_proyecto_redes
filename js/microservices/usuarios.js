
//===================== CREAR USUARIO ======================  
async function registroUsuarios(event) {
    event.preventDefault();

    const usuario = {
        nombre: document.getElementById("firstname").value,
        apellido: document.getElementById("lastname").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        rol: document.getElementById("rol").value,
        perfil: document.getElementById("mensaje").value
    };

    try {
        const res = await http("POST", API_USUARIOS, usuarioData);

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }
        const data = res.json()
        console.log("Usuario creado:", data);

        alert("Usuario creado correctamente");
        window.location.href = "login.html";

        return data

    } catch (error) {
        console.error("❌ Error en crearUsuarioService:", error.message);
        throw error;
    }
}

//=================================== INICIO SESION ==================================== 
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const errorBox = document.getElementById("error-message");

    try {
        const res = await http("POST", "http://localhost:3301/apiRedes/login", {
            email,
            password
        });

        if (!res.ok) {
            errorBox.classList.remove("hidden");
            return;
        }

        const data = await res.json();

        // Guardar ID del usuario en sessionStorage
        sessionStorage.setItem("userId", data.id);

        // Redirigir al dashboard o index
        window.location.href = "index.html";

    } catch (error) {
        console.error("Error en login:", error);
        errorBox.classList.remove("hidden");
    }
});