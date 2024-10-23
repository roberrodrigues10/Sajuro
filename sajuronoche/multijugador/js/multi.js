// Conectar al WebSocket
const socket = new WebSocket('ws://localhost:8080'); // Cambia la URL a la de tu servidor

socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');
};

// Función para generar un código de sala aleatorio
function generarCodigoSala() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Lógica para crear la sala y mostrar el código generado
const crearSalaBtn = document.getElementById('crear-sala');
if (crearSalaBtn) {
    crearSalaBtn.addEventListener('click', async () => {
        const codigoSala = generarCodigoSala(); // Genera el código de sala
        console.log('Código generado:', codigoSala);

        // Redirigir a crearSala.html con el código de sala como parámetro
        window.location.href = `./crear/crearSala.html?codigo=${codigoSala}`; // Genera el código de sala y lo muestra en el HTML

        // Aquí puedes incluir la lógica para enviar el código al servidor si es necesario
        const response = await fetch('./crear/php/crear-sala.php', { // Cambia esta ruta según tu estructura
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                codigo_sala: codigoSala,
                id_anfitrion: usuarioId, // Este valor se obtiene de la sesión en PHP
                estado: 'espera'
            })
        });

        const data = await response.json();
        if (data.success) {
            console.log('Sala creada:', data.codigo_sala);
            socket.send(JSON.stringify({
                action: 'sala_creada',
                codigo_sala: data.codigo_sala,
                username: 'usuarioNombre' // Cambia esto por el nombre del usuario
            }));
        } else {
            console.error('Error al crear la sala:', data.error);
        }
    });
}
function obtenerParametro(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Obtener el código de sala de la URL y mostrarlo
const codigoSala = obtenerParametro('codigo');
const numeroCodigoElement = document.getElementById('numero-codigo');
if (numeroCodigoElement) {
    if (codigoSala) {
        numeroCodigoElement.textContent = codigoSala;
    } else {
        numeroCodigoElement.textContent = 'No se generó ningún código';
    }
}




// Unirse a Sala
    
    /*const unirseSalaBtn = document.getElementById('unirse-sala');
    console.log(unirseSalaBtn); // Esto mostrará el botón en la consola o 'null' si no existe

    if (unirseSalaBtn) {
        console.log("El botón existe, agregando evento click");
        unirseSalaBtn.addEventListener('click', async () => {
            const codigoSala = document.getElementById('codigo-unirse').value;
            const usuarioId = 1; // Cambia esto para obtener el ID del usuario actual

            // Petición para unirse a una sala en el servidor
            const response = await fetch('../unirse/php/unirse-sala.php', {
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

                // Notificar a otros usuarios que el usuario se unió
                socket.send(JSON.stringify({
                    action: 'usuario_unido',
                    username: 'TuNombre' // Cambia esto por el nombre del usuario
                }));
            } else {
                console.error('Error al unirse a la sala:', data.error);
            }
        });
    } else {
        console.error('El botón unirse-sala no existe');
    }
;
*/


