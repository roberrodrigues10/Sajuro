import { mostrarJugadores } from './jugadores.js';

const socket = new WebSocket('ws://localhost:8080');
let jugadores = [];

socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');
    iniciarSala(); // Inicia la funcionalidad según la acción (crear o unirse)
};

function iniciarSala() {
    const nombreUsuario = sessionStorage.getItem('nombreUsuario');
    if (!jugadores.some(jugador => jugador.username === nombreUsuario)) {
        jugadores.push({ username: nombreUsuario, avatar: '../../menu/css/img/avatar.png' });
    }
    mostrarJugadores(jugadores);
}

// Genera un código de sala aleatorio
function generarCodigoSala() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Verifica si se trata de crear o unirse a una sala
function manejarSala(event) {
    const accion = event.target.id; // `crear-sala` o `unirse-sala`

    if (accion === 'crear-sala') {
        crearSala();
    } else if (accion === 'unirse-sala') {
        unirseSala();
    }
}

// Crear una sala
async function crearSala() {
    const codigoSala = generarCodigoSala();
    const usuarioId = sessionStorage.getItem('usuarioId');
    const nombreUsuario = sessionStorage.getItem('nombreUsuario');

    // Agregar anfitrión a la lista de jugadores
    jugadores.push({ username: nombreUsuario, avatar: '../../menu/css/img/avatar.png' });
    mostrarJugadores(jugadores);

    // Crear la sala en el servidor
    const response = await fetch('./crear/php/crear-sala.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo_sala: codigoSala, id_anfitrion: usuarioId })
    });

    const data = await response.json();
    if (data.status === 'success') {
        socket.send(JSON.stringify({ action: 'sala_creada', codigo_sala: codigoSala, nombreUsuario }));
        setTimeout(() => {
            window.location.href = `./crear/crearSala.html?codigo=${codigoSala}`;
        }, 1000);
    } else {
        console.error('Error al crear la sala:', data.message);
    }
}

// Unirse a una sala
async function unirseSala() {
    const codigoSala = obtenerCodigoSala();
    const usuarioId = sessionStorage.getItem('usuarioId');
    const nombreUsuario = sessionStorage.getItem('nombreUsuario');

    if (!codigoSala) {
        console.error('Por favor, ingresa un código de sala válido.');
        return;
    }

    const response = await fetch('http://localhost/Sajuro/sajuronoche/multijugador/unirse/php/unirse-sala.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo_sala: codigoSala, id_usuario: usuarioId })
    });

    const data = await response.json();
    if (data.status === 'success') {
        mostrarJugadores(data.jugadores);
        socket.send(JSON.stringify({ action: 'jugador_unido', codigo_sala: codigoSala, nombreUsuario }));
        window.location.href = `./esperando.html?codigo=${codigoSala}`;
    } else {
        console.error('Error al unirse a la sala:', data.message);
    }
}

// Obtener código de sala desde los inputs
function obtenerCodigoSala() {
    const inputs = document.querySelectorAll('.codigo-ingreso');
    return Array.from(inputs).map(input => input.value).join('');
}

// Escucha de eventos WebSocket
socket.onmessage = function (event) {
    const data = JSON.parse(event.data);

    if (data.action === 'jugador_unido') {
        if (!jugadores.some(jugador => jugador.username === data.nombreUsuario)) {
            jugadores.push({ username: data.nombreUsuario, avatar: '../../menu/css/img/avatar.png' });
            mostrarJugadores(jugadores);
        }
    }
};

// Configura botones de crear/unirse
const crearSalaBtn = document.getElementById('crear-sala');
const unirseSalaBtn = document.getElementById('unirse-sala');
if (crearSalaBtn) crearSalaBtn.addEventListener('click', manejarSala);
if (unirseSalaBtn) unirseSalaBtn.addEventListener('click', manejarSala);
