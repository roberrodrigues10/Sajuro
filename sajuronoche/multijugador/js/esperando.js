import { mostrarJugadores } from './jugadores.js';
import SajuroAudioSystem from './audio-System.js';

let audioSystem = null;
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
    console.log("Código de sala:", salaActual); // Verifica que salaActual esté correctamente asignada

    let jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];

    // Filtrar jugadores de la misma sala
    let jugadoresDeSala = jugadores.filter(jugador => jugador.codigoSala === salaActual);

    // Si se recibe un nuevo jugador, añadirlo si no existe ya en la lista
    if (nuevoJugador && !jugadoresDeSala.some(j => j.username === nuevoJugador.username)) {
        // Usa el avatar del nuevo jugador, o busca en localStorage, o usa avatar por defecto
        nuevoJugador.avatar = nuevoJugador.avatar || 
                               localStorage.getItem('avatar') || 
                               '../../menu/css/img/avatar.png';
        nuevoJugador.codigoSala = salaActual;
        jugadoresDeSala.push(nuevoJugador);
    }

    // Actualizar localStorage
    localStorage.setItem('jugadores', JSON.stringify(jugadoresDeSala));

    // Mostrar los jugadores
    mostrarJugadores(jugadoresDeSala);
}

window.addEventListener('load', function() {
    const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
    console.log("Jugadores cargados desde localStorage:", jugadores);
});

async function inicializarSala() {
    const urlParams = new URLSearchParams(window.location.search);
    salaActual = urlParams.get('codigo');
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const avatar = localStorage.getItem('avatar');

    const codigoSalaElemento = document.getElementById('numero-codigo');
    if (codigoSalaElemento && salaActual) {
        codigoSalaElemento.textContent = salaActual;
    }
    // Verifica que salaActual no sea null o undefined antes de continuar
    if (!salaActual) {
        console.error("Código de sala no disponible.");
        return; // Detiene la ejecución si no hay un código de sala
    }

    // Enviar mensaje WebSocket con el código de sala
    sendWebSocketMessage({
        action: 'solicitar_jugadores',
        codigoSala: salaActual
    });

    if (nombreUsuario && jugadores.length === 0) {
        const nuevoJugador = { username: nombreUsuario, avatar: avatar };
        actualizarJugadores(nuevoJugador);
    }

    // Inicializar el sistema de audio
    audioSystem = new SajuroAudioSystem(socket, salaActual);

    // Verificar si el usuario es admin (anfitrión)
    const usuarioId = localStorage.getItem('usuarioId');
    const response = await fetch('http://localhost/sajuro/sajuronoche/multijugador/crear/php/verificar-admin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            codigoSala: salaActual,
            id_usuario: usuarioId
        })
    });
    const data = await response.json();
    const isAdmin = data.isAdmin;

    await audioSystem.initialize(isAdmin);
}


// En el evento de cierre de la ventana
window.addEventListener('beforeunload', () => {
    if (audioSystem) {
        audioSystem.cleanup();
    }
});

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
    console.log("Mensaje recibido del servidor:", data); // Registra los mensajes entrantes

    switch (data.action) {
        case 'jugador_unido':
            if (data.codigoSala === salaActual) {
                const nuevoJugador = {
                    username: data.nombreUsuario,
                    avatar: data.avatar || '../../menu/css/img/avatar.png'
                };
                actualizarJugadores(nuevoJugador);
                actualizarYMostrarLimite(data);
            }
            break;
        
        case 'lista_jugadores':
            if (data.codigoSala === salaActual) {
                // Reemplazar completamente la lista de jugadores
                jugadores = data.jugadores.map(jugador => ({
                    ...jugador,
                    codigoSala: salaActual
                }));

                localStorage.setItem('jugadores', JSON.stringify(jugadores));
                mostrarJugadores(jugadores);
            }
            break;         
        
        case 'mensaje_chat':
            if (data.action === 'mensaje_chat' && data.codigoSala === salaActual) {
                guardarMensajeEnSessionStoragePorSala(data.codigoSala, data);
                mostrarMensajeChat(data);
            }
            break;

        case 'actualizar_rondas':
            if (data.codigoSala === salaActual) {
                const rondasElement = document.getElementById('rondas');
                if (rondasElement) {
                    rondasElement.textContent = `rondas ${data.numRondas}`;
                }
            }
            break;

        case 'actualizar_tiempo':
            if (data.codigoSala === salaActual) {
                const tiemposElement = document.getElementById('tiempo');
                if (tiemposElement) {
                    tiemposElement.textContent = `tiempo ${data.numTiempo}`;
                }
            }
            break;

        case 'actualizar_modo_juego':
            if (data.codigoSala === salaActual) {
                const modoTomado = document.querySelector('.modo-tomado');
                if (modoTomado) {
                    modoTomado.textContent = `Modo seleccionado: ${data.modo}`;
                }
            }
            break;
            case 'actualizar_limite_jugadores':
                if (data.action === 'actualizar_limite_jugadores' && data.codigoSala === salaActual) {
                    console.log(`Límite de jugadores actualizado: ${data.limite_jugadores}`);

                // Actualizar el mensaje en el HTML con el nuevo límite
                const jugadoresElement = document.getElementById('rondas');
                if (jugadoresElement) {
                    jugadoresElement.textContent = `Límite de jugadores: ${data.numJugadores}`;
                }

                // Mostrar mensaje si el límite de jugadores ha sido alcanzado
                if (data.numJugadores === 0) {
                    if (mensajeLimite) {
                        mensajeLimite.textContent = 'Límite de jugadores alcanzado. No se puede unir más jugadores.';
                    }
                } else {
                    if (mensajeLimite) {
                        mensajeLimite.textContent = '';  // Limpiar el mensaje
                    }
                }
                    }
            break;

        case 'partida_iniciada':
            if (data.codigoSala === salaActual) {
                startCountdown(); // Inicia el conteo regresivo

                setTimeout(() => {
                    window.location.href = '../juego/deportes/deportes.html?codigo=' + salaActual;
                }, 10500); // Ajusta el tiempo según la duración del conteo regresivo
            }
            break;
        case 'audio_user_joined':
            console.log('Nuevo usuario unido al audio:', data);
            break;

        case 'audio_offer':
        case 'audio_answer':
        case 'audio_ice_candidate':
            // Llama a los métodos de audioSystem correspondientes
            audioSystem.handleWebSocketMessage(event);
            break;

        default:
            console.warn("Acción desconocida en el mensaje WebSocket:", data.action);
    }
};
function startCountdown() {
    const countdownModal = document.getElementById('countdownModal');
    const countdownNumber = document.getElementById('countdownNumber');
    let count = 9;

    // Mostrar el modal de cuenta regresiva
    countdownModal.style.display = 'flex';

    // Iniciar el conteo regresivo
    const countdownInterval = setInterval(() => {
        countdownNumber.textContent = count;
        countdownNumber.classList.remove('animate');
        void countdownNumber.offsetWidth;  // Forzar reflow para reiniciar la animación
        countdownNumber.classList.add('animate');

        // Cambiar a "Inicia Partida" al final
        if (count === 0) {
            countdownNumber.classList.add("final");
            
            // Iniciar la partida después de un breve retraso
            setTimeout(() => {
                countdownModal.style.display = 'none';
                // Aquí puedes redirigir a los jugadores después del conteo
                window.location.href = '../juego/deportes/deportes.html?codigo=' + salaActual;
            }, 500);

            clearInterval(countdownInterval);
        }

        count--;
    }, 1000);
}

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
            const usuarioId = localStorage.getItem('usuarioId');
            const nombreUsuario = localStorage.getItem('nombreUsuario');
            const avatar = localStorage.getItem('avatar')

            try {
                const response = await fetch('http://localhost/sajuro/sajuronoche/multijugador/crear/php/crear-sala.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        codigoSala: codigoSala,
                        id_anfitrion: usuarioId
                    })
                });

                const data = await response.json();

                if (data.status === 'success') {
                    salaActual = codigoSala;
                    const nuevoJugador = {
                        username: nombreUsuario,
                        avatar: avatar  
                    };

                    jugadores = [nuevoJugador];

                    sendWebSocketMessage({
                        action: 'sala_creada',
                        codigoSala: codigoSala,
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
            const usuarioId = localStorage.getItem('usuarioId');
            const nombreUsuario = localStorage.getItem('nombreUsuario');
    
            if (!codigoSala) {
                console.error('Por favor, ingresa un código de sala válido.');
                return;
            }
    
            try {
                // Comprobar si el límite de jugadores está establecido
                const responseLimite = await fetch(`http://localhost/sajuro/sajuronoche/multijugador/unirse/php/obtener_limite.php?codigoSala=${codigoSala}`);
                const limiteData = await responseLimite.json();
                const salaLlena = document.getElementById('salaLlena');          
                const establecerLimite = document.getElementById('establecerLimite');          
                // Verificar si la respuesta contiene un error
                if (limiteData.tipo_error === 'sala_llena') {
                    salaLlena.textContent = limiteData.mensaje;
                    salaLlena.style.display = 'block'
                    setTimeout( ( )=> {
                        salaLlena.style.display = 'none'
                    }, 5000);
                    return;
                }
                
                // Verificar si el límite de jugadores está establecido y si la sala está llena
                if (limiteData.tipo_error === 'limite_no_definido') {
                    establecerLimite.textContent = limiteData.mensaje;
                    establecerLimite.style.display = 'block'
                    setTimeout( ( )=> {
                        establecerLimite.style.display = 'none'
                    }, 5000);
                    return;
                }
                
    
                // Validar si el número de jugadores es menor que el límite
                const response = await fetch('http://localhost/sajuro/sajuronoche/multijugador/unirse/php/unirse-sala.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        codigoSala: codigoSala,
                        id_usuario: usuarioId
                    })
                });
    
                const data = await response.json();
    
                if (data.status === 'error') {
                    alert(data.mensaje);  // Mostrar el mensaje de error si la sala está llena
                    return;
                }
    
                if (data.status === 'success') {
                    salaActual = codigoSala;
    
                    sendWebSocketMessage({
                        action: 'jugador_unido',
                        codigoSala: codigoSala,
                        nombreUsuario: nombreUsuario,
                        avatar: localStorage.getItem('avatar') // Añade esta línea
                    });
    
                    window.location.href = `./esperando.html?codigo=${codigoSala}`;
                }
            } catch (error) {
                console.error('Error al unirse a la sala:', error);
            }
        });
    }
    
    document.getElementById('message').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') { // Verifica si la tecla presionada es Enter
            const messageInput = document.getElementById('message');
            const nombreUsuario = localStorage.getItem('nombreUsuario');
            const message = messageInput.value.trim();
            const codigoSala = salaActual;
            if (message) {
                // Enviar el mensaje al servidor WebSocket
                socket.send(JSON.stringify({
                    action: 'mensaje_chat',
                    nombreUsuario: nombreUsuario, // Ajusta esto según el nombre de usuario que uses
                    mensaje: message,
                    codigoSala : codigoSala
                }));
                messageInput.value = ''; // Limpia el campo de entrada de texto
                console.log('mensaje', message);
            }
        }
    });  
    // Agregar evento para el botón Send
    document.getElementById('send').addEventListener('click', () => {
        const messageInput = document.getElementById('message');
        const nombreUsuario = localStorage.getItem('nombreUsuario');
        const message = messageInput.value.trim();
        const codigoSala = salaActual;
        if (message) {
            // Enviar el mensaje al servidor WebSocket
            socket.send(JSON.stringify({
                action: 'mensaje_chat',
                nombreUsuario: nombreUsuario, // Ajusta esto según el nombre de usuario que uses
                mensaje: message,
                codigoSala: codigoSala // Agregar código de sala
            }));
            messageInput.value = ''; // Limpia el campo de entrada de texto
            console.log('mensaje', message);
        }
    });      
});
const urlParams = new URLSearchParams(window.location.search);

if (salaActual) {
    sessionStorage.setItem('codigoSala', salaActual); // Guarda sala en sessionStorage
}

window.addEventListener('load', function() {
    const salaActual = urlParams.get('codigo') || sessionStorage.getItem('codigoSala') || null;
    if (!salaActual) {
        console.error('No se ha definido una sala actual. No se pueden cargar los mensajes.');
        return;
    }
    console.log('Cargando mensajes al iniciar la página para sala:', salaActual);
    cargarMensajesDeSessionStoragePorSala(salaActual);
});

function obtenerCodigoSala() {
    const inputs = document.querySelectorAll('.codigo-ingreso');
    return Array.from(inputs).map(input => input.value).join('');
}
function mostrarMensajeChat(data) {
    const chatContainer = document.querySelector('.messages');
    if (chatContainer) {
        const mensajeElemento = document.createElement('div');
        const mensajeElemento2 = document.createElement('div');
        const nombreUsuarioActual = localStorage.getItem('nombreUsuario');

        // Diferenciar entre mensajes propios y ajenos
        if (data.nombreUsuario === nombreUsuarioActual) {
            mensajeElemento.className = 'usuario';
            mensajeElemento.textContent = `Tú:`;
            mensajeElemento2.className = 'contenidoUsuario';
            mensajeElemento2.textContent = `${data.mensaje}`;
        } else {
            mensajeElemento.className = 'cliente';
            mensajeElemento.textContent = `${data.nombreUsuario}:`;
            mensajeElemento2.className = 'contenidoCliente';
            mensajeElemento2.textContent = `${data.mensaje}`;
        }

        chatContainer.appendChild(mensajeElemento);
        chatContainer.appendChild(mensajeElemento2);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Desplaza hacia abajo automáticamente
    } else {
        console.error("No se encontró el contenedor de mensajes en el HTML.");
    }
}
function cargarMensajesDeSessionStoragePorSala(codigoSala) {
    const salas = JSON.parse(sessionStorage.getItem('mensajesPorSala')) || {};
    const mensajes = salas[codigoSala] || [];
    
    console.log('Mensajes encontrados para sala:', codigoSala, mensajes);

    mensajes.forEach(mensaje => {
        mostrarMensajeChat(mensaje);
    });
}



function guardarMensajeEnSessionStoragePorSala(codigoSala, mensaje) {
    // Recuperar el objeto de salas almacenado, o crear uno vacío si no existe
    let salas = JSON.parse(sessionStorage.getItem('mensajesPorSala')) || {};

    // Si no existe la sala en el objeto, inicializarla con un array vacío
    if (!salas[codigoSala]) {
        salas[codigoSala] = [];
    }

    // Agregar el mensaje a la sala correspondiente
    salas[codigoSala].push(mensaje);

    // Guardar el objeto actualizado en sessionStorage
    sessionStorage.setItem('mensajesPorSala', JSON.stringify(salas));
    console.log('Mensajes guardados para sala', codigoSala, ':', salas[codigoSala]);
}



const jugadorUno = document.getElementById('rondas-1-2');
const jugadorDos = document.getElementById('rondas-2-4');
const jugadorTres = document.getElementById('rondas-4-6');

const player = [jugadorUno, jugadorDos, jugadorTres];

const mensajeLimite = document.getElementById('mensaje-limite');  // Elemento para mostrar el mensaje

player.forEach(jugador => {
    jugador.addEventListener('click', async () => {
        // Desmarcar cualquier selección previa
        player.forEach(j => {
            j.style.backgroundColor = ''; 
        });

        // Marcar la opción seleccionada
        jugador.style.backgroundColor = '#c19a67';

        console.log(`Límite de jugadores seleccionado: ${jugador.id}`);

        // Obtener el número de jugadores desde el atributo `data-jugadores`
        const numJugadores = parseInt(jugador.getAttribute('data-jugadores'));

        // Mostrar la selección en pantalla
        const jugadoresElement = document.getElementById('rondas');
        const codigoSala = salaActual;
        if (jugadoresElement) {
            jugadoresElement.textContent = `Límite de jugadores: ${numJugadores}`;
        }

        // Actualizar el límite de jugadores en la base de datos y mostrarlo en HTML
        try {
            await actualizarYMostrarLimite(salaActual, numJugadores); // Llamamos a una sola función
        } catch (error) {
            console.error('Error al actualizar y mostrar el límite:', error);
        }
        sendWebSocketMessage({
            action: 'actualizar_limite_jugadores',
            codigoSala: codigoSala,
            numJugadores: numJugadores
        });
    });
});

const actualizarYMostrarLimite = async (codigoSala, limiteJugadores) => {
    try {
        // Actualizar el límite de jugadores en la base de datos
        const response = await fetch('http://localhost/Sajuro/sajuronoche/multijugador/php/actualizar-limite.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'actualizar_limite',
                codigoSala: codigoSala,
                limite_jugadores: limiteJugadores
            })
        });
        const data = await response.json();
        console.log(data.message);

        // Ahora que se actualizó el límite, obtenemos el límite actualizado
        if (data.status === 'success') {
            const jugadoresElement = document.getElementById('rondas');
            if (jugadoresElement) {
                jugadoresElement.textContent = `Límite de jugadores: ${data.limiteJugadores}`;
            }

            // Mostrar el mensaje si el límite ha sido alcanzado
            if (limiteJugadores > 0) {
                if (mensajeLimite) {
                    mensajeLimite.textContent = '';  // Limpiar cualquier mensaje previo
                }
            } else {
                if (mensajeLimite) {
                    mensajeLimite.textContent = 'Límite de jugadores alcanzado. No se puede unir más jugadores.';
                }
            }
        } else {
            console.error(data.message);
        }
    } catch(error) {
        console.error('Error al actualizar el límite:', error );
    }
};
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
        codigoSala: salaActual,
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
    const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
    const IniciarJugadores = document.getElementById('IniciarJugadores')
    // Verificar si hay al menos 2 jugadores
    if (jugadores.length < 2) {
        IniciarJugadores.textContent = 'Necesitas al menos 2 jugadores para iniciar la partida.'
        IniciarJugadores.style.display = 'block'
        setTimeout( ( )=> {
            IniciarJugadores.style.display = 'none'
        }, 5000);
        return;
    }

    const codigoSala = urlParams.get('codigo');
    if (codigoSala) {
        sendWebSocketMessage({
            action: 'iniciar_partida',
            codigoSala: codigoSala
        });
    } else {
        console.error('Código de sala no encontrado');
    }
});


