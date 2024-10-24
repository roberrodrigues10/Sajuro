window.onload = function() {
    // Verificar si el usuario está logueado
    const usuarioId = sessionStorage.getItem('usuarioId');

    // Si no hay un usuario logueado, redirigir a la página de inicio de sesión
    if (!usuarioId) {
        alert("Debes iniciar sesión para acceder a esta página.");
        window.location.href = 'index.html'; // Redirigir al login
    }
};