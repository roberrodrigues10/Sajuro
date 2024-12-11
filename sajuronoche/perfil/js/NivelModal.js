const cuadroNivel = document.getElementById('contenedorModalNivel');

function abrirModal() {
    cuadroNivel.style.display = 'flex';
}

function cerrarModal() {
    cuadroNivel.style.display = 'none';
}

function handleNivelClick(e) {
    const nivelElement = e.target.closest('.NivelPerfil');
    
    if (nivelElement) {
        abrirModal();
    } 
    // Verificamos que el clic no sea dentro del modal y que el modal esté visible
    else if (!cuadroNivel.contains(e.target) && cuadroNivel.style.display === 'flex') {
        cerrarModal();
    }
}

document.addEventListener('click', handleNivelClick);

// Valores de experiencia por esfera
const experienciaEsferaAzul = 12;
const experienciaEsferaRoja = 38;
const experienciaEsferaDorada = 72;

// Experiencia necesaria para subir de nivel
const experienciaPorNivel = 100;

// Límite de esferas azules
const LIMITE_ESFERAS_AZULES = 9999;

// Estado inicial
let nivelActual = 0;
let experienciaActual = 0;
let esferasAzules = 10;
let esferasRojas = 10;
let esferasDoradas = 10;

async function obtenerPuntosUsuario() {
    try {
        const respuesta = await fetch('./php/obtenerPuntos.php'); 
        const datos = await respuesta.json();

        if (!datos.success) {
            console.error('Error:', datos.message);
            return 0;
        }

        return datos.puntosTotales;
    } catch (error) {
        console.error('Error al obtener puntos del servidor:', error);
        return 0;
    }
}

function ganarExperiencia(cantidad) {
    experienciaActual += cantidad;
    while (experienciaActual >= experienciaPorNivel) {
        experienciaActual -= experienciaPorNivel;
        nivelActual++;
    }
}

// Función para calcular esferas azules a partir de los puntos
async function calcularEsferasAzules() {
    const puntosTotales = await obtenerPuntosUsuario();

    const nuevasEsferasAzules = Math.floor(puntosTotales / 10);

    if (nuevasEsferasAzules > 0) {
        ganarEsferaAzul(nuevasEsferasAzules);
    }

    actualizarTodo();
}

function actualizarEsferas() {
    // Convertir esferas azules a rojas
    let nuevasRojas = Math.floor(esferasAzules / 10);
    if (nuevasRojas > 0) {
        esferasRojas += nuevasRojas;
    }
    
    // Convertir esferas rojas a doradas
    let nuevasDoradas = Math.floor(esferasRojas / 25);
    if (nuevasDoradas > 0) {
        esferasDoradas += nuevasDoradas;
    }
    
    // Calcular experiencia total
    let experienciaTotal = 
        esferasAzules * experienciaEsferaAzul + 
        esferasRojas * experienciaEsferaRoja + 
        esferasDoradas * experienciaEsferaDorada;
    
    // Resetear experiencia y nivel
    nivelActual = 0;
    experienciaActual = 0;
    
    // Aplicar toda la experiencia
    ganarExperiencia(experienciaTotal);
}

function ganarExperiencia(cantidad) {
    experienciaActual += cantidad;
    while (experienciaActual >= experienciaPorNivel) {
        experienciaActual -= experienciaPorNivel;
        nivelActual++;
    }
}

// Función para ganar esferas azules
function ganarEsferaAzul(cantidad = 1) {
    esferasAzules = Math.min(esferasAzules + cantidad, LIMITE_ESFERAS_AZULES);
    actualizarEsferas();
}

function ganarEsferaRoja(cantidad = 1) {
    esferasRojas += cantidad;
    actualizarEsferas();
}

function ganarEsferaDorada(cantidad = 1) {
    esferasDoradas += cantidad;
    actualizarEsferas();
}

function actualizarBarraExperiencia() {
    const porcentaje = (experienciaActual / experienciaPorNivel) * 100;
    document.querySelector('.barraNivel').style.width = `${porcentaje}%`;
    document.querySelector('.NumeroNivelModal span:first-child').textContent = nivelActual;
    document.querySelector('.NumeroNivelModal span:last-child').textContent = nivelActual + 1;
    
    // Guardar cada vez que se actualiza el nivel
    guardarEsferasEnBD();
}

function actualizarContadoresEsferas() {
    document.querySelector('.CantidadEsferaAzulModalNivel h1').textContent = `+${esferasAzules}`;
    document.querySelector('.CantidadEsferaRojaModalNivel h1').textContent = `+${esferasRojas}`;
    document.querySelector('.CantidadEsferaDoradaModalNivel h1').textContent = `+${esferasDoradas}`;

    document.querySelector('.contenidoCantidadEsferasAzules h1').textContent = esferasAzules;
    document.querySelector('.contenidoCantidadEsferasRojas h1').textContent = esferasRojas;
    document.querySelector('.contenidoCantidadEsferasDoradas h1').textContent = esferasDoradas;

    // Guardar en la base de datos
    guardarEsferasEnBD();
}

async function guardarEsferasEnBD() {
    try {
        // Obtener el nivel actual del span
        const nivelActualSpan = document.querySelector('.NumeroNivelModal span:first-child');
        const nivelActual = parseInt(nivelActualSpan.textContent) || 0;

        const datos = {
            esfera_primera: esferasAzules,
            esfera_segunda: esferasRojas,
            esfera_tercera: esferasDoradas,
            nivel: nivelActual  // Agregamos el nivel
        };

        console.log('Enviando datos:', datos);

        const respuesta = await fetch('./php/guardarEsferas.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();
        
        if (!resultado.success) {
            throw new Error(resultado.message || 'Error desconocido');
        }

        console.log('Datos guardados exitosamente');
    } catch (error) {
        console.error('Error al guardar los datos:', error);
    }
}

function actualizarTodo() {
    actualizarBarraExperiencia();
    actualizarContadoresEsferas();
}

document.addEventListener('DOMContentLoaded', () => {
    calcularEsferasAzules();
    actualizarTodo();
});

function establecerEsferas(azules, rojas, doradas) {
    esferasAzules = Math.min(azules, LIMITE_ESFERAS_AZULES);
    esferasRojas = rojas;
    esferasDoradas = doradas;
    actualizarTodo();
}