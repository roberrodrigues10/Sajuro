document.addEventListener('DOMContentLoaded', () => {
    const esferasAzules = document.querySelector('.contenidoCantidadEsferasAzules h1');
    
    // Obtener avatar actual del usuario
    fetch('./php/obtenerUsuario.php', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener el avatar del usuario');
        }
        return response.json();
    })
    .then(data => {
        if (data.success && data.avatar) {
            const avatarPerfil = document.querySelector('#avatarPerfil');
            avatarPerfil.src = localStorage.getItem('avatar');
            ;
        } else {
            console.error('No se pudo cargar el avatar:', data.message);
        }
    })
    .catch(error => {
        console.error('Error al obtener el avatar del usuario:', error);
    });

    // Función para verificar si un avatar está desbloqueado
    function estaDesbloqueado(index) {
        const cantidadEsferasAzules = parseInt(esferasAzules.textContent) || 0;
        if (index === 0) return true; // El primer avatar siempre está desbloqueado
        return cantidadEsferasAzules >= index * 10;
    }

    // Función para mostrar las imágenes
    function mostrarAvatares(data) {
        console.log('Datos dentro de mostrarAvatares:', data);
        const avatarElements = document.querySelectorAll('.ContenidoAvatar1 img');
        
        data.forEach((avatar, index) => {
            if (index < avatarElements.length) {
                const imgElement = avatarElements[index];
                const url_avatar = 'http://localhost/sajuro/sajuronoche/perfil/img';

                // Asumiendo que 'avatar.img_avatar' contiene el nombre del archivo de la imagen
                imgElement.src = `${url_avatar}/${avatar.img_avatar}`;  // Concatenamos la ruta base con el nombre de la imagen
                imgElement.alt = `Avatar ${avatar.id_avatar}`;
                imgElement.dataset.id = avatar.id_avatar;
                
                // Aplicar estado inicial de bloqueo
                if (!estaDesbloqueado(index)) {
                    imgElement.id = `bloqueado-${index}`;
                    imgElement.parentElement.style.opacity = '0.5';
                    imgElement.parentElement.style.cursor = 'not-allowed';
                } else {
                    imgElement.parentElement.style.opacity = '1';
                    imgElement.parentElement.style.cursor = 'pointer';
                }
                
                imgElement.addEventListener('click', () => {
                    if (estaDesbloqueado(index)) {
                        seleccionarAvatar(avatar.id_avatar);
                        
                        // Aplicar efecto de opacidad
                        avatarElements.forEach(av => {
                            if (av !== imgElement) {
                                av.parentElement.style.opacity = '0.5';
                            }
                        });

                        setTimeout(() => {
                            avatarElements.forEach((av, i) => {
                                if (estaDesbloqueado(i)) {
                                    av.parentElement.style.opacity = '1';
                                }
                            });
                        }, 1000);
                    } else {
                        const alertaAvatar = document.querySelector('.alertaAvatar');
                        alertaAvatar.textContent = `Necesitas ${index * 10} esferas azules para desbloquear este avatar`;
                    }
                });
            }
        });
    }

    function seleccionarAvatar(idAvatar) {
        console.log('Avatar seleccionado con ID:', idAvatar);
        
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
                if (data.avatar) {
                    const avatarPerfil = document.querySelector('#avatarPerfil'); // Ajusta el selector
                    avatarPerfil.src = localStorage.getItem('avatar');
                    location.reload(true); // Intentar una recarga completa, sin caché 
                    console.log(data.avatar);
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

    // Observador para los cambios en las esferas azules
    const observer = new MutationObserver(() => {
        const avatarElements = document.querySelectorAll('.ContenidoAvatar1 img');
        avatarElements.forEach((img, index) => {
            if (estaDesbloqueado(index)) {
                img.id = '';
                img.parentElement.style.opacity = '1';
                img.parentElement.style.cursor = 'pointer';
            } else {
                img.id = `bloqueado-${index}`;
                img.parentElement.style.opacity = '0.5';
                img.parentElement.style.cursor = 'not-allowed';
            }
        });
    });
    observer.observe(esferasAzules, { childList: true, characterData: true, subtree: true });

    // Cargar avatares al iniciar
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