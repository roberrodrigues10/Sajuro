function cerrarSesion() {
    // Primero limpiamos localStorage
    localStorage.clear();
    
    // Luego hacemos la petición al servidor para limpiar la sesión PHP
    fetch('http://172.20.10.6/sajuro/sajuronoche/iniciosesion/php/logout.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Redirigir al login solo después de que todo se haya limpiado
                window.location.href = '../iniciosesion/iniciarsesion.html';
            }
        })
        .catch(error => {
            console.error('Error al cerrar sesión:', error);
            // Redirigir de todos modos en caso de error
            window.location.href = '../iniciosesion/iniciarsesion.html';
        });
}

// Agregar el evento al botón
document.getElementById('cerrar').addEventListener('click', cerrarSesion);