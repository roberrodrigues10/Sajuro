const rondaUno = document.getElementById('rondas-1-2');
const rondaDos = document.getElementById('rondas-2-4');
const rondaTres = document.getElementById('rondas-4-6');

const rondas = [rondaUno, rondaDos, rondaTres];

function initRondas() {
    rondas.forEach((ronda, index) => {
        ronda.addEventListener('click', () => {
            rondas.forEach(r => r.style.backgroundColor = ''); 
            ronda.style.backgroundColor = '#c19a67';

            sendWebSocketMessage({
                action: 'ronda_seleccionada',
                codigo_sala: salaActual,
                ronda: index + 1
            });
        });
    });
}

window.initRondas = initRondas;

const tiempoUno = document.getElementById('tiempo-1');
const tiempoDos = document.getElementById('tiempo-2');
const tiempoTres = document.getElementById('tiempo-3');

const tiempos = [tiempoUno, tiempoDos, tiempoTres];

tiempos.forEach(tiempo => {
    tiempo.addEventListener('click', () => {
        tiempos.forEach(t => t.style.backgroundColor = ''); 
        tiempo.style.backgroundColor = '#c19a67';
    });
});

const modalidadAleatorio = document.getElementById('modalidad-aleatorio');
const aparecerOdesaparecerModalidad = document.getElementById('aparecerOdesaparecer-modalidad');
const modoAleatorio = document.getElementById('modo-aleatorio');

modalidadAleatorio.addEventListener('click', () => {
    aparecerOdesaparecerModalidad.style.opacity = '1';
    modalidadAleatorio.style.backgroundColor = '#c19a67';
    modoAleatorio.style.backgroundColor = '';
});

modoAleatorio.addEventListener('click', () => {
    aparecerOdesaparecerModalidad.style.opacity = '0';
    modalidadAleatorio.style.backgroundColor = '';
    modoAleatorio.style.backgroundColor = '#c19a67';
});

const modalidades = [
    document.getElementById('modalidad-deportes'),
    document.getElementById('modalidad-musica'),
    document.getElementById('modalidad-cultura'),
    document.getElementById('modalidad-ropa'),
    document.getElementById('modalidad-animales'),
    document.getElementById('modalidad-comida')
];

modalidades.forEach(moda => {
    moda.addEventListener('click', () => {
        modalidades.forEach(m => m.style.backgroundColor = ''); 
        moda.style.backgroundColor = '#c19a67';
    });
});

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
