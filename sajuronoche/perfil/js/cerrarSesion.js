document.addEventListener('DOMContentLoaded', () => {
    const cerrarSesion = document.querySelector('.cerrar-sesion');
    cerrarSesion.addEventListener('click', () => {

        sessionStorage.clear();

        window.location.href = '../../index.html';
    });
});