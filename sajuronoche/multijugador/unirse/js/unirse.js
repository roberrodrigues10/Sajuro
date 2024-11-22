// Selecciona todos los inputs con la clase "codigo-ingreso"
const inputs = document.querySelectorAll('.codigo-ingreso');

inputs.forEach((input, index) => {
    input.addEventListener('input', (event) => {
        const value = event.target.value.trim();
        // Si se ingresa un número, pasa al siguiente input
        if (value.length === 1 && !isNaN(value)) {
            const nextInput = inputs[index + 1];
            if (nextInput) {
                nextInput.focus(); // Mueve el foco al siguiente input
            }
        }
    });

    // Permite regresar con la tecla Backspace
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && input.value === '') {
            const previousInput = inputs[index - 1];
            if (previousInput) {
                previousInput.focus(); // Mueve el foco al input anterior
            }
        }
    });
});
