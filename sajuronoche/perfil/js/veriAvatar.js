// Al iniciar sesión, guarda el avatar
const avatar = localStorage.getItem('avatar');
console.log(avatar);

// Al cargar páginas importantes, verifica el avatar
function verificarAvatar() {
    const usuarioId = localStorage.getItem('usuarioId');

    fetch('./php/actAvatar.php', {
        method: 'POST',
        body: JSON.stringify({ usuarioId }),
        cache: 'no-cache' // Deshabilitar caché
    })
    .then(response => response.json())
    .then(data => {
        console.log('Avatar actual en localStorage:', localStorage.getItem('avatar'));
        console.log('Nuevo avatar recibido:', data.avatar);
    
        // Verificar si el avatar ha cambiado
        if (data.avatar !== localStorage.getItem('avatar')) {
            console.log('Avatar actualizado');
            
            // Actualizar el avatar en localStorage
            localStorage.setItem('avatar', data.avatar);
            console.log(data.avatar);

            // Recargar la página para reflejar el cambio
            location.reload(true); // Intentar una recarga completa, sin caché
        }
    })
    .catch(error => {
        console.error('Error verificando avatar:', error);
    });
}

// Llamar a verificarAvatar cuando sea necesario
document.addEventListener('DOMContentLoaded', verificarAvatar);

// Llamada a la función para actualizar la imagen del avatar en el frontend (por ejemplo, en el perfil)
function actualizarAvatar() {
    const avatar = localStorage.getItem('avatar');
    const avatarElement = document.getElementById('avatar'); // Asegúrate de que el ID de la imagen sea correcto
    
    if (avatar && avatarElement) {
        avatarElement.src = avatar + "?t=" + new Date().getTime(); // Añadir un parámetro único para evitar cache
    }
}

// Llamar a esta función cuando sea necesario, por ejemplo, después de que el avatar se haya actualizado
document.addEventListener('DOMContentLoaded', actualizarAvatar);
