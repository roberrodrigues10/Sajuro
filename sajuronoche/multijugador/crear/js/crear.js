import { mostrarJugadores } from '../../js/jugadores.js';

const socket = new WebSocket('ws://localhost:8080'); 
let jugadores = []; // Lista para mantener a todos los jugadores

socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');
};

function generarCodigoSala() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

const crearSalaBtn = document.getElementById('crear-sala');

if (crearSalaBtn) {
    crearSalaBtn.addEventListener('click', async () => {
        const codigoSala = generarCodigoSala();
        const usuarioId = sessionStorage.getItem('usuarioId');
        const nombreUsuario = sessionStorage.getItem('nombreUsuario');
        console.log('Código generado:', codigoSala);
        console.log('Nombre de usuario en sessionStorage:', nombreUsuario); // Verificar

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
        console.log('Respuesta del servidor:', responseText); // Agregado para ver la respuesta
        
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
        
            // Enviar el mensaje por WebSocket después de crear la sala
            socket.send(JSON.stringify({
                action: 'sala_creada',
                codigo_sala: codigoSala,
                nombreUsuario: nombreUsuario
            }));
        
            setTimeout(() => {
                window.location.href = `./crear/crearSala.html?codigo=${codigoSala}`;
            }, 1000);
        } else {
            console.error('Error al crear la sala:', data.message);
        }
    });
}

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log('Mensaje recibido por WebSocket:', data);

    if (data.action === 'jugador_unido') {
        if (!jugadores.some(jugador => jugador.username === data.nombreUsuario)) {
            jugadores.push({ username: data.nombreUsuario, avatar: '../../menu/css/img/avatar.png' });
            mostrarJugadores(jugadores); // Asegúrate de pasar el array 'jugadores'
        }
    }
};

// Este código debe estar fuera del event listener de "crear sala"
document.addEventListener('DOMContentLoaded', function () {
    // Obtener el código de sala de la URL y mostrarlo
    const urlParams = new URLSearchParams(window.location.search);
    const codigoSala = urlParams.get('codigo');
    const codigoSalaElemento = document.getElementById('numero-codigo');
    if (codigoSalaElemento) {
        codigoSalaElemento.textContent = codigoSala; // Mostrar el código de la sala
    }

    const nombreUsuario = sessionStorage.getItem('nombreUsuario');
    
    // Verifica que el nombre de usuario no sea nulo antes de agregarlo
    if (nombreUsuario) {
        // Agregar al anfitrión a la lista de jugadores si no está presente
        jugadores.push({ username: nombreUsuario, avatar: '../../menu/css/img/avatar.png' });
    }
    
    // Mostrar la lista de jugadores al cargar la página
    mostrarJugadores(jugadores);
});
