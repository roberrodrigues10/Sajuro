document.getElementById('restablecerBtn').addEventListener('click', function() {
    const nuevaContrasena = document.getElementById('nuevaContrasena').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;

    // Verificar que las contraseñas coinciden
    if (nuevaContrasena !== confirmarContrasena) {
        document.getElementById('mensaje-no-coindicen').innerText = 'Las contraseñas no coinciden.';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // Obtener el token de la URL
    function redirigir() {
        setTimeout(function() {
            window.location.href = '../../../../Sajuro/sajuronoche/iniciosesion/iniciarsesion.html'; // Cambia la URL a donde quieras redirigir
        }, 2000);
    }

    // Enviar la solicitud al servidor
    fetch('php/restablecer.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token, nuevaContrasena: nuevaContrasena })
    })
    .then(response => {
        console.log(response); // Para verificar la respuesta del servidor
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Error en la respuesta del servidor');
            });
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('establecio-contra').textContent = data.message;
        redirigir()
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('mensaje').innerText = 'Ocurrió un error al restablecer la contraseña: ' + error.message;
    });
});
