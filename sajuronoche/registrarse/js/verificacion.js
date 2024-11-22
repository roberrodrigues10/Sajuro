// Obtén el email y el token desde la URL
const params = new URLSearchParams(window.location.search);
const email = params.get('email');
const token = params.get('token');

// Función para verificar la cuenta
function verificarCuenta(email, token) {
    // Mostrar loading
    document.getElementById('loading').style.display = 'block';

    // Validar que tengamos email y token
    if (!email || !token) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = 'Enlace de verificación inválido';
        messageElement.classList.add('error');
        document.getElementById('loading').style.display = 'none';
        return;
    }

    const url = `http://192.168.1.35/sajuro/sajuronoche/registrarse/php/validacion.php?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            const messageElement = document.getElementById('message');
            messageElement.textContent = data.message;
            messageElement.classList.add(data.status === 'success' ? 'success' : 'error');
            
            if (data.status === 'success') {
                setTimeout(() => {
                    window.location.href = '/sajuronoche/iniciosesion/iniciarsesion.html';
                }, 3000);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const messageElement = document.getElementById('message');
            messageElement.textContent = 'Error al verificar la cuenta. Por favor, intenta nuevamente.';
            messageElement.classList.add('error');
        })
        .finally(() => {
            document.getElementById('loading').style.display = 'none';
        });
}

// Verificar que tenemos los parámetros necesarios antes de llamar a la función
if (email && token) {
    verificarCuenta(email, token);
} else {
    const messageElement = document.getElementById('message');
    messageElement.textContent = 'Enlace de verificación inválido';
    messageElement.classList.add('error');
    document.getElementById('loading').style.display = 'none';
}