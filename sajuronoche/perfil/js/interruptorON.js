document.addEventListener('DOMContentLoaded', () => {
    const onImage = document.getElementById('ON');
    const offImage = document.getElementById('OFF');

    // Recuperar el estado del usuario al cargar la página
    fetch('./php/obtenerEstado.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Ajustar imágenes según el estado recuperado
                if (data.estado === 'En línea') {
                    onImage.style.display = 'flex'; // Ocultar ON
                    offImage.style.display = 'none'; // Ocultar OFF
                } else {
                    onImage.style.display = 'none'; // Ocultar ON
                    offImage.style.display = 'flex'; // Mostrar OFF
                }
            } else {
                console.error('Error al recuperar el estado:', data.message);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });

    // Evento al hacer clic en la imagen ON
    onImage.addEventListener('click', () => {
        actualizarEstado('Desconectado');
        onImage.style.display = 'none'; // Ocultar ON
        offImage.style.display = 'flex'; // Mostrar OFF
    });

    // Evento al hacer clic en la imagen OFF
    offImage.addEventListener('click', () => {
        actualizarEstado('En línea');
        onImage.style.display = 'flex'; // Ocultar ON
        offImage.style.display = 'none'; // Mostrar OFF
    });

    // Función para actualizar el estado en la base de datos
    function actualizarEstado(estado) {
        fetch('./php/actualizarEstado.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: estado }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Estado actualizado a:', estado);
                } else {
                    console.error('Error al actualizar el estado:', data.message);
                }
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
            });
    }
});
