export function mostrarJugadores(jugadores) {
    const contenedorUsuarios = document.querySelector('.contenido-usuarios-lista'); 

    contenedorUsuarios.innerHTML = ''; // Limpia el contenedor

    // Verifica que 'jugadores' sea un array
    if (!Array.isArray(jugadores)) {
        console.error('Se esperaba un array de jugadores, pero se recibió:', jugadores);
        return;
    }

    jugadores.forEach(jugador => {
        const jugadorDiv = document.createElement('div');
        jugadorDiv.classList.add('contenido-usuarios'); // Cambia esta clase si necesits un estilo específico

        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('imagen-usuario');

        // Verifica si el jugador tiene un avatar y asigna la URL del avatar
        const avatarImg = document.createElement('img');
        avatarImg.src = jugador.avatar; // Aquí asignamos la URL del avatar desde el objeto jugador
        avatarImg.classList.add('imgUsuariounirse');
        avatarImg.width = 100;
        avatarDiv.appendChild(avatarImg);

        const usernameDiv = document.createElement('div');
        usernameDiv.classList.add('username-multi');
        usernameDiv.textContent = jugador.username; // Muestra el nombre del jugador

        jugadorDiv.appendChild(avatarDiv);
        jugadorDiv.appendChild(usernameDiv);
        contenedorUsuarios.appendChild(jugadorDiv); 
    });
}
