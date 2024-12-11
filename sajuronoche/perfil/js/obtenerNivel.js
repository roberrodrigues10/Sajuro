function obtenerNivel() {
    fetch('./php/obtenerNivel.php', {
        method: 'GET', // Método GET
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json(); // Convierte la respuesta en JSON
        })
        .then(data => {
            console.log('Datos recibidos:', data); // Verifica qué se está recibiendo

            if (data.nivel !== undefined) { // Comprobación explícita
                const nivelUsuario = data.nivel; // Asigna el nivel a la variable
                document.getElementById('nivel').textContent = nivelUsuario; // Muestra en el span
            } else if (data.error) {
                console.error('Error del servidor:', data.error);
                document.getElementById('nivel').textContent = 'Error al cargar nivel';
            } else {
                document.getElementById('nivel').textContent = 'Nivel no disponible';
            }
        })
        .catch(error => {
            console.error('Error al obtener el nivel:', error);
            document.getElementById('nivel').textContent = 'Error al cargar';
        });
}

// Llamar la función para cargar el nivel
obtenerNivel();
