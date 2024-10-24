document.getElementById('enviarCodigo').addEventListener('click', function() {
    const email = document.getElementById('correo').value;

    fetch('php/solicitar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('mensaje').innerText = data.message;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('mensaje').innerText = 'Ocurrió un error al enviar el correo.';
    });
});
