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
                jugadores = [...jugadores, ...nuevosJugadores];
                mostrarJugadores(jugadores);
            }
            break;

            case 'ronda_seleccionada':
            if (data.codigo_sala === salaActual) {
                mostrarRondaSeleccionada(data.ronda);
            }
            break;

            case 'mensaje_chat':
                if (data.action === 'mensaje_chat') {
                    mostrarMensajeChat(data);
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

document.addEventListener("DOMContentLoaded", function () {
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
                    
                    jugadores = [nuevoJugador];

                    sendWebSocketMessage({
                        action: 'sala_creada',
                        codigo_sala: codigoSala,
                        jugadores: jugadores
                    });

                    window.location.href = `./crear/crearSala.html?codigo=${codigoSala}`;
                }
            } catch (error) {
                console.error('Error al crear la sala:', error);
            }
        });
    }

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

    document.getElementById('send').addEventListener('click', () => {
        const messageInput = document.getElementById('message');
        const nombreUsuario = sessionStorage.getItem('nombreUsuario');
        const message = messageInput.value.trim();
        if (message) {
            // Enviar el mensaje al servidor WebSocket
            socket.send(JSON.stringify({
                action: 'mensaje_chat',
                nombreUsuario: nombreUsuario,  // Ajusta esto según el nombre de usuario que uses
                mensaje: message
            }));
            messageInput.value = ''; // Limpia el campo de entrada de texto
        }
    });
});

function obtenerCodigoSala() {
    const inputs = document.querySelectorAll('.codigo-ingreso');
    return Array.from(inputs).map(input => input.value).join('');
}

function mostrarMensajeChat(data) {
    const chatContainer = document.getElementById('messages');
    if (chatContainer) {
        const mensajeElemento = document.createElement('div');
        mensajeElemento.textContent = `${data.nombreUsuario}: ${data.mensaje}`;
        chatContainer.appendChild(mensajeElemento);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Desplaza hacia abajo automáticamente
    } else {
        console.error("No se encontró el contenedor de mensajes en el HTML.");
    }
}

function mostrarRondaSeleccionada(rondaSeleccionada) {
    const rondaDisplay = document.querySelector('.ronda-tomada');
    if (rondaDisplay) {
        rondaDisplay.textContent = `Ronda seleccionada: ${rondaSeleccionada}`;
        rondaDisplay.style.display = 'block'; // Asegúrate de que se muestre el elemento
    }
}
