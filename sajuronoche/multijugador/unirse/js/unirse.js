document.addEventListener("DOMContentLoaded", function () {
    const socket = new WebSocket('ws://localhost:8080');

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

            const response = await fetch('http://localhost/Sajuro/sajuronoche/multijugador/unirse/php/unirse-sala.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    codigo_sala: codigoSala,
                    id_usuario: usuarioId
                })
            });

            const data = await response.json();
            console.log('Respuesta del servidor:', data); // Línea de depuración para ver la respuesta

            if (data.status === 'success') {
                console.log('Te has unido a la sala:', data.message);

                // Muestra los jugadores en la interfaz, incluyendo el anfitrión
                mostrarJugadores(data.jugadores);
                mostrarAnfitrion(data.anfitrion); // Asegúrate de que el anfitrión se envíe desde el servidor

                // Envía el nuevo jugador al WebSocket
                socket.send(JSON.stringify({
                    action: 'jugador_unido',
                    codigo_sala: codigoSala,
                    nombreUsuario: nombreUsuario
                }));

                // Redirige a la sala de espera (esto puede hacerse después de mostrar la lista de jugadores)
                window.location.href = `./esperando.html?codigo=${codigoSala}`;
            } else {
                console.error('Error al unirse a la sala:', data.message);
            }
        });
    }

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Mensaje recibido:', data); // Para depuración

        if (data.action === 'jugador_unido') {
            console.log(`${data.nombreUsuario} se unió a la sala.`);
            // Agregar el nuevo jugador a la lista
            mostrarJugadores([{ nombreUsuario: data.nombreUsuario }]); // Actualiza la lista de jugadores
        } else if (data.action === 'actualizar_jugadores') {
            console.log(`Lista de jugadores en la sala ${data.codigo_sala}:`, data.jugadores);
            mostrarJugadores(data.jugadores);
        }
    };

    // Función para mostrar la lista de jugadores
    function mostrarJugadores(jugadores) {
        const contenedorUsuarios = document.querySelector('#contenido-usuarios-lista');
        console.log('Contenedor de usuarios:', contenedorUsuarios);

        if (!contenedorUsuarios) {
            console.error('El contenedor de usuarios no se encontró en el DOM.');
            return; // Sale de la función si el contenedor es null
        }

        // Limpia el contenedor antes de agregar nuevos usuarios
        contenedorUsuarios.innerHTML = '';

        // Itera sobre cada jugador en la lista y crea un nuevo elemento para mostrarlo
        jugadores.forEach(jugador => {
            const divUsuario = document.createElement('div');
            divUsuario.className = 'contenido-usuarioMover';

            const imagenUsuario = document.createElement('img');
            imagenUsuario.src = '../../menu/css/img/avatar.png';
            imagenUsuario.alt = 'Avatar';
            imagenUsuario.className = 'imgUsuariounirse';
            imagenUsuario.width = 100;

            const nombreUsuario = document.createElement('div');
            nombreUsuario.className = 'username-multi';
            nombreUsuario.textContent = jugador.nombreUsuario || "Sin nombre"; // Asegura que haya un nombre

            divUsuario.appendChild(imagenUsuario);
            divUsuario.appendChild(nombreUsuario);
            contenedorUsuarios.appendChild(divUsuario);
        });

        console.log("Jugadores mostrados en el DOM:", jugadores);
    }

    // Función para mostrar el anfitrión de la sala
    function mostrarAnfitrion(nombreAnfitrion) {
        const contenedorAnfitrion = document.querySelector('#anfitrion-sala'); // Asegúrate de tener un elemento en tu HTML para mostrar al anfitrión
        if (nombreAnfitrion) {
            contenedorAnfitrion.textContent = `Anfitrión: ${nombreAnfitrion}`; // Muestra el nombre del anfitrión
        } else {
            console.error('No se encontró el nombre del anfitrión');
        }
    }
});
