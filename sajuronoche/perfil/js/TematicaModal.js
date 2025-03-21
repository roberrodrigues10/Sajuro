const cuadroTematica = document.getElementById('switchTematica');

function abrirModalTematica() {
    cuadroTematica.style.display = 'flex';
}

function cerrarModalTematica() {
    cuadroTematica.style.display = 'none';
}

function handleTematicaClick(e) {
    const tematicaElement = e.target.closest('.tiempoDeJuegoPerfil');
    
    if (tematicaElement) {
        abrirModalTematica();
    } 
    else if (!cuadroTematica.contains(e.target) && cuadroTematica.style.display === 'flex') {
        cerrarModalTematica();
    }
}

// Ocultar el modal al cargar la página
cuadroTematica.style.display = 'none';

// Event listener para todo el documento
document.addEventListener('click', handleTematicaClick);

const interruptorTematica = document.getElementById('interruptorTematica');

interruptorTematica.addEventListener('change', () => {
    // Esperar 400ms para que termine la transición antes de redirigir
    setTimeout(() => {
        if (interruptorTematica.checked) {
            // Redirigir a la página o sección de Noche después de la transición
            window.location.href = 'Configuraciones.html'; // O una sección como #noche
        } else {
            // Redirigir a la página o sección de Día después de la transición
            window.location.href = 'Jugadores.html'; // O una sección como #dia
        }
    }, 400); // Esperar 400ms para hacer la redirección
});


