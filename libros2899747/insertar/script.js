document.getElementById('insertForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que se envíe el formulario de forma tradicional

    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;

    const data = { titulo: titulo, autor: autor };

    fetch('insert.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Indicamos que enviamos datos en formato JSON
        },
        body: JSON.stringify(data) // Convertimos el objeto a JSON
    })
    .then(response => response.json()) // Esperamos la respuesta en formato JSON
    .then(data => {
        if (data.success) {
            alert('Datos insertados correctamente!');
        } else {
            alert('Error al insertar datos: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
