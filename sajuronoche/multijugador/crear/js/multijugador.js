// Expulsar
const expulsar = document.getElementById('expulsar');
const cambioExpulsar = document.querySelectorAll('.username-multi');

expulsar.addEventListener('click', () => {
    cambioExpulsar.forEach(elementoClick => {
        // Alterna el texto y la clase
        if (elementoClick.textContent === 'X') {
            elementoClick.textContent = 'username';
            elementoClick.classList.remove('x');
        } else {
            elementoClick.textContent = 'X';
            elementoClick.classList.add('x');
        }
    });
    if (expulsar.textContent === 'expulsar') {
        expulsar.textContent = 'cambiar';
        expulsar.style.backgroundColor = '#3e301d';
    } else {
        expulsar.textContent = 'expulsar';
        expulsar.style.backgroundColor = ''; 
    }
});
