let angle = 0;
let startX = 0;
let isDragging = false;

const carousel = document.querySelector('.carousel');
const items = document.querySelectorAll('.carousel-item');
const audios = {
    'model-1': document.getElementById('audio-deportes'),
    'model-2': document.getElementById('audio-ropa'),
    'model-3': document.getElementById('audio-musica'),
    'model-4': document.getElementById('audio-cultura'),
    'model-5': document.getElementById('audio-animales'),
    'model-6': document.getElementById('audio-comida')
};

function stopAllMusic() {
    for (let key in audios) {
        audios[key].pause();
        audios[key].currentTime = 0; // Reinicia la canción
    }
}

// Función para rotar el carrusel y gestionar la música
function rotateCarousel(rotation) {
    angle += rotation;
    carousel.style.transform = `translateZ(-300px) rotateY(${angle}deg)`;

    items.forEach((item, index) => {
        const currentAngle = (index * 60 + angle) % 360;

        // Si el ángulo es cercano a 0, la tarjeta está en el centro
        if (Math.abs(currentAngle) < 30) {
            stopAllMusic();
            let audioId = item.id;
            audios[audioId].play();  // Reproducir la música asociada a la tarjeta activa
        }
    });
}

// Arrastre con el mouse
carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        let currentX = e.clientX;
        let deltaX = currentX - startX;
        let rotation = deltaX * 0.3;
        rotateCarousel(rotation);
        startX = currentX;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Teclas para rotar
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        rotateCarousel(-10);
    } else if (e.key === 'ArrowRight') {
        rotateCarousel(10);
    }
});
