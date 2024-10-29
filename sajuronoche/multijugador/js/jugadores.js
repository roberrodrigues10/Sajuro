export function mostrarJugadores(jugadores) {
    // Verifica que el contenedor exista
    const contenedorUsuarios = document.getElementById('contenido-usuarios-lista'); // Usa getElementById para buscar por ID

    // Si el contenedor no existe, loguea un error y sal de la función
    if (!contenedorUsuarios) {
        console.error("El contenedor de usuarios no se encuentra en el DOM.");
        return;
    }

    // Limpiar lista antes de agregar
    contenedorUsuarios.innerHTML = ''; // Limpia el contenedor

    jugadores.forEach(jugador => {
        // Crear el elemento contenedor del jugador
        const jugadorDiv = document.createElement('div');
        jugadorDiv.classList.add('contenido-usuarios-lista');
        
        // Crear el elemento para la imagen del avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('imagen-usuario');
        const avatarImg = document.createElement('img');
        avatarImg.src = jugador.avatar || '../../menu/css/img/avatar.png'; // Usar el avatar o una imagen predeterminada
        avatarImg.alt = 'Avatar';
        avatarImg.classList.add('imgUsuariounirse');
        avatarImg.width = 100;
        avatarDiv.appendChild(avatarImg);
        
        // Crear el elemento para el nombre de usuario
        const usernameDiv = document.createElement('div');
        usernameDiv.classList.add('username-multi');
        usernameDiv.textContent = jugador.username;
        
        // Agregar los elementos al contenedor del jugador
        jugadorDiv.appendChild(avatarDiv);
        jugadorDiv.appendChild(usernameDiv);
        
        // Agregar el contenedor del jugador a la lista
        contenedorUsuarios.appendChild(jugadorDiv); // Cambiado de contenidoUsuariosLista a contenedorUsuarios
    });
}
