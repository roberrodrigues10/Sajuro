function realizarTodasOperaciones() {
    fetch('libreria/autores.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // Si no necesitas enviar datos, puedes comentar o eliminar esta línea
        // body: JSON.stringify() 
    })
    .then(response => {
        // Verifica si la respuesta es correcta
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos recibidos:', data); // Para depuración
        generarTabla(data);
    })
    .catch(error => console.error('Error:', error));

    function generarTabla(autores) {
        const tabla = document.querySelector('#tabla-usuarios tbody');

        // Limpiamos el contenido previo
        tabla.innerHTML = '';
        let numero = 1;

        // Recorremos cada usuario del JSON
        autores.forEach(usuario => {
            // Creamos una fila
            const fila = document.createElement('tr');

            // Insertamos las celdas con los datos
            fila.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.usuario}</td>
                <td>${usuario.contrasena}</td>
            `;

            // Añadimos la fila a la tabla
            tabla.appendChild(fila);
            numero++;
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    realizarTodasOperaciones();
});
