const rondaUno = document.getElementById('rondas-1-2')
const rondaDos = document.getElementById('rondas-2-4')
const rondaTres = document.getElementById('rondas-4-6')


const rondas = [rondaUno, rondaDos, rondaTres];

rondas.forEach(ronda => {
    ronda.addEventListener('click', () => {
        rondas.forEach(r => {
            r.style.backgroundColor = ''; 
        });
        ronda.style.backgroundColor = '#c19a67';
    });
});

const tiempoUno = document.getElementById('tiempo-1')
const tiempoDos = document.getElementById('tiempo-2')
const tiempoTres = document.getElementById('tiempo-3')


const tiempos = [tiempoUno, tiempoDos, tiempoTres];

tiempos.forEach(tiempo => {
    tiempo.addEventListener('click', () => {
        tiempos.forEach(t => {
            t.style.backgroundColor = ''; 
        });
        tiempo.style.backgroundColor = '#c19a67';
    });
});


const modalidadAleatorio = document.getElementById('modalidad-aleatorio')
const aparecerOdesaparecerModalidad = document.getElementById('aparecerOdesaparecer-modalidad')
const modoAleatorio = document.getElementById('modo-aleatorio')

modalidadAleatorio.addEventListener('click', () =>{
    aparecerOdesaparecerModalidad.style.opacity = '1'
    modalidadAleatorio.style.backgroundColor = '#c19a67';
    modoAleatorio.style.backgroundColor = '';
})
modoAleatorio.addEventListener('click', () =>{
    aparecerOdesaparecerModalidad.style.opacity = '0'
    modalidadAleatorio.style.backgroundColor = '';
    modoAleatorio.style.backgroundColor = '#c19a67';
})

const modalidadUno = document.getElementById('modalidad-deportes')
const modalidadDos = document.getElementById('modalidad-musica')
const modalidadTres = document.getElementById('modalidad-cultura')
const modalidadCuatro = document.getElementById('modalidad-ropa')
const modalidadCinco = document.getElementById('modalidad-animales')
const modalidadSeis = document.getElementById('modalidad-comida')

const modalidad = [modalidadUno, modalidadDos, modalidadTres, modalidadCuatro, modalidadCinco, modalidadSeis];

modalidad.forEach(moda => {
    moda.addEventListener('click', () => {
        modalidad.forEach(m => {
            m.style.backgroundColor = ''; 
        });
        moda.style.backgroundColor = '#c19a67';
    });
});