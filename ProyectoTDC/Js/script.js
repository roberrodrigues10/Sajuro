
const solicitudes = document.getElementById('iconoSolicitudesAmigos');
const cuadrosoli = document.getElementById('ContenedorGeneralSolicitudes');
const afuera = document.getElementById('afuera');

solicitudes.addEventListener('click', () => {
    cuadrosoli.style.display = 'flex';
});

document.addEventListener('click', (e) => {
    if(!solicitudes.contains(e.target) ){
        cuadrosoli.style.display = 'none';
    }
});

const iconoVistaAmigos = document.getElementById('iconoVistaAmigos');
const ContenedorGeneralPerfilModal = document.getElementById('ContenedorGeneralPerfilModal');
const cerrar = document.getElementById('cerrar');

iconoVistaAmigos.addEventListener('click', () => {
    ContenedorGeneralPerfilModal.style.display = 'flex';

});

document.addEventListener('click', (e) => {
    if(!iconoVistaAmigos.contains(e.target) ){
        ContenedorGeneralPerfilModal.style.display = 'none';
    }
});






  



    

