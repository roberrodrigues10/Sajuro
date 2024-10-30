// Ejemplo del archivo del servidor WebSocket (server.js)

const socket = new WebSocket('ws://localhost:8080');

// Almacena las salas y jugadores
let salas = {};

// Maneja nuevas conexiones
socket.on('connection', (socket) => {
    socket.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.action === 'unirse_sala') {
            handleNewPlayerJoin(data.codigo_sala, data.id_usuario, socket);
        }
    });

    socket.on('close', () => {
        // Aquí podrías implementar lógica de desconexión
        console.log('Cliente desconectado');
    });
});

// Función para manejar el ingreso de un nuevo jugador a la sala
function handleNewPlayerJoin(codigo_sala, id_usuario, socket) {
    // Inicializa la sala si no existe
    if (!salas[codigo_sala]) {
        salas[codigo_sala] = [];
    }

    // Agrega al jugador a la sala
    const jugador = { id: id_usuario, nombreUsuario: `Jugador${id_usuario}` };
    salas[codigo_sala].push(jugador);

    // Envía la lista de jugadores a todos en la sala
    const mensaje = {
        action: 'actualizar_jugadores',
        jugadores: salas[codigo_sala]
    };
    broadcastToSala(codigo_sala, JSON.stringify(mensaje));
}

// Envía un mensaje a todos los jugadores en una sala específica
function broadcastToSala(codigo_sala, mensaje) {
    socket.clients.forEach((client) => {
        if (client.readyState === socket.OPEN && salas[codigo_sala].some(j => j.socket === client)) {
            client.send(mensaje);
        }
    });
}
