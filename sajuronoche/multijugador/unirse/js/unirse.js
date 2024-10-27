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
        const codigoSala = obtenerCodigoSala(); // Obtener el código de 4 dígitos
        if (codigoSala.length !== 4) {
            alert('Por favor, ingresa un código de 4 dígitos completo.');
            return;
        }

        // Obtener el ID del jugador desde sessionStorage
        const usuarioId = sessionStorage.getItem('usuarioId');
        const nombreUsuario = sessionStorage.getItem('nombreUsuario');

        // Enviar el código de sala y el ID del jugador al servidor
        const response = await fetch('http://localhost/Sajuro/sajuronoche/multijugador/unirse/php/unirse-sala.php', { // Cambia esta ruta según tu estructura
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                codigo_sala: codigoSala,
                id_usuario: usuarioId,
                nombreUsuario: nombreUsuario
            })
        });

        const responseText = await response.text(); // Obtener el texto completo
        console.log('Respuesta del servidor:', responseText); // Muestra la respuesta en consola

        let data;
        try {
            data = JSON.parse(responseText); // Intenta convertir a JSON
        } catch (error) {
            console.error('Error al parsear JSON:', error);
            return; // Salir si no se puede parsear
        }

        if (data.status === 'success') {
            console.log('Te has unido a la sala:', data.message); // Mensaje de éxito

            // Enviar el mensaje por WebSocket después de unirse a la sala
            socket.send(JSON.stringify({
                action: 'jugador_unido',
                codigo_sala: codigoSala,
                nombreUsuario: nombreUsuario // Cambia esto por el nombre del usuario
            }));

            // Redirigir a la sala de juego
            window.location.href = `./unirse/juegoSala.html?codigo=${codigoSala}`;
        } else {
            console.error('Error al unirse a la sala:', data.message);
        }
    });
}

// WebSocket para manejar mensajes de jugadores que se unen
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.action === 'jugador_unido') {
        console.log(`${data.username} se ha unido a la sala con el código ${data.codigo_sala}`);
        // Lógica adicional para actualizar la UI o notificar a otros jugadores
    }
};


