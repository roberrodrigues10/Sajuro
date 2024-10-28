// Conectar al WebSocket
const socket = new WebSocket('ws://localhost:8080'); // Cambia la URL a la de tu servidor

socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');
};

// Función para generar un código de sala aleatorio
function generarCodigoSala() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Lógica para crear la sala y mostrar el código generado
const crearSalaBtn = document.getElementById('crear-sala');
if (crearSalaBtn) {
    crearSalaBtn.addEventListener('click', async () => {
        const codigoSala = generarCodigoSala();
        const jugadoresNombre = ['usuario1', 'usuario2']
        console.log('Código generado:', codigoSala);

        const usuarioId = sessionStorage.getItem('usuarioId');
        const nombreUsuario = sessionStorage.getItem('nombreUsuario');
        console.log(mostrarJugadores (jugadoresNombre))

        // Crear la sala en el servidor
        const response = await fetch('./crear/php/crear-sala.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                codigo_sala: codigoSala,
                id_anfitrion: usuarioId,
                estado: 'espera',
                username: nombreUsuario
            })
            
        });
        console.log('creandose en php')

        const responseText = await response.text();
        console.log('Respuesta del servidor:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (error) {
            console.error('Error al parsear JSON:', error);
            return;
        }

        if (data.status === 'success') {
            console.log('Sala creada:', data.message);

            // Enviar el mensaje por WebSocket después de crear la sala
            socket.send(JSON.stringify({
                action: 'sala_creada',
                codigo_sala: codigoSala,
                username: nombreUsuario
            }));

            socket.send(JSON.stringify({
                action: 'actualizar_jugadores',
                jugadores: [{username: nombreUsuario}]

            }))

            // Redirigir a crearSala.html con el código de sala como parámetro
            window.location.href = `./crear/crearSala.html?codigo=${codigoSala}`;
        } else {
            console.error('Error al crear la sala:', data.message);
        }
    });
}

// Función para mostrar jugadores en la interfaz HTML
function mostrarJugadores(jugadores) {
    const listaJugadores = document.getElementById('lista-jugador');
console.log('nombre de uisuario de session storage', jugadores)
    console.log('Jugadores recibidos:', jugadores);
    jugadores.forEach(jugador => {
        const jugadorElemento = document.createElement('div');
        const nombreUsuario = jugador.username || 'Sin nombre';
        jugadorElemento.className = 'contenido-usuarios';
        jugadorElemento.innerHTML = `
            <div class="imagen-usuario">
                <img src="../../menu/css/img/avatar.png" alt="Avatar" class="imgUsuariounirse" width="100px">
            </div>
            <div class="username-multi">${jugadores}</div>
        `;
        
        listaJugadores.appendChild(jugadorElemento);
    });
    console.log('Jugadores mostrados en la interfaz:', listaJugadores.innerHTML);
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

// Escuchar mensajes del WebSocket
socket.onmessage = event => {
    const data = JSON.parse(event.data);
    console.log("Mensaje recibido del servidor:", data); 
    if (data.action === 'actualizar_jugadores') {
        mostrarJugadores(data.jugadores);
    }else {
        console.error('errorr', data)
    }
};
