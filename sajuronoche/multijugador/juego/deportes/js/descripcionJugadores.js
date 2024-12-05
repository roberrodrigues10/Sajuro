document.addEventListener('DOMContentLoaded', function() {
    const jugadores = document.querySelectorAll('.jugadoresGeneral');
    let indiceActual = 0;

    function mostrarJugador(indice) {
        // Comprobamos si el índice ha superado el número de jugadores
        if (indice >= jugadores.length) {
            console.log('Fin de jugadores');
            iniciarJuego(); // Llama a la función para iniciar el juego
            return; // Salir si ya no quedan más jugadores
        }

        const jugador = jugadores[indice];
        const id = jugador.id;
        const descripcion = document.querySelector(`#desc-${id}`);

        // Asegúrate de que tanto el jugador como la descripción existan
        if (!jugador || !descripcion) {
            console.log(`Jugador o descripción no encontrada para id: ${id}`);
            mostrarJugador(indice + 1); // Pasar al siguiente jugador en caso de error
            return;
        }

        
    }

    // Iniciar mostrando el primer jugador
    mostrarJugador(indiceActual);
});

// Función para iniciar el juego
function iniciarJuego() {
    // Aquí debes colocar el código que inicia el juego de arrastrar y soltar.
    // Por ejemplo, puedes llamar a la función que contiene la lógica del juego.
    console.log('Iniciando el juego...');
    arrastrarSoltar(0); // Llama a la función que habilita los campos
}