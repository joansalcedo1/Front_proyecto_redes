
//===================== CREAR USUARIO ======================  
async function registroUsuarios(event) {
    const URL_SIMULADA = "./dataSimulada/registroDeUsuario.json"
    event.preventDefault();
    const usuario = {
        nombre: document.getElementById("firstname").value,
        apellido: document.getElementById("lastname").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        rol: document.getElementById("rol").value,
        perfil: document.getElementById("mensaje").value
    };
    console.log("escribiste esto", usuario)
    try {
        //DESCOMENTAR CUANDO SE CONECTE AL BACKEND
        //const res = await http("POST", URL_usuarios, usuario);

        const res = await http("GET", URL_SIMULADA);

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }
        const data = await res.json()
        console.log("Usuario creado:", data);
        gestorToastedCorrecto(`Usuario ${usuario.nombre} creado con exito. Rederigiendo al login...`)

        setTimeout(() => {
            window.location.href = "login.html";
        }, 5000);



        return data

    } catch (error) {
        console.error("❌ Error en crearUsuarioService:", error.message);
        throw error;
    }
}

//=================================== INICIO SESION ==================================== 
async function inicioSesion(e) {
    const URL_SIMULADA = "./dataSimulada/inicioSesion.json"

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const errorBox = document.getElementById("error-message");

    try {
        //falta la creacion del endpoint ESPERAR 
        /*
        const res = await http("POST", URL_usuarios, {
            email,
            password
        });*/

        const res = await http("GET", URL_SIMULADA)
        if (email == res.email & password == res.password) {
            estorToastedCorrecto(`Bienvenido ${usuario.nombre}. Rederigiendo al index...`)

            setTimeout(() => {
                window.location.href = "index.html";
            }, 5000);
        }else{
            errorBox.classList.remove("hidden");
        }
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
}

//manejo de form multistep
let currentStep = 1;
const totalSteps = 3;
const form = document.getElementById("multipleForm")
function actualizarUI() {
    const indicator = document.getElementById(`indicatorStep${currentStep}`)
    for (i = 1; i <= totalSteps; i++) {
        if (i === currentStep) {
            indicator.classList.remove('bg-gray-400');
            indicator.classList.add('bg-blue-400');
        } else {
            indicator.classList.remove('bg-blue-400');
            indicator.classList.add('bg-gray-400');
        }
    }

}

function nextStep() {
    const currentInputs = document.getElementById(`step${currentStep}`).querySelectorAll('input[required]');
    let allValid = true;

    currentInputs.forEach(input => {
        if (!input.checkValidity()) {
            allValid = false;
            input.reportValidity();
        }
    });

    if (allValid && currentStep < totalSteps) {
        const currentElement = document.getElementById(`step${currentStep}`)
        currentElement.classList.add("hidden")
        currentStep++
        const nextElement = document.getElementById(`step${currentStep}`)
        nextElement.classList.remove("hidden")
        actualizarUI();
    }
}