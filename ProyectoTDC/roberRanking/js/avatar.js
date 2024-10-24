document.addEventListener('DOMContentLoaded', function() {
    const avatares = document.querySelectorAll('.ContenidoAvatar1');
    const avatarPerfil = document.querySelector('.contenidoAvatarPerfil img');
    const esferasAzules = document.querySelector('.CantidadEsferaAzulModalNivel h1');

    // Función para actualizar los avatares desbloqueados
    function actualizarAvatares() {
        const cantidadEsferasAzules = parseInt(esferasAzules.textContent) || 0;
        const avataresBloqueados = document.querySelectorAll('[id^="bloqueado-"]');
        
        avataresBloqueados.forEach((avatar, index) => {
            if (index < Math.floor(cantidadEsferasAzules / 10)) {
                avatar.id = ''; // Desbloquea el avatar
                avatar.parentElement.style.opacity = '1';
                avatar.parentElement.style.cursor = 'pointer';
            } else {
                avatar.id = `bloqueado-${index + 1}`;
                avatar.parentElement.style.opacity = '0.5';
                avatar.parentElement.style.cursor = 'not-allowed';
            }
        });
    }

    // Recupera el avatar guardado al cargar la página
    const avatarGuardado = localStorage.getItem('avatarSeleccionado');
    if (avatarGuardado) {
        avatarPerfil.src = avatarGuardado;
    }

    avatares.forEach(avatar => {
        avatar.addEventListener('click', function() {
            const img = this.querySelector('img');
            
            // Verifica si el avatar está bloqueado
            if (img.id.startsWith('bloqueado-')) {
                console.log('Este avatar está bloqueado');
                return; // Sale de la función si el avatar está bloqueado
            }

            const nuevaImagenSrc = img.src;
            avatarPerfil.src = nuevaImagenSrc;

            // Guarda la selección en localStorage
            localStorage.setItem('avatarSeleccionado', nuevaImagenSrc);

            // Aplica el efecto de opacidad
            avatares.forEach(av => {
                if (av !== this) {
                    av.classList.add('fade');
                }
            });

            // Quita el efecto de opacidad después de 1 segundo
            setTimeout(() => {
                avatares.forEach(av => av.classList.remove('fade'));
            }, 1000);
        });
    });

    // Actualiza los avatares inicialmente
    actualizarAvatares();

    // Observa cambios en la cantidad de esferas azules
    const observer = new MutationObserver(actualizarAvatares);
    observer.observe(esferasAzules, { childList: true, characterData: true, subtree: true });
});