// Obtener elementos
const modal = document.getElementById("myModal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.querySelector(".close");

// Abrir el modal
openBtn.onclick = function() {
    modal.style.display = "block";
}


// Cerrar el modal al hacer clic fuera del contenido
document.addEventListener('click', (e) =>{
    if(!openBtn.contains(e.target))
        {
        modal.style.display = "none";

    }
});
