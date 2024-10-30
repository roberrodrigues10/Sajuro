import { mostrarJugadores } from '../../js/jugadores.js';

const socket = new WebSocket('ws://localhost:8080'); 
let jugadores = []; // Lista para mantener a todos los jugadores

socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');
};

function generarCodigoSala() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Botón para crear sala
const crearSalaBtn = document.getElementById('crear-sala');

if (crearSalaBtn) {
    crearSalaBtn.addEventListener('click', async () => {
        const codigoSala = generarCodigoSala();
        const usuarioId = sessionStorage.getItem('usuarioId');
        const nombreUsuario = sessionStorage.getItem('nombreUsuario');
        console.log('Código generado:', codigoSala);
        console.log('Nombre de usuario en sessionStorage:', nombreUsuario);

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
        
            // Agregar al anfitrión a la lista de jugadores
            jugadores.push({ username: nombreUsuario, avatar: '../../menu/css/img/avatar.png' });
            mostrarJugadores(jugadores);
        
            // Enviar mensaje por WebSocket
            socket.send(JSON.stringify({
                action: 'sala_creada',
                codigo_sala: codigoSala,
                nombreUsuario: nombreUsuario
            }));
        
            // Redirigir al archivo con el código de sala
            setTimeout(() => {
                window.location.href = `./crear/crearSala.html?codigo=${codigoSala}`;
            }, 1000);
        } else {
            console.error('Error al crear la sala:', data.message);
        }
    });
}

// Manejo de mensajes recibidos por WebSocket
socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log('Mensaje recibido por WebSocket:', data);

    if (data.action === 'jugador_unido') {
        // Verificar si el jugador ya está en la lista antes de añadirlo
        if (!jugadores.some(jugador => jugador.username === data.nombreUsuario)) {
            jugadores.push({ username: data.nombreUsuario, avatar: '../../menu/css/img/avatar.png' });
            mostrarJugadores(jugadores);
        }
    }
};

// Cargar la lista de jugadores al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const codigoSala = urlParams.get('codigo');
    const codigoSalaElemento = document.getElementById('numero-codigo');
    if (codigoSalaElemento) {
        codigoSalaElemento.textContent = codigoSala;
    }

    const nombreUsuario = sessionStorage.getItem('nombreUsuario');
    if (nombreUsuario) {
        jugadores.push({ username: nombreUsuario, avatar: '../../menu/css/img/avatar.png' });
    }
    mostrarJugadores(jugadores);
});
