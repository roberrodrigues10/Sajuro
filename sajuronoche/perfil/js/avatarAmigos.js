document.addEventListener('DOMContentLoaded', () => {
    // Obtener el parámetro id_usuario de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const id_usuario = urlParams.get('id_usuario');

    if (!id_usuario) {
        alert('No se especificó ningún usuario.');
        return;
    }

    // Realizar una solicitud para obtener los datos del usuario
    fetch(`./php/perfil_usuario.php?id_usuario=${id_usuario}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del usuario.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success && data.usuario) {
                // Actualizar la información en la página
                const avatarPerfil = document.querySelector('#avatarPerfil');
                const username = document.querySelector('#username');

                avatarPerfil.src = `data:image/png;base64,${data.usuario.img_avatar}`;
                username.textContent = data.usuario.nombre_usuario;
            } else {
                alert(`Error al cargar el perfil: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error al cargar el perfil del usuario:', error);
            alert('Ocurrió un error al cargar el perfil.');
        });
});

// Función para mostrar las imágenes
function mostrarAvatares(data) {
    console.log('Datos dentro de mostrarAvatares:', data);
    const avatarElements = document.querySelectorAll('.ContenidoAvatar1 img');
    
    data.forEach((avatar, index) => {
        if (index < avatarElements.length) {
            const imgElement = avatarElements[index];
            imgElement.src = `data:image/png;base64,${avatar.img_avatar}`;
            imgElement.alt = `Avatar ${avatar.id_avatar}`;
            imgElement.dataset.id = avatar.id_avatar;
            imgElement.addEventListener('click', () => seleccionarAvatar(avatar.id_avatar));
        }
    });
}

function seleccionarAvatar(idAvatar) {
    console.log('Avatar seleccionado con ID:', idAvatar);
    
    // Mostrar algún indicador de carga si lo deseas
    
    fetch('./php/actualizarAvatar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ avatar_id: idAvatar })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert(data.message);
            if (data.avatar) {
                const avatarPerfil = document.querySelector('#avatarPerfil'); // Ajusta el selector
                avatarPerfil.src = `data:image/png;base64,${data.avatar}`;
            }
        } else {
            alert(data.message || 'Error al actualizar el avatar');
        }
    })
    .catch(error => {
        console.error('Error al actualizar el avatar:', error);
        alert('Hubo un problema al procesar tu solicitud.');
    });
}

// Cargar avatares al iniciar
document.addEventListener('DOMContentLoaded', () => {
    fetch('avatar.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener los avatares');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos recibidos:', data);
        if (data.avatares && data.avatares.length > 0) {
            mostrarAvatares(data.avatares);
        } else {
            console.error('No se encontraron avatares en los datos.');
        }
    })
    .catch(error => {
        console.error('Error al obtener los avatares:', error);
        alert('Error al cargar los avatares. Por favor, recarga la página.');
    });
});