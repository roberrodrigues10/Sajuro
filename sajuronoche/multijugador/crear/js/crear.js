document.addEventListener('DOMContentLoaded', () => {
    // Conectar al WebSocket
    const socket = new WebSocket('ws://localhost:8080'); // Cambia la URL a la de tu servidor

    socket.onopen = () => {
        console.log('Conectado al servidor WebSocket');
    };

    // Función para generar un código de sala aleatorio
    function generarCodigoSala() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    function mostrarJugadores(jugadores) {
        const listaJugadores = document.getElementById('lista-jugador');
        if (!listaJugadores) {
            console.error("Elemento con id 'lista-jugador' no encontrado.");
            return;
        }

        listaJugadores.innerHTML = ''; // Limpia la lista antes de mostrar

        // Verifica si se están pasando jugadores
        if (jugadores.length === 0) {
            console.warn('No hay jugadores para mostrar');
            return;
        }

        jugadores.forEach(jugador => {
            const jugadorElemento = document.createElement('div');
            jugadorElemento.className = 'contenido-usuarios';
            jugadorElemento.innerHTML = `
            <div class="imagen-usuario">
                <img src="../../menu/css/img/avatar.png" alt="Avatar" width="100px">
            </div>
            <div class="username-multi">${jugador.nombre}</div>
            `;

            listaJugadores.appendChild(jugadorElemento);
        });
    }

    // Lógica para crear la sala y mostrar el código generado
    const crearSalaBtn = document.getElementById('crear-sala');
    if (crearSalaBtn) {
        crearSalaBtn.addEventListener('click', async () => {
            const codigoSala = generarCodigoSala(); // Genera el código de sala
            console.log('Código generado:', codigoSala);

            // Obtener el ID del anfitrión desde sessionStorage
            const usuarioId = sessionStorage.getItem('usuarioId');
            const nombreUsuario = sessionStorage.getItem('nombreUsuario');

            // Aquí puedes incluir la lógica para enviar el código al servidor
            const response = await fetch('./crear/php/crear-sala.php', { // Cambia esta ruta según tu estructura
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    codigo_sala: codigoSala,
                    nombreUsuario: nombreUsuario,
                    id_anfitrion: usuarioId, // Obtener el ID del anfitrión desde sessionStorage
                    estado: 'espera'
                })
            });

            const responseText = await response.text();
            console.log('Respuesta del servidor:', responseText); // Muestra la respuesta en consola

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (error) {
                console.error('Error al parsear JSON:', error);
                return; // Salir si no se puede parsear
            }

            if (data.status === 'success') {
                console.log('Sala creada:', data.message); // Mensaje de éxito

                // Enviar el mensaje por WebSocket después de crear la sala
                socket.send(JSON.stringify({
                    action: 'sala_creada',
                    codigo_sala: codigoSala, // Usar el código generado aquí
                    usuarioId: usuarioId,
                    nombreUsuario: nombreUsuario
                }));

                mostrarJugadores([{ nombre: nombreUsuario }]);

                // Redirigir a crearSala.html con el código de sala como parámetro
                window.location.href = `./crear/crearSala.html?codigo=${codigoSala}`;
            } else {
                console.error('Error al crear la sala:', data.message); // Mensaje de error
            }
        });
    }

    // Función para obtener un parámetro de la URL
    function obtenerParametro(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Obtener el código de sala de la URL y mostrarlo
    const codigoSala = obtenerParametro('codigo');
    const numeroCodigoElement = document.getElementById('numero-codigo');
    if (numeroCodigoElement) {
        numeroCodigoElement.textContent = codigoSala ? codigoSala : 'No se generó ningún código';
    }

    socket.onmessage = event => {
        const data = JSON.parse(event.data);

        if (data.action === 'actualizar_jugadores') {
            mostrarJugadores(data.jugadores);
        }
    };
});
