function inicioSesion(event) {
    event.preventDefault();

    const form = document.getElementById('iniciosesion');
    const messageContainer = document.getElementById('login-message');
    const formData = new FormData(form);

    // Imprimir el contenido del FormData en la consola
    for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }

    fetch('http://192.168.1.35/sajuro/sajuronoche/iniciosesion/php/validacion.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            messageContainer.style.color = 'green';
            messageContainer.textContent = data.message;
            
            // Cambiar sessionStorage por localStorage aquí
            localStorage.setItem('usuarioId', data.usuarioId);
            localStorage.setItem('nombreUsuario', data.nombreUsuario);
            localStorage.setItem('avatar', data.avatar);
    
            // Redirigir a la página de carga
            window.location.href = '../iniciosesion/cargando.html';
        } else {
            messageContainer.style.color = 'rgb(224, 183, 106)';
            messageContainer.textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messageContainer.style.color = 'rgb(224, 183, 106)';
        messageContainer.textContent = 'Cierra la cuenta que esta activa';
    });
}

// Vincular la función al evento de envío del formulario
document.getElementById('iniciosesion').addEventListener('submit', inicioSesion);