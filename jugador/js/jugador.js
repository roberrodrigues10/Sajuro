const img1 = document.getElementById('img1')
const imgJugadores = document.getElementById('imgJugadores')

img1.addEventListener('click', () => {
    imgJugadores.style.display = 'flex';
})

imgJugadores.addEventListener('click', (e) => {
    if(e.target === imgJugadores){
        imgJugadores.style.display = 'none';     
    }
})
