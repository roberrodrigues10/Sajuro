function registrarUsuario(event) {
    event.preventDefault(); // Evitar el envío normal del formulario
    const mensajeLogin = document.getElementById('mensaje-formato');
    const mensajeCorreoOusuario = document.getElementById('mensaje-correoOusuario');
    const formData = new FormData(document.getElementById('registro-form'));
    const registrarButton = document.getElementById('registrar-button');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Desactivar el botón de registro para evitar múltiples clics
    registrarButton.disabled = true;
    loadingIndicator.style.display = 'block'; // Mostrar indicador de carga

    // Limpiar mensajes anteriores
    mensajeLogin.textContent = '';
    mensajeCorreoOusuario.textContent = '';

    fetch('php/registro.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la red');
        }
        return response.json(); // Intentar convertir la respuesta en JSON
    })
    .then(data => {
        loadingIndicator.style.display = 'none'; // Ocultar el indicador de carga
        registrarButton.disabled = false; // Rehabilitar el botón en caso de error

        if (data.status !== 'success') {
            mensajeLogin.textContent = data.formato_message;
            mensajeCorreoOusuario.textContent = data.correoUsuariomessage;
        } else {
            document.getElementById('registro-form').reset(); // Reiniciar el formulario
            window.location.href = "../iniciosesion/iniciarsesion.php"; // Redirigir
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mensajeLogin.textContent = 'Ocurrió un error. Inténtalo de nuevo.';
        loadingIndicator.style.display = 'none'; // Ocultar el indicador de carga
        registrarButton.disabled = false; // Habilitar el botón
    });
}
