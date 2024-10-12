// Obtener elementos
const modal = document.getElementById("myModal");
const openBtn = document.getElementById("openModalBtn");
const modalContent = document.querySelector(".modal-content"); // Asegúrate de que tengas esta clase en tu contenido del modal

// Abrir el modal
openBtn.onclick = function() {
    modal.style.display = "block";
}

// Cerrar el modal al hacer clic fuera del contenido
document.addEventListener('click', (e) => {
    // Verificar si el clic fue fuera del modal
    if (!modalContent.contains(e.target) && !openBtn.contains(e.target)) {
        modal.style.display = "none";
    }
});

const rankingMundial = document.getElementById('ranking-Mundial')
const rankingSemanal = document.getElementById('rankingSemanal')
const clickMundial = document.getElementById('clickMundial')
const clickSemanal = document.getElementById('clickSemanal')

clickMundial.addEventListener('click', () => {
    rankingMundial.style.display = 'grid';
    rankingSemanal.style.display = 'none';
    clickMundial.style.color = 'red';
    clickSemanal.style.color = 'rgb(238, 173, 119)';
});
clickSemanal.addEventListener('click', () => {
    rankingMundial.style.display = 'none';
    rankingSemanal.style.display = 'grid';
    clickSemanal.style.color = 'red';
    clickMundial.style.color = '';

});
