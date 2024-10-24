const tematica = document.getElementById('tiempoDeJuegoPerfil');
const cuadroTematica = document.getElementById('switchTematica');

// Ocultar el modal al cargar la página
cuadroTematica.style.display = 'none';

tematica.addEventListener('click', () => {
    cuadroTematica.style.display = 'flex';
});

document.addEventListener('click', (e) => {
    if (!tematica.contains(e.target) && !cuadroTematica.contains(e.target)) {
        cuadroTematica.style.display = 'none';
    }
});

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


