// Obtén el email y el token desde la URL
const params = new URLSearchParams(window.location.search);
const email = params.get('email');
const token = params.get('token');

// Función para verificar la cuenta
function verificarCuenta(email, token) {
    fetch(`https://9d2e-2803-1800-1358-a7b0-745f-1c51-fc64-99e9.ngrok-free.app/sajuro-1/sajuronoche/registrarse/php/validacion.php?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`)
        .then(response => response.json())
        .then(data => {
            // Mostrar el mensaje correspondiente
            const messageElement = document.getElementById('message');
            if (data.status === 'success') {
                messageElement.textContent = data.message;
                messageElement.classList.add('success'); // Agrega clase de éxito
            } else {
                messageElement.textContent = data.message;
                messageElement.classList.add('error'); // Agrega clase de error
            }
            document.getElementById('loading').style.display = 'none'; // Oculta el mensaje de carga
        })
        .catch(error => {
            console.error('Error:', error);
            const messageElement = document.getElementById('message');
            messageElement.textContent = 'Ocurrió un error al verificar la cuenta.';
            messageElement.classList.add('error');
            document.getElementById('loading').style.display = 'none'; // Oculta el mensaje de carga
        });
}

// Llama a la función
verificarCuenta(email, token);