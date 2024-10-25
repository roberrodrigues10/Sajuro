function registrarUsuario(event) {
    event.preventDefault(); // Evitar el envío normal del formulario
    const mensajeLogin = document.getElementById('mensaje-formato');
    const mensajeCorreoOusuario = document.getElementById('mensaje-correoOusuario');
    const mensajeError = document.getElementById('mensaje-error');
    const formData = new FormData(document.getElementById('registro-form'));
    const registrarButton = document.getElementById('registrar-button');

    // Desactivar el botón de registro para evitar múltiples clics
    registrarButton.disabled = true;

    // Limpiar mensajes anteriores
    mensajeLogin.textContent = '';
    mensajeCorreoOusuario.textContent = '';
    if (mensajeError) mensajeError.textContent = '';

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
        console.log(data); // Mostrar la respuesta en la consola para depuración

        // Rehabilitar el botón en caso de error
        if (data.status !== 'success') {
            registrarButton.disabled = false; // Habilitar el botón si hay un error
            mensajeLogin.textContent = data.formato_message;
            mensajeCorreoOusuario.textContent = data.correoUsuariomessage;
            if (data.message) {
                // Si tienes un elemento para mensajes generales
                if (mensajeError) {
                    mensajeError.textContent = data.message;
                } else {
                    // Si no hay un elemento específico, usar uno de los existentes
                    mensajeLogin.textContent = data.message;
                }
            }
        } else {
            document.getElementById('registro-form').reset(); // Reiniciar el formulario
            window.location.href = "../../../../Sajuro-1/sajuronoche/iniciosesion/iniciarsesion.html"; // Redirigir a la página deseada
        }
    })
    .catch(error => {
        console.error('Error:', error);
        registrarButton.disabled = false; // Habilitar el botón en caso de error
    });
}