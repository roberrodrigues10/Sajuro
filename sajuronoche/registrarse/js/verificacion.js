// Obtén el email y el token desde la URL
const params = new URLSearchParams(window.location.search);
const email = params.get('email');
const token = params.get('token');

// Función para verificar la cuenta
function verificarCuenta(email, token) {
    fetch(`php/validacion.php?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`)
        .then(response => response.json())
        .then(data => {
            const messageElement = document.getElementById('message');
            const loadingElement = document.getElementById('loading');
            const successDetails = document.getElementById('success-details');

            if (data.status === 'success') {
                messageElement.textContent = data.message;
                messageElement.classList.add('success'); // Agrega clase de éxito
                successDetails.style.display = 'block'; // Mostrar detalles de éxito

                // Redirigir tras unos segundos
                setTimeout(() => {
                    window.location.href = "../iniciosesion/iniciarsesion.php";
                }, 3000);
            } else {
                messageElement.textContent = data.message;
                messageElement.classList.add('error'); // Agrega clase de error
            }
            loadingElement.style.display = 'none'; // Oculta el mensaje de carga
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
