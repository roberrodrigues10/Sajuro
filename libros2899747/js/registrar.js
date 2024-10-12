function registrarUsuario(event) {
    event.preventDefault(); // Evitar el envío tradicional del formulario

    const formData = new FormData(document.getElementById('registro-form')); // Recoge los datos del formulario

    // Enviar los datos a la ruta correcta
    fetch('js/registro.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json()) // Recibe la respuesta del servidor en formato JSON
    .then(data => {
        console.log(data); // Imprimir respuesta en consola
        alert(data.message); // Mostrar mensaje de respuesta
        if (data.status === 'success') {
            document.getElementById('registro-form').reset(); // Reiniciar el formulario
        }
    })
    .catch(error => console.error('Error:', error)); // Manejar errores
}
