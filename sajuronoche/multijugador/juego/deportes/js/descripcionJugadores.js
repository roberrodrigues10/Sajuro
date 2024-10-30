document.addEventListener('DOMContentLoaded', function() {
    const jugadores = document.querySelectorAll('.colorGeneraljugador');
    let tiempoPorJugador = 800; // 6.8 segundos por cada jugador
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

        // Mostrar la descripción
        descripcion.style.display = 'block';

        // Posicionar la descripción cerca del jugador
        const rect = jugador.getBoundingClientRect();
        descripcion.style.left = rect.left + 10 + 'px';
        descripcion.style.top = rect.top + 10 + 'px';

        console.log(`Mostrando jugador ${id} por 6.8 segundos`);

        // Después de 6.8 segundos, ocultar la descripción y mostrar el siguiente jugador
        setTimeout(() => {
            descripcion.style.display = 'none';
            console.log(`Ocultando jugador ${id}`);
            // Incrementar el índice y pasar al siguiente jugador
            mostrarJugador(indice + 1);
        }, tiempoPorJugador);
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