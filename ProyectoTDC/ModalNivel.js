const nivel = document.getElementById('NivelPerfil');
const cuadroNivel = document.getElementById('contenedorModalNivel');
const cerrado = document.getElementById('afuera');

nivel.addEventListener('click', () => {
    cuadroNivel.style.display = 'flex';
});

document.addEventListener('click', (e) => {
    if(!nivel.contains(e.target) ){
        cuadroNivel.style.display = 'none';
    }
});

// Inicializar valores para horas, minutos, segundos y milisegundos
let hours = 0;
let minutes = 0;
let seconds = 0;
let milliseconds = 0;

function startTimer() {
    milliseconds++;
    
    // Si los milisegundos son 100, reseteamos y sumamos un segundo
    if (milliseconds >= 100) {
        milliseconds = 0;
        seconds++;
    }
    
    // Si los segundos son 60, reseteamos y sumamos un minuto
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    
    // Si los minutos son 60, reseteamos y sumamos una hora
    if (minutes >= 60) {
        minutes = 0;
        hours++;
    }

    // Formatear los números para que siempre tengan dos dígitos
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMilliseconds = milliseconds.toString().padStart(2, '0');

    // Actualizar el contenido del div con el nuevo tiempo
    document.getElementById('timer').innerText = `${formattedHours}:${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
}

// Llamar a la función startTimer cada 10 milisegundos para actualizar el contador
setInterval(startTimer, 10);

const tiempo = document.getElementById('tiempoDeJuegoPerfil');
const cuadroTiempo = document.getElementById('containerModalTiempoDeJuego');
const cerrada = document.getElementById('afuera');

tiempo.addEventListener('click', () => {
    cuadroTiempo.style.display = 'flex';
});

document.addEventListener('click', (e) => {
    if(!tiempo.contains(e.target) ){
        cuadroTiempo.style.display = 'none';
    }
});