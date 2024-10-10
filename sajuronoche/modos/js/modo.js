let angle = 0;
let startX = 0;
let isDragging = false;

const carousel = document.querySelector('.carousel');
const items = document.querySelectorAll('.carousel-item');
const loader = new THREE.GLTFLoader(); // Cargar el modelo GLTF

// Función para rotar el carrusel
function rotateCarousel(rotation) { 
    angle += rotation;
    carousel.style.transform = `translateZ(-300px) rotateY(${angle}deg)`;

    // Aplicar la distorsión a los elementos
    items.forEach((item, index) => {
        const currentAngle = (index * 60 + angle) % 360; // Cambia 90 por 60
        if (Math.abs(currentAngle) === 0) {
            item.classList.remove('distorted');
        } else {
            item.classList.add('distorted');
        }
    });
}

// Iniciar el arrastre con el mouse
carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
});

// Detectar el movimiento del mouse
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        let currentX = e.clientX;
        let deltaX = currentX - startX;
        let rotation = deltaX * 0.3; // Ajusta el factor para controlar la sensibilidad
        rotateCarousel(rotation);
        startX = currentX; // Actualizar la posición inicial
    }
});

// Terminar el arrastre
document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Cargar el modelo en cada elemento del carrusel
items.forEach((item) => {
    loader.load('3d.gltf', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5); // Ajusta la escala si es necesario
        item.appendChild(model);
    }, undefined, (error) => {
        console.error('Error al cargar el modelo:', error);
    });
});
