// multijugador.js

const socket = new WebSocket('ws://localhost:8080'); // Cambia la URL a la de tu servidor

socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.action === 'usuario_unido') {
        agregarJugador(data.username);
    }
};

document.getElementById('crear-sala').addEventListener('click', async () => {
    const usuarioId = 1; // Cambia esto para obtener el ID del usuario actual
    const codigoSala = generarCodigoSala(); // Función que genera un código de sala único
    document.getElementById('codigo-sala').textContent = codigoSala;

    const response = await fetch('../crear/php/crear_sala.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            codigo_sala: codigoSala,
            id_anfitrion: usuarioId,
            estado: 'espera'
        })
    });

    const data = await response.json();
    if (data.success) {
        console.log('Sala creada:', data.codigo_sala);
        // Notificar a otros usuarios que un nuevo anfitrión ha creado una sala
        socket.send(JSON.stringify({
            action: 'sala_creada',
            codigo_sala: data.codigo_sala,
            username: 'TuNombre' // Cambia esto por el nombre del usuario
        }));
    } else {
        console.error('Error al crear la sala:', data.error);
    }
});

document.getElementById('unirse-sala').addEventListener('click', async () => {
    const codigoSala = document.getElementById('codigo-unirse').value;
    const usuarioId = 1; // Cambia esto para obtener el ID del usuario actual

    const response = await fetch('../unirse/php/unirse_a_sala.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            codigo_sala: codigoSala,
            id_usuario: usuarioId,
        })
    });

    const data = await response.json();
    if (data.success) {
        console.log('Unido a la sala:', data.codigo_sala);
        agregarJugador('TuNombre'); // Cambia esto por el nombre del usuario

        // Notificar a otros usuarios que este usuario se ha unido
        socket.send(JSON.stringify({
            action: 'usuario_unido',
            username: 'TuNombre' // Cambia esto por el nombre del usuario
        }));
    } else {
        console.error('Error al unirse a la sala:', data.error);
    }
});

function agregarJugador(username) {
    const jugadorDiv = document.createElement('div');
    jugadorDiv.className = 'contenido-usuarios';
    jugadorDiv.innerHTML = `
        <div class="imagen-usuario">
            <img src="../../menu/css/img/avatar.png" alt="" width="100px">
        </div>
        <div class="username-multi">${username}</div>
    `;
    document.getElementById('lista-jugadores').appendChild(jugadorDiv);
}

function generarCodigoSala() {
    return Math.random().toString(36).substring(2, 8).toUpperCase(); // Genera un código aleatorio
}
