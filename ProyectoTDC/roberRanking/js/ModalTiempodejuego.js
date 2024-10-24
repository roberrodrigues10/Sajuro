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

// Inicializar valores para horas, minutos, segundos y milisegundos
let horas = 0;
let minutos = 0;
let segundos = 0;
let milisegundos = 0;

function startTimer() {
    milisegundos++;
    if (milisegundos >= 100) {
        milisegundos = 0;
        segundos++;
        if (segundos >= 60) {
            segundos = 0;
            minutos++;
        }
        if (minutos >= 60) {
            minutos = 0;
            horas++;
        } 
    }

    // Formatear los números para que siempre tengan dos dígitos
    const formattedHours = horas.toString().padStart(2, '0');
    const formattedMinutes = minutos.toString().padStart(2, '0');
    const formattedSeconds = segundos.toString().padStart(2, '0');
    const formattedMilliseconds = milisegundos.toString().padStart(2, '0');

    // Actualizar el contenido del div con el nuevo tiempo
    let tiempoJugado = `${formattedHours}:${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
    document.getElementById('timer').innerText = tiempoJugado;
}

// Llamar a la función startTimer cada 10 milisegundos para actualizar el contador
setInterval(startTimer, 10);

// Capturar el tiempo jugado al hacer clic en un elemento (puede ser una imagen, un botón, etc.)
document.getElementById('imagenAvatar').addEventListener('click', function() {
    // Formatear el tiempo jugado actual
    let tiempoJugado = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}:${milisegundos.toString().padStart(2, '0')}`;

    // Enviar el tiempo jugado a la base de datos usando fetch
    fetch('/guardar-tiempo-jugado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tiempoJugado: tiempoJugado })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Tiempo guardado:', data);
    })
    .catch((error) => {
        console.error('Error al guardar el tiempo:', error);
    });
});
