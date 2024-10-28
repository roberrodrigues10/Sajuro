// Conectar al WebSocket
const socket = new WebSocket('ws://localhost:8080'); // Cambia la URL a la de tu servidor

socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');
};

// Obtener el código de sala a partir de los cuatro inputs
function obtenerCodigoSala() {
    const inputs = document.querySelectorAll('.codigo-ingreso');
    let codigoSala = '';
    inputs.forEach(input => {
        codigoSala += input.value; // Concatenar el valor de cada input
    });
    return codigoSala;
}

// Evento para el botón de "Ingresar" o "Unirse a sala"
const unirseSalaBtn = document.getElementById('unirse-sala');
if (unirseSalaBtn) {
    unirseSalaBtn.addEventListener('click', async () => {
        // Obtener el código de sala y el ID del usuario
        const codigoSala = obtenerCodigoSala(); // Asegúrate de obtener el código aquí
        const usuarioId = sessionStorage.getItem('usuarioId'); // Asegúrate de que esta línea esté configurada correctamente
        const nombreUsuario = sessionStorage.getItem('nombreUsuario'); // Asegúrate de que esta línea esté configurada correctamente

        // Enviar el código de sala y el ID del jugador al servidor
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

        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (error) {
            console.error('Error al parsear JSON:', error);
            return;
        }

        if (data.status === 'success') {
            console.log('Te has unido a la sala:', data.message);

            // Enviar el mensaje por WebSocket después de unirse a la sala
            socket.send(JSON.stringify({
                action: 'jugador_unido',
                codigo_sala: codigoSala,
                nombreUsuario: nombreUsuario
            }));

            // Redirigir a la sala de juego
            window.location.href = `./esperando.html?codigo=${codigoSala}`;
        } else {
            console.error('Error al unirse a la sala:', data.message);
        }
    });
}

// WebSocket para manejar mensajes de jugadores que se unen
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.action === 'jugador_unido') {
        console.log(`${data.nombreUsuario} se ha unido a la sala con el código ${data.codigo_sala}`);
        
        // Mostrar en la UI que el jugador se ha unido
        mostrarJugadores([{ username: data.nombreUsuario }]); // Actualiza la interfaz
    }
};

// Función para mostrar los jugadores
function mostrarJugadores(jugadores) {
    const contenedorUsuarios = document.getElementById('contenido-usuarios-lista');
    
    // Limpiar la lista de jugadores
    contenedorUsuarios.innerHTML = ''; // Limpia antes de agregar

    jugadores.forEach(jugador => {
        const divUsuario = document.createElement('div');
        divUsuario.className = 'contenido-usuarioMover';
        
        const imagenUsuario = document.createElement('img');
        imagenUsuario.src = '../../menu/css/img/avatar.png'; // Imagen fija para todos
        imagenUsuario.alt = 'Avatar';
        imagenUsuario.className = 'imgUsuariounirse';
        imagenUsuario.width = 100;

        const nombreUsuario = document.createElement('div');
        nombreUsuario.className = 'username-multi';
        nombreUsuario.textContent = jugador.username;

        divUsuario.appendChild(imagenUsuario);
        divUsuario.appendChild(nombreUsuario);
        contenedorUsuarios.appendChild(divUsuario);
    });
}
