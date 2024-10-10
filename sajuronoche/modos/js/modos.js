const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 200 / 240, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Usar fondo transparente
renderer.setSize(200, 240); // Ajustar el tamaño para que coincida con el contenedor

// Obtener cada contenedor del modelo
const modelContainers = [
    document.getElementById('model-1'),
    document.getElementById('model-2'),
    document.getElementById('model-3'),
    document.getElementById('model-4'),
    document.getElementById('model-5'),
    document.getElementById('model-6')
];

// Iluminación
const ambientLight = new THREE.AmbientLight(0x404040); // Luz ambiental
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Luz direccional
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Función para cargar modelos en cada contenedor
const loadModel = (containerId) => {
    const loader = new THREE.GLTFLoader();
    loader.load('3d.gltf', function(gltf) {
        const model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5); // Aumentar el tamaño del modelo
        model.position.y = -1; // Ajustar la posición vertical para que quede debajo del texto
        scene.add(model);

        // Establece el renderizador en el contenedor
        containerId.appendChild(renderer.domElement);
        animate(); // Iniciar animación una vez que se carga el modelo
    }, undefined, function(error) {
        console.error('Error al cargar el modelo:', error);
    });
};

// Cargar el modelo en cada contenedor
modelContainers.forEach(container => {
    loadModel(container);
});

// Función de animación
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Posiciona la cámara
camera.position.z = 3; // Ajusta la posición de la cámara para ver el modelo

// Manejar el redimensionamiento de la ventana
window.addEventListener('resize', () => {
    renderer.setSize(200, 240); // Ajustar al tamaño fijo del contenedor
    camera.aspect = 200 / 240; // Relación de aspecto fija
    camera.updateProjectionMatrix();
});