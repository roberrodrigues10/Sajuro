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
            case 'mensaje_chat':
                if (data.action === 'mensaje_chat') {
                    mostrarMensajeChat(data);
                }
            break;
            case 'actualizar_rondas':
            if (data.codigo_sala === salaActual) {
                // Actualizar el número de rondas en la interfaz de usuario
                const rondasElement = document.getElementById('rondas');
                if (rondasElement) {
                    rondasElement.textContent = `rondas ${data.numRondas}`;
                }
            }
            break;
            case 'actualizar_tiempo':
            if(data.codigo_sala === salaActual) {

                const tiemposElement = document.getElementById('tiempo');
                if (tiemposElement) {
                    tiemposElement.textContent = `tiempo ${data.numTiempo}`;
                }
            } 
            break;
            case 'actualizar_modo_juego':
            if (data.codigo_sala === salaActual) {
                const modoTomado = document.querySelector('.modo-tomado');
                if (modoTomado) {
                    modoTomado.textContent = `Modo seleccionado: ${data.modo}`;
                }
            }
            break; 

            case 'partida_iniciada':
                if (data.codigo_sala === salaActual) {
                    alert(data.mensaje); // Notifica a los jugadores que la partida ha comenzado
                    window.location.href = '../juego/deportes/deportes.html?codigo=' + salaActual;
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
            console.log('mensaje', message)
        }
    });
});

function obtenerCodigoSala() {
    const inputs = document.querySelectorAll('.codigo-ingreso');
    return Array.from(inputs).map(input => input.value).join('');
}
function mostrarMensajeChat(data) {
    const chatContainer = document.querySelector('.messages');
    if (chatContainer) {
        const mensajeElemento = document.createElement('div');
        mensajeElemento.textContent = `${data.nombreUsuario}: ${data.mensaje}`;
        chatContainer.appendChild(mensajeElemento);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Desplaza hacia abajo automáticamente
    } else {
        console.error("No se encontró el contenedor de mensajes en el HTML.");
    }
}

// Selección de los elementos de opciones de rondas
const rondaUno = document.getElementById('rondas-1-2');
const rondaDos = document.getElementById('rondas-2-4');
const rondaTres = document.getElementById('rondas-4-6');

const rondas = [rondaUno, rondaDos, rondaTres];

// Selección de rondas y actualización en pantalla y servidor
rondas.forEach(ronda => {
    ronda.addEventListener('click', () => {
        // Desmarcar cualquier selección previa
        rondas.forEach(r => {
            r.style.backgroundColor = ''; 
        });
        // Marcar la opción seleccionada
       ronda.style.backgroundColor = '#c19a67';

        console.log(`Ronda seleccionada: ${ronda.id}`);

        // Obtener el número de rondas desde el atributo `data-rondas`
        const numRondas = parseInt(ronda.getAttribute('data-rondas'));

        // Mostrar la selección en el segundo div
        const rondasElement = document.getElementById('rondas');
        if (rondasElement) {
            rondasElement.textContent = `Rondas: ${numRondas}`;
        }

        // Enviar la actualización de rondas al servidor
        sendWebSocketMessage({
            action: 'actualizar_rondas',
            codigo_sala: salaActual,
            numRondas: numRondas
        });
    });
});

const tiempoUno = document.getElementById('tiempo-1');
const tiempoDos = document.getElementById('tiempo-2');
const tiempoTres = document.getElementById('tiempo-3');

const tiempos = [tiempoUno, tiempoDos, tiempoTres];

tiempos.forEach(tiempo => {
    tiempo.addEventListener('click', () => {

        tiempos.forEach(t => {
            t.style.backgroundColor = ''; 
        });
        
        tiempo.style.backgroundColor = '#c19a67';

        console.log(`Tiempo seleccionado: ${tiempo.id}`);

        const numTiempo = parseInt(tiempo.getAttribute('data-tiempo'));

        const tiemposElement = document.getElementById('tiempo');
        if(tiemposElement){
            tiemposElement.textContent = `tiempo: ${numTiempo}`;
        }

        sendWebSocketMessage({
            action: 'actualizar_tiempo',
            codigo_sala: salaActual,
            numTiempo: numTiempo
        });
    });
});

const modalidadAleatorio = document.getElementById('modalidad-aleatorio');
const aparecerOdesaparecerModalidad = document.getElementById('aparecerOdesaparecer-modalidad');
const modoAleatorio = document.getElementById('modo-aleatorio');
const modoTomado = document.querySelector('.modo-tomado');

// Función para limpiar event listeners anteriores
function removeAllEventListeners(element) {
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
    return newElement;
}

// Función para actualizar el modo de juego
function actualizarModoJuego(modo) {
    console.log('Actualizando modo de juego:', modo);
    
    sendWebSocketMessage({
        action: 'actualizar_modo_juego',
        codigo_sala: salaActual,
        modo: modo
    });

    if (modoTomado) {
        modoTomado.textContent = `Modo seleccionado: ${modo}`;
    }
}

// Inicializar los event listeners una sola vez
function inicializarEventListeners() {
    // Remover listeners anteriores si existen
    const newModalidadAleatorio = removeAllEventListeners(modalidadAleatorio);
    const newModoAleatorio = removeAllEventListeners(modoAleatorio);

    // Agregar nuevos listeners
    newModalidadAleatorio.addEventListener('click', () => {
        aparecerOdesaparecerModalidad.style.opacity = '1';
        newModalidadAleatorio.style.backgroundColor = '#c19a67';
        newModoAleatorio.style.backgroundColor = '';
        actualizarModoJuego('Modo Libre');
    });

    newModoAleatorio.addEventListener('click', () => {
        aparecerOdesaparecerModalidad.style.opacity = '0';
        newModalidadAleatorio.style.backgroundColor = '';
        newModoAleatorio.style.backgroundColor = '#c19a67';
        actualizarModoJuego('Modo Aleatorio');
    });

    // Inicializar las modalidades
    const modalidades = [
        { id: 'modalidad-deportes', nombre: 'Deportes' },
        { id: 'modalidad-musica', nombre: 'Música' },
        { id: 'modalidad-cultura', nombre: 'Cultura' },
        { id: 'modalidad-ropa', nombre: 'Ropa' },
        { id: 'modalidad-animales', nombre: 'Animales' },
        { id: 'modalidad-comida', nombre: 'Comida' }
    ];

    modalidades.forEach(({ id, nombre }) => {
        const elemento = document.getElementById(id);
        if (elemento) {
            const newElemento = removeAllEventListeners(elemento);
            newElemento.addEventListener('click', () => {
                modalidades.forEach(m => {
                    const el = document.getElementById(m.id);
                    if (el) el.style.backgroundColor = '';
                });
                newElemento.style.backgroundColor = '#c19a67';
                actualizarModoJuego(nombre);
            });
        }
    });
}

// Asegurarse de que el código se ejecute solo una vez cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    inicializarEventListeners();
});

document.getElementById('iniciar').addEventListener('click', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const codigoSala = urlParams.get('codigo'); // Obtener el código de sala desde la URL
    console.log("jugando")
    if (codigoSala) {
        sendWebSocketMessage({
            action: 'iniciar_partida',
            codigo_sala: codigoSala
        });
        
    } else {
        console.error('Código de sala no encontrado');
    }
});



