import { mostrarJugadores } from '../../js/jugadores.js';

document.addEventListener("DOMContentLoaded", function () {
    const socket = new WebSocket('ws://localhost:8080');
    let jugadores = [];

    socket.onopen = () => {
        console.log('Conectado al servidor WebSocket');
    };

    // Obtener el código de sala a partir de los inputs
    function obtenerCodigoSala() {
        const inputs = document.querySelectorAll('.codigo-ingreso');
        let codigoSala = '';
        inputs.forEach(input => {
            codigoSala += input.value; // Concatenar el valor de cada input
        });
        return codigoSala;
    }

    // Evento para el botón de "Unirse a sala"
    const unirseSalaBtn = document.getElementById('unirse-sala');
    if (unirseSalaBtn) {
        unirseSalaBtn.addEventListener('click', async () => {
            const codigoSala = obtenerCodigoSala();
            const usuarioId = sessionStorage.getItem('usuarioId');
            const nombreUsuario = sessionStorage.getItem('nombreUsuario');

            if (!codigoSala) {
                console.error('Por favor, ingresa un código de sala válido.');
                return; // Detener la ejecución si no hay código de sala
            }

            const response = await fetch('http://localhost/Sajuro/sajuronoche/multijugador/unirse/php/unirse-sala.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    codigo_sala: codigoSala,
                    id_usuario: usuarioId
                })
            });

            const data = await response.json();
            console.log(data); // Para depurar la respuesta del servidor
            if (data.status === 'success') {
                // Muestra todos los jugadores en la interfaz
                mostrarJugadores(data.jugadores);

                // Envía el nuevo jugador al WebSocket
                socket.send(JSON.stringify({
                    action: 'jugador_unido',
                    codigo_sala: codigoSala,
                    nombreUsuario: nombreUsuario
                }));

                // Redirige a sala de espera
                window.location.href = `./esperando.html?codigo=${codigoSala}`;
            } else {
                console.error('Error al unirse a la sala:', data.message);
            }
        });
    }

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log('Mensaje recibido por WebSocket:', data);

        if (data.action === 'jugador_unido') {
            if (!jugadores.some(jugador => jugador.username === data.nombreUsuario)) {
                jugadores.push({ username: data.nombreUsuario, avatar: '../../menu/css/img/avatar.png' });
                console.log("Jugador agregado:", { username: data.nombreUsuario, avatar: '../../menu/css/img/avatar.png' });
                mostrarJugadores(jugadores); // Actualizar la lista de jugadores
            } else {
                console.log("El jugador ya está en la lista:", data.nombreUsuario);
            }
        }
    };

    // Obtener y mostrar el código de la sala desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const codigoSala = urlParams.get('codigo');
    const codigoSalaElemento = document.getElementById('numero-codigo');
    if (codigoSalaElemento) {
        codigoSalaElemento.textContent = codigoSala; // Mostrar el código de la sala
    }
});
