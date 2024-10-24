document.addEventListener('DOMContentLoaded', function() {
    const estadoJugadorElement = document.getElementById('estadoJugador');

    function actualizarEstadoJugador() {
        const estado = localStorage.getItem('playerStatus');
        estadoJugadorElement.textContent = estado === 'ON' ? 'ON' : 'OFF';
    }

    // Actualizar el estado inicial
    actualizarEstadoJugador();

    // Escuchar cambios en el localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'playerStatus') {
            actualizarEstadoJugador();
        }
    });
})