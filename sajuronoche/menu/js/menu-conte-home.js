const boton1 = document.getElementById('friend');
const boton2 = document.getElementById('home');
const boton3 = document.getElementById('adjust');

// Función para cambiar el color del botón a uno frío específico
function cambiarColor(boton) {
    // Cambiar el color del botón
    boton.style.color = '#'; // Color frío
    // Deshabilitar los otros botones
    bloquearBotones(boton);
}

// Función para bloquear otros botones
function bloquearBotones(botonActivado) {
    const botones = [boton1, boton2, boton3]; // Agrupamos todos los botones en un array

    botones.forEach(botone => {
        if (botone !== botonActivado) {
            botone.style.color = 'white'; // Cambiar el color de los botones bloqueados
        }
    });
}