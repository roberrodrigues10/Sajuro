// Obtiene el botón con el id 'expulsar'
const expulsar = document.getElementById('expulsar');

// Obtiene todos los elementos con la clase 'contenido-usuarios'
const usuariosContainers = document.querySelectorAll('.contenido-usuarios');

// Evento para el botón "Expulsar"
expulsar.addEventListener('click', () => {
    usuariosContainers.forEach(container => {
        const usernameElement = container.querySelector('.username-multi');
        if (usernameElement) {
            if (usernameElement.textContent === 'X') {
                usernameElement.textContent = 'username';
                usernameElement.classList.remove('x');
            } else {
                usernameElement.textContent = 'X';
                usernameElement.classList.add('x');
            }
        }
    });

    if (expulsar.textContent === 'expulsar') {
        expulsar.textContent = 'cambiar';
        expulsar.style.backgroundColor = '#3e301d';
    } else {
        expulsar.textContent = 'expulsar';
        expulsar.style.backgroundColor = ''; 
    }
});

// Evento para eliminar jugadores individuales
usuariosContainers.forEach(container => {
    const usernameElement = container.querySelector('.username-multi');
    if (usernameElement) {
        usernameElement.addEventListener('click', function() {
            if (this.textContent === 'X') {
                container.remove();
            }
        });
    }
});