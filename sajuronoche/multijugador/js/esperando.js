import { mostrarJugadores } from './jugadores.js';

    const socket = new WebSocket('ws://localhost:8080');
    let jugadores = [];

    socket.onopen = () => {
        console.log('Conectado al servidor WebSocket esperando');

        // Obtener el ID del usuario desde alguna fuente, como un cookie o un API
        const id_usuario = getUserId(); // Implementa esta función para obtener el ID del usuario

        // Obtener y mostrar el código de la sala desde la URL
        const urlParams = new URLSearchParams(window.location.search);
        const codigoSala = urlParams.get('codigo');
        const codigoSalaElemento = document.getElementById('numero-codigo');
        if (codigoSalaElemento) {
            codigoSalaElemento.textContent = codigoSala; // Mostrar el código de la sala
        }

        // Enviar un mensaje al servidor para unirse a la sala
        const mensaje = {
            action: 'unirse_sala',
            codigo_sala: codigoSala,
            id_usuario: id_usuario // Asegúrate de que el ID del usuario esté disponible
        };
        socket.send(JSON.stringify(mensaje));
    };

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log('Mensaje recibido en esperando.js web socket:', data); // Esto debería mostrar todos los mensajes que llegan
    
        if (data.action === 'jugador_unido') {
            if (!jugadores.some(jugador => jugador.username === data.nombreUsuario)) {
                jugadores.push({ username: data.nombreUsuario, avatar: '../../menu/css/img/avatar.png' });
                mostrarJugadores(jugadores); // Actualiza la lista de jugadores en la interfaz
            }
            console.log(mostrarJugadores)
        }
    
        if (data.action === 'sala_creada') {
            // Agregar el anfitrión a la lista de jugadores
            if (!jugadores.some(jugador => jugador.username === data.nombreUsuario)) {
                jugadores.push({ username: data.nombreUsuario, avatar: '../../menu/css/img/avatar.png' });
                mostrarJugadores(jugadores); // Actualiza la lista de jugadores en la interfaz
            }
            console.log(`Sala creada por ${data.nombreUsuario} con código: ${data.codigo_sala}`);
        }
    };

    socket.onerror = (error) => {
        console.error('Error en el WebSocket:', error);
    };

    const nombreUsuario = sessionStorage.getItem('nombreUsuario');
    if (nombreUsuario) {
        jugadores.push({ username: nombreUsuario, avatar: '../../menu/css/img/avatar.png' });
    }
    mostrarJugadores(jugadores);


// Implementa una función para obtener el ID del usuario
function getUserId() {
    // Puedes usar cookies, localStorage, o hacer una llamada API para obtener el ID del usuario
    return 1; // Cambia esto según tu lógica
}
