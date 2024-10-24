const Nivel = document.getElementById('NivelPerfil');
const cuadroNivel = document.getElementById('contenedorModalNivel');
const afuera = document.getElementById('afuera');

Nivel.addEventListener('click', () => {
    cuadroNivel.style.display = 'flex';
});

document.addEventListener('click', (e) => {
    if(!Nivel.contains(e.target) ){
        cuadroNivel.style.display = 'none';
    }
});

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
let esferasRojas = 0;
let esferasDoradas = 0;

function ganarExperiencia(cantidad) {
    experienciaActual += cantidad;
    while (experienciaActual >= experienciaPorNivel) {
        experienciaActual -= experienciaPorNivel;
        nivelActual++;
    }
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

function ganarEsferaAzul(cantidad = 1) {
    if (esferasAzules + cantidad > LIMITE_ESFERAS_AZULES) {
        esferasAzules = LIMITE_ESFERAS_AZULES;
    } else {
        esferasAzules += cantidad;
    }
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
}

function actualizarContadoresEsferas() {
    // Actualizar modal
    document.querySelector('.CantidadEsferaAzulModalNivel h1').textContent = `+${esferasAzules}`;
    document.querySelector('.CantidadEsferaRojaModalNivel h1').textContent = `+${esferasRojas}`;
    document.querySelector('.CantidadEsferaDoradaModalNivel h1').textContent = `+${esferasDoradas}`;

    // Actualizar perfil
    document.querySelector('.contenidoCantidadEsferasAzules h1').textContent = esferasAzules;
    document.querySelector('.contenidoCantidadEsferasRojas h1').textContent = esferasRojas;
    document.querySelector('.contenidoCantidadEsferasDoradas h1').textContent = esferasDoradas;
}

function actualizarTodo() {
    actualizarEsferas();
    actualizarBarraExperiencia();
    actualizarContadoresEsferas();
}

// Inicialización
document.addEventListener('DOMContentLoaded', actualizarTodo);

// Función para establecer valores directamente (para pruebas o inicialización)
function establecerEsferas(azules, rojas, doradas) {
    esferasAzules = Math.min(azules, LIMITE_ESFERAS_AZULES);
    esferasRojas = rojas;
    esferasDoradas = doradas;
    actualizarTodo();
}