function inicioSesion(event) {
    event.preventDefault(); // Evitar el envío normal del formulario

    const form = document.getElementById('iniciosesion'); // Asegúrate de que este ID sea correcto
    const messageContainer = document.getElementById('login-message'); // Asegúrate de que este ID sea correcto

    // Crear un objeto FormData a partir del formulario
    const formData = new FormData(form);

    // Imprimir el contenido del FormData en la consola
    for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }

    // Enviar los datos al servidor usando fetch
    fetch('php/validacion.php', { // Coloca aquí la ruta correcta a tu archivo PHP
        method: 'POST',
        body: formData // Enviar el objeto FormData
    })
    .then(response => response.json()) // Convertir la respuesta a JSON
    .then(data => {
        if (data.status === 'success') {
            // Si el inicio de sesión es exitoso
            messageContainer.style.color = 'green';
            messageContainer.textContent = data.message;

            // Guardar el userId en sessionStorage
            sessionStorage.setItem('usuarioId', data.usuarioId);
            sessionStorage.setItem('nombreUsuario', data.nombreUsuario);

            // Redirigir a otra página
            window.location.href = '../iniciosesion/cargando.html'; // Cambia esta ruta según sea necesario
        } else {
            // Si hubo un error (usuario o contraseña incorrectos)
            messageContainer.style.color = 'rgb(224, 183, 106)';
            messageContainer.textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messageContainer.style.color = 'rgb(224, 183, 106)';
        messageContainer.textContent = 'Hubo un error en el servidor. Inténtalo de nuevo.';
    });
}
// Cuando el usuario inicia sesión, guarda una bandera en localStorage



// Vincular la función al evento de envío del formulario
document.getElementById('iniciosesion').addEventListener('submit', inicioSesion);
