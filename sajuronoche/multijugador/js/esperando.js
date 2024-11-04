import { mostrarJugadores } from './jugadores.js';

const socket = new WebSocket('ws://localhost:8080');
let jugadores = [];
let pendingMessages = [];
let salaActual = null;

function generarCodigoSala() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function sendWebSocketMessage(message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        pendingMessages.push(message);
    }
}

function actualizarJugadores(nuevoJugador = null) {
    const urlParams = new URLSearchParams(window.location.search);
    salaActual = urlParams.get('codigo');

    // Solo añadir si el jugador tiene un username válido y no está en la lista
    if (nuevoJugador && nuevoJugador.username && !jugadores.some(j => j.username === nuevoJugador.username)) {
        jugadores.push(nuevoJugador);
    }

    mostrarJugadores(jugadores);

    sendWebSocketMessage({
        action: 'actualizar_jugadores',
        codigo_sala: salaActual,
        jugadores: jugadores
    });
}

function inicializarSala() {
    const urlParams = new URLSearchParams(window.location.search);
    salaActual = urlParams.get('codigo');
    const nombreUsuario = sessionStorage.getItem('nombreUsuario');

    const codigoSalaElemento = document.getElementById('numero-codigo');
    if (codigoSalaElemento && salaActual) {
        codigoSalaElemento.textContent = salaActual;
    }

    if (salaActual) {
        sendWebSocketMessage({
            action: 'solicitar_jugadores',
            codigo_sala: salaActual
        });
    }

    // Solo agregar anfitrión si tiene un nombre de usuario válido y la lista está vacía
    if (nombreUsuario && jugadores.length === 0) {
        const nuevoJugador = { 
            username: nombreUsuario, 
            avatar: '../../menu/css/img/avatar.png' 
        };
        actualizarJugadores(nuevoJugador);
    }
}

socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');

    while (pendingMessages.length > 0) {
        const message = pendingMessages.shift();
        socket.send(JSON.stringify(message));
    }

    inicializarSala();
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.action) {
        case 'jugador_unido':
            if (data.codigo_sala === salaActual && data.nombreUsuario) {
                console.log('Nuevo jugador unido:', data.nombreUsuario);
                const nuevoJugador = {
                    username: data.nombreUsuario,
                    avatar: '../../menu/css/img/avatar.png'
                };
                actualizarJugadores(nuevoJugador);
            }
            break;

        case 'actualizar_jugadores':
        case 'lista_jugadores':
            if (data.codigo_sala === salaActual) {
                console.log('Lista de jugadores actualizada');
                const nuevosJugadores = data.jugadores.filter(nuevo =>
                    nuevo.username && !jugadores.some(j => j.username === nuevo.username)
                );
                jugadores = [...jugadores, ...nuevosJugadores]; // Agrega solo jugadores nuevos y con nombre válido
                mostrarJugadores(jugadores);
            }
            break;
    }
};

socket.onerror = (error) => {
    console.error('Error en la conexión WebSocket:', error);
};

socket.onclose = (event) => {
    console.log('Conexión WebSocket cerrada:', event.code, event.reason);
};

// Evento para crear sala
document.addEventListener("DOMContentLoaded", function () {
    // Botón crear sala
    const crearSalaBtn = document.getElementById('crear-sala');
    if (crearSalaBtn) {
        crearSalaBtn.addEventListener('click', async () => {
            const codigoSala = generarCodigoSala();
            const usuarioId = sessionStorage.getItem('usuarioId');
            const nombreUsuario = sessionStorage.getItem('nombreUsuario');

            try {
                const response = await fetch('./crear/php/crear-sala.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        codigo_sala: codigoSala,
                        id_anfitrion: usuarioId
                    })
                });

                const data = await response.json();

                if (data.status === 'success') {
                    salaActual = codigoSala;
                    const nuevoJugador = {
                        username: nombreUsuario,
                        avatar: '../../menu/css/img/avatar.png'
                    };
                    
                    jugadores = [nuevoJugador]; // Inicializar con el anfitrión

                    sendWebSocketMessage({
                        action: 'sala_creada',
                        codigo_sala: codigoSala,
                        jugadores: jugadores
                    });

                    // Redirigir
                    window.location.href = `./crear/crearSala.html?codigo=${codigoSala}`;
                }
            } catch (error) {
                console.error('Error al crear la sala:', error);
            }
        });
    }

    // Botón unirse a sala
    const unirseSalaBtn = document.getElementById('unirse-sala');
    if (unirseSalaBtn) {
        unirseSalaBtn.addEventListener('click', async () => {
            const codigoSala = obtenerCodigoSala();
            const usuarioId = sessionStorage.getItem('usuarioId');
            const nombreUsuario = sessionStorage.getItem('nombreUsuario');

            if (!codigoSala) {
                console.error('Por favor, ingresa un código de sala válido.');
                return;
            }

            try {
                const response = await fetch('http://localhost/Sajuro/sajuronoche/multijugador/unirse/php/unirse-sala.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        codigo_sala: codigoSala,
                        id_usuario: usuarioId
                    })
                });

                const data = await response.json();

                if (data.status === 'success') {
                    salaActual = codigoSala;
                    
                    // Notificar que un nuevo jugador se ha unido
                    sendWebSocketMessage({
                        action: 'jugador_unido',
                        codigo_sala: codigoSala,
                        nombreUsuario: nombreUsuario
                    });
                
                    window.location.href = `./esperando.html?codigo=${codigoSala}`;
                }
            } catch (error) {
                console.error('Error al unirse a la sala:', error);
            }
        });
    }
});

// Función para obtener el código de la sala desde los inputs
function obtenerCodigoSala() {
    const inputs = document.querySelectorAll('.codigo-ingreso');
    return Array.from(inputs).map(input => input.value).join('');
}
