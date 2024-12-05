import { mostrarModalJugadores } from './modalJugadores.js';


const socket = new WebSocket('ws://localhost:8080');
let jugadores = []; // Lista actual de jugadores
const modalVar = document.getElementById('modalJugadoresVar');
const imgVar = document.querySelector('.var');
const imgBloqueo = document.querySelector('.bloqueo-var');
const cerrar = document.getElementById('cerrar');
const modalBloqueo = document.getElementById('modalBloqueo'); // Asegúrate de definirlo en el HTML
let localStream;
let peerConnections = {};

// Obtener el código de sala desde la URL
const urlParams = new URLSearchParams(window.location.search);
const salaActual = urlParams.get('codigo');

export const sendWebSocketMessage = (message) => {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.error('WebSocket no está conectado.');
    }
};

// Evento cuando se abre la conexión WebSocket
socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');

    // Solicitar la lista de jugadores al conectarse
    sendWebSocketMessage({
        action: 'solicitar_jugadores',
        codigo_sala: salaActual
    });

    // Notificar que un nuevo jugador se unió
    sendWebSocketMessage({
        action: 'jugador_unido',
        codigo_sala: salaActual,
        nombreUsuario: sessionStorage.getItem('nombreUsuario'),
        avatar: '../../menu/css/img/avatar.png' // Avatar predeterminado del jugador
    });
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Mensaje recibido del servidor:", event.data);
   


    switch (data.action) {
        case 'lista_jugadores':
        case 'actualizar_jugadores':
            if (data.codigo_sala === salaActual) {
                jugadores = data.jugadores.map(jugador => ({
                    username: jugador.username,
                    avatar: jugador.avatar || '../../menu/css/img/avatar.png'
                }));
                mostrarModalJugadores(jugadores);
            }
            break;
    
        case 'jugador_unido':
            if (data.codigo_sala === salaActual) {
                const jugadorExistente = jugadores.find(j => j.username === data.nombreUsuario);
                if (!jugadorExistente) {
                    jugadores.push({
                        username: data.nombreUsuario,
                        avatar: data.avatar || '../../menu/css/img/avatar.png'
                    });
                    mostrarModalJugadores(jugadores);

                     // Capturar la pantalla automáticamente
                     if (data.nombreUsuario === sessionStorage.getItem('nombreUsuario')) {
                        captureScreen(); // Captura tu propia pantalla o realiza otra acción.
                    }
                }
            }
            break;
            
        case 'error':
            console.error('Error recibido:', data.mensaje);
            alert(data.mensaje);
            break;
    
        case 'oferta':
            if (data.codigo_sala === salaActual) {
                crearOferta(data);
            }
            break;
    
        case 'respuesta':
            if (data.codigo_sala === salaActual) {
                manejarRespuesta(data);
            }
            break;
    
        case 'nuevo_ICE_candidate':
            if (data.codigo_sala === salaActual) {
                manejarNuevoICECandidate(data);
            }
            break;

            case 'espiar_partida':
                if (data.codigo_sala === salaActual) {
                    // Aquí puedes usar `captureScreen` para capturar automáticamente:
                    captureScreen();
    
                    // Actualizar el modal con la partida del jugador
                    const streamingContainer = document.getElementById("streamingContainer");
                    streamingContainer.innerHTML = `
                        <h3>Espejando la partida de: ${data.usuario}</h3>
                        <p>Estado del juego: ${data.estado_partida}</p>
                    `;
                } else {
                    console.error("Código de sala no coincide.");
                }
                break;
    }
};

// Función para cerrar el modal (si tienes un botón de cerrar)
document.getElementById("cerrarModal").onclick = function () {
    document.getElementById("recintoPartida").style.display = "none";
};

// Mostrar el modal y renderizar los jugadores
imgVar.addEventListener('click', () => {
    if (modalVar) {
        modalVar.style.display = 'flex'; // Mostrar el modal
        mostrarModalJugadores(jugadores); // Renderizar los jugadores en el modal
    } else {
        console.error('Modal no encontrado');
    }
});

// Cerrar el modal
cerrar.addEventListener('click', () => {
    if (modalVar) {
        modalVar.style.display = 'none'; // Ocultar el modal
    }
});

// Mostrar bloqueo en caso necesario
imgBloqueo.addEventListener('click', function () {
    if (imgBloqueo.style.opacity === '1') {
        modalBloqueo.style.display = 'flex';
    }
});

// Cerrar el modal de bloqueo
cerrar.addEventListener('click', function () {
    modalBloqueo.style.display = 'none';
});

async function obtenerMedia() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // Mostrar el stream local en el UI (si es necesario)
        const localVideo = document.getElementById('local-video');
        localVideo.srcObject = localStream;
    } catch (error) {
        console.error("Error obteniendo el stream de medios:", error);
    }
}

obtenerMedia();

async function crearOferta(jugadorDestino) {
    const peerConnection = new RTCPeerConnection(configuracionSTUN);
    peerConnections[jugadorDestino] = peerConnection; // Almacenar la conexión

    // Añadir las pistas de video y audio locales
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // Crear oferta y enviar al jugador
    const oferta = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(oferta);

    sendWebSocketMessage({
        action: 'oferta',
        sala: salaActual,
        oferta: oferta,
        destino: jugadorDestino
    });

    // Configurar ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            sendWebSocketMessage({
                action: 'nuevo_ICE_candidate',
                sala: salaActual,
                candidate: event.candidate,
                destino: jugadorDestino
            });
        }
    };

    // Mostrar el video remoto
    peerConnection.ontrack = (event) => {
        const remoteVideo = document.createElement('video');
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.autoplay = true;
        document.body.appendChild(remoteVideo); // Agregarlo a la UI
    };
}

// Modificar las funciones de respuesta y ICE para usar peerConnections[jugadorDestino]
function manejarRespuesta(data) {
    const peerConnection = peerConnections[data.destino]; // Acceder a la conexión correspondiente
    if (peerConnection) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(data.respuesta));
    }
}

function manejarNuevoICECandidate(data) {
    const peerConnection = peerConnections[data.destino]; // Acceder a la conexión correspondiente
    if (peerConnection) {
        const candidate = new RTCIceCandidate(data.candidate);
        peerConnection.addIceCandidate(candidate);
    }
}

export function mostrarStreamingEnVivo(usuario) {
    const streamingContainer = document.getElementById('streamingContainer');
    streamingContainer.innerHTML = ''; // Limpiar cualquier contenido previo

    // Crear un video HTML para mostrar el stream
    const videoEnVivo = document.createElement('video');
    videoEnVivo.id = video-$[usuario];  // Asignar un ID único para cada video
    videoEnVivo.autoplay = true;
    videoEnVivo.controls = true;
    videoEnVivo.width = 640;
    videoEnVivo.height = 360;


    // Agregar el video al contenedor
    streamingContainer.appendChild(videoEnVivo);

    // Lógica de WebRTC: Asignar el stream remoto a la etiqueta de video
    const peerConnection = peerConnections[usuario];  // Suponiendo que tienes las conexiones WebRTC guardadas
    if (peerConnection) {
        peerConnection.ontrack = (event) => {
            videoEnVivo.srcObject = event.streams[0];  // Asignar el stream remoto al video
        };
    }
}

export async function captureScreen() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });

        // Enviar el stream mediante WebRTC (opcional)
        for (const jugador of jugadores) {
            if (peerConnections[jugador.username]) {
                stream.getTracks().forEach(track =>
                    peerConnections[jugador.username].addTrack(track, stream)
                );
            }
        }

        // Mostrar el stream en el contenedor
        const streamingContainer = document.getElementById('streamingContainer');
        streamingContainer.innerHTML = ''; // Limpiar contenido anterior

        const videoEnVivo = document.createElement('video');
        videoEnVivo.srcObject = stream;
        videoEnVivo.autoplay = true;
        videoEnVivo.controls = true;
        streamingContainer.appendChild(videoEnVivo);

    } catch (error) {
        console.error("Error capturando la pantalla:", error);
    }
}