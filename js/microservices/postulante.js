// BASE DE LA URL
//cuando se suba a la vm se cambia el localhost por la direccion ip de la maquina del backen
const URL_BASE = "http://localhost:"
//DEFINIR PUERTOS DE CADA MICROSERVICIO
const puertoConvocatoria = 3308
const puertoPostulante = 3308
//DEFINIR URL'S DE CADA MICROSERVICIO
//en cada llamado de cada microservicio se le agrega lo necesario
const URL_convocatorias = `${URL_BASE}${puertoConvocatoria}/apiRedes/convocatoria`
const URL_postulantes = `${URL_BASE}${puertoPostulante}/proyecto_redes_capasback/postulante`



