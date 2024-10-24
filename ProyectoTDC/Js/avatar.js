       // Función para mostrar las imágenes
       function mostrarAvatares(data) {
        console.log('Datos dentro de mostrarAvatares:', data);
        const avatarElements = document.querySelectorAll('.ContenidoAvatar1 img');
        let avatarIndex = 0;
    
        data.forEach(avatar => {
            while (avatarIndex < avatarElements.length && avatarElements[avatarIndex].id !== "") {
                avatarIndex++;
            }
    
            if (avatarIndex < avatarElements.length) {
                avatarElements[avatarIndex].src = `data:image/png;base64,${avatar.img_avatar}`;
                avatarElements[avatarIndex].alt = `Avatar ${avatar.id_avatar}`;
            }
    
            avatarIndex++;
        });
    }    

// Hacer una solicitud fetch para obtener los avatares desde el archivo PHP
fetch('../php/avatar.php')  // Cambia esto a la ruta de tu archivo PHP
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos recibidos:', data);  // Verifica los datos recibidos en la consola

        if (data.avatares && data.avatares.length > 0) {
            mostrarAvatares(data.avatares);
        } else {
            console.error('No se encontraron avatares en los datos.');
        }
    })
    .catch(error => {
        console.error('Error al obtener los avatares:', error);
    });