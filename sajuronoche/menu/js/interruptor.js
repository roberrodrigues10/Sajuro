    const on = document.getElementById('on');
    const off = document.getElementById('off');
    
    fetch('./php/obtenerEstado.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const on = document.getElementById('on');
            const off = document.getElementById('off');

            if (data.estado === 'En línea') {
                on.style.opacity = '1';  // Muestra la imagen "En línea"
                off.style.opacity = '0'; // Oculta la imagen "Desconectado"
            } else {
                on.style.opacity = '0';  // Oculta la imagen "En línea"
                off.style.opacity = '1'; // Muestra la imagen "Desconectado"
            }
        } else {
            console.error('Error al recuperar el estado:', data.message);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
