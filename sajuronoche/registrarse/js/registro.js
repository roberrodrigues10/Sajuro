
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

<<<<<<< HEAD
    // Mostrar un mensaje o indicador de carga (opcional)
    mensajeLogin.textContent = 'Procesando registro...';

    fetch('https://0d1c-2803-1800-1367-b5e0-6896-a6d7-5a0b-7734.ngrok-free.app/Sajuro/sajuronoche/registrarse/php/registro.php', {
=======
    fetch('https://c810-177-74-204-178.ngrok-free.app/sajuro-1/sajuronoche/registrarse/php/registro.php', {
>>>>>>> d93dd071288014ce35bf7072b6497e81c03db476
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json' // Asegúrate de que la respuesta sea JSON
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }

        // Vamos a imprimir la respuesta en texto primero para comprobar que sea JSON válido
        return response.text().then(text => {
            console.log('Respuesta recibida en texto:', text);

            try {
                return JSON.parse(text); // Intentamos convertir la respuesta a JSON
            } catch (error) {
                throw new Error('Respuesta no es JSON válido: ' + text);
            }
        });
    })
    .then(data => {
        console.log(data); // Mostrar la respuesta en la consola para depuración

        if (data.status !== 'success') {
            registrarButton.disabled = false; // Habilitar el botón si hay un error
<<<<<<< HEAD

            // Mostrar los mensajes de error recibidos desde el backend
            mensajeLogin.textContent = data.formato_message || 'Error en el registro. Por favor, intenta nuevamente.';
            mensajeCorreoOusuario.textContent = data.correoUsuariomessage || '';
        } else {
            // Reiniciar el formulario y redirigir al usuario
            document.getElementById('registro-form').reset();
            window.location.href = "../../../../Sajuro/sajuronoche/iniciosesion/iniciarsesion.html"; // Redirigir a la página de inicio de sesión
=======
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
>>>>>>> d93dd071288014ce35bf7072b6497e81c03db476
        }
    })
    .catch(error => {
        console.error('Error:', error);
        registrarButton.disabled = false; // Habilitar el botón en caso de error
        mensajeLogin.textContent = 'Hubo un error en la solicitud. Intenta de nuevo más tarde.';
    });
}