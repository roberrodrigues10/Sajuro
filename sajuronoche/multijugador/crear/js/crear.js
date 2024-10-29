document.addEventListener('DOMContentLoaded', function(){
// Conectar al WebSocket
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');
};

// Función para generar un código de sala aleatorio
function generarCodigoSala() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Obtener referencias del DOM

    const crearSalaBtn = document.getElementById('crear-sala');

    if (crearSalaBtn) {
        crearSalaBtn.addEventListener('click', async () => {
            const codigoSala = generarCodigoSala();
            const usuarioId = sessionStorage.getItem('usuarioId');
            const nombreUsuario = sessionStorage.getItem('nombreUsuario');
            console.log('Código generado:', codigoSala);

            // Crear la sala en el servidor
            const response = await fetch('./crear/php/crear-sala.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    codigo_sala: codigoSala,
                    id_anfitrion: usuarioId
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
                console.log('Sala creada:', data.message);

                // Enviar el mensaje por WebSocket después de crear la sala
                socket.send(JSON.stringify({
                    action: 'sala_creada',
                    codigo_sala: codigoSala,
                    nombreUsuario: nombreUsuario
                }));

                // Mostrar al anfitrión en la sala
                mostrarJugadores([{ username: nombreUsuario }]);

                // Redirigir a crearSala.html con el código de sala como parámetro
                window.location.href = `./crear/crearSala.html?codigo=${codigoSala}`;
            } else {
                console.error('Error al crear la sala:', data.message);
            }
        });
    }

    // Actualizar el nombre del anfitrión en la interfaz
    const usernameElement = document.querySelector('.username-multi');  
    const nombreUsuario = sessionStorage.getItem('nombreUsuario');
    if (usernameElement && nombreUsuario) {
        usernameElement.textContent = nombreUsuario;
    }

    // Escuchar mensajes de WebSocket para jugadores que se unen
    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        if (data.action === 'jugador_unido') {
            // Mostrar al jugador que se unió
            mostrarJugadores([{ username: data.nombreUsuario }]);
        }
        else if (data.action === 'sala_creada') {
            // Aquí puedes manejar la lógica si deseas mostrar algo cuando la sala es creada
            console.log(`Sala creada con código: ${data.codigo_sala}`);
        }
    };


// Función para mostrar los jugadores
function mostrarJugadores(jugadores) {
    const contenedorUsuarios = document.querySelector('contenido-usuarios-lista');


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

// Obtener el código de sala de la URL y mostrarlo
const codigoSala = obtenerParametro('codigo');
const numeroCodigoElement = document.getElementById('numero-codigo');
if (numeroCodigoElement) {  
    numeroCodigoElement.textContent = codigoSala ? codigoSala : 'No se generó ningún código';
}

// Función para obtener un parámetro de la URL
function obtenerParametro(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
})
