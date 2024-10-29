export function mostrarJugadores(jugadores) {
    const contenedorUsuarios = document.querySelector('.contenido-usuarios-lista'); 

    if (!contenedorUsuarios) {
        console.error("El contenedor de usuarios no se encuentra en el DOM.");
        return;
    }

    contenedorUsuarios.innerHTML = ''; // Limpia el contenedor

    jugadores.forEach(jugador => {
        const jugadorDiv = document.createElement('div');
        jugadorDiv.classList.add('contenido-usuarios-lista');

        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('imagen-usuario');
        const avatarImg = document.createElement('img');
        avatarImg.src = jugador.avatar || '../../menu/css/img/avatar.png'; 
        avatarImg.alt = 'Avatar';
        avatarImg.classList.add('imgUsuariounirse');
        avatarImg.width = 100;
        avatarDiv.appendChild(avatarImg);

        const usernameDiv = document.createElement('div');
        usernameDiv.classList.add('username-multi');
        usernameDiv.textContent = jugador.username;

        jugadorDiv.appendChild(avatarDiv);
        jugadorDiv.appendChild(usernameDiv);
        contenedorUsuarios.appendChild(jugadorDiv); 
    });
}
