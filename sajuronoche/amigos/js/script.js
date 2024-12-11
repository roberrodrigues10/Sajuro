const solicitudes = document.getElementById('iconoSolicitudesAmigos');
const cuadrosoli = document.getElementById('ContenedorGeneralSolicitudes');
const cuadroSolicitudes = document.querySelector('.cuadroSolicitudes');

solicitudes.addEventListener('click', (e) => {
    // Mostrar el contenedor de solicitudes
    cuadrosoli.style.display = 'flex';
    // Evitar que el clic en solicitudes cierre el contenedor
    e.stopPropagation();
});

document.addEventListener('click', (e) => {
    // Verificar si el clic no está dentro de solicitudes, cuadroSolicitudes o el contenedor general
    if (
        !solicitudes.contains(e.target) &&
        !cuadrosoli.contains(e.target) &&
        !cuadroSolicitudes.contains(e.target)
    ) {
        cuadrosoli.style.display = 'none';
    }
});
