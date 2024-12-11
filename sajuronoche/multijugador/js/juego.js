import { mostrarModalJugadores } from './modalJugadores.js';
import * as THREE from 'three';

const socket = new WebSocket('ws://localhost:8080');
let jugadores = []; // Lista de jugadores
let currentCamera = null; // Cámara actual
let currentScene = null; // Escena actual
let renderer = null; // Renderizador de Three.js
const modalVar = document.getElementById('modalJugadoresVar');
const imgVar = document.querySelector('.var');
const cerrar = document.getElementById('cerrar');
const modalBloqueo = document.getElementById('modalBloqueo');
let localStream;
let peerConnections = {};

const urlParams = new URLSearchParams(window.location.search);
const salaActual = urlParams.get('codigo');

export const sendWebSocketMessage = (message) => {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.error('WebSocket no está conectado.');
    }
};

// Inicialización del WebSocket y otros eventos
socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');
    sendWebSocketMessage({
        action: 'solicitar_jugadores',
        codigo_sala: salaActual
    });
    sendWebSocketMessage({
        action: 'jugador_unido',
        codigo_sala: salaActual,
        nombreUsuario: sessionStorage.getItem('nombreUsuario'),
        avatar: '../../menu/css/img/avatar.png'
    });
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.action) {
        case 'lista_jugadores':
        case 'actualizar_jugadores':
            if (data.codigo_sala === salaActual) {
                jugadores = data.jugadores.map(jugador => ({
                    username: jugador.username,
                    avatar: jugador.avatar || '../../menu/css/img/avatar.png'
                }));
                mostrarModalJugadores(jugadores);
            }
            break;
        case 'jugador_unido':
            if (data.codigo_sala === salaActual) {
                const jugadorExistente = jugadores.find(j => j.username === data.nombreUsuario);
                if (!jugadorExistente) {
                    jugadores.push({
                        username: data.nombreUsuario,
                        avatar: data.avatar || '../../menu/css/img/avatar.png'
                    });
                    mostrarModalJugadores(jugadores);
                }
            }
            break;
        case 'error':
            console.error('Error recibido:', data.mensaje);
            alert(data.mensaje);
            break;
    }
};

// Mostrar el modal de jugadores
imgVar.addEventListener('click', () => {
    if (modalVar) {
        modalVar.style.display = 'flex';
        mostrarModalJugadores(jugadores); 
    } else {
        console.error('Modal no encontrado');
    }
});

// Cerrar el modal
cerrar.addEventListener('click', () => {
    if (modalVar) {
        modalVar.style.display = 'none'; 
    }
});

// Crear la cámara espía para el jugador seleccionado
function activarCamaraEspia(jugador) {
    // Si ya existe una cámara y escena, limpiarlas
    if (currentCamera) {
        currentScene.remove(currentCamera);
    }

    // Crear una nueva cámara y escena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Crear un cubo o cualquier objeto como ejemplo
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Rendirizar la escena
    const animate = function () {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
    animate();

    // Establecer la cámara y la escena
    currentCamera = camera;
    currentScene = scene;
}

// Activar la cámara cuando el jugador es seleccionado
function onJugadorSeleccionado(jugador) {
    activarCamaraEspia(jugador);
}

// Añadir un evento de selección a cada jugador
function agregarEventosDeSeleccion() {
    const jugadorElements = document.querySelectorAll('.jugador'); // Asegúrate de que cada jugador tiene la clase 'jugador'
    jugadorElements.forEach(jugador => {
        jugador.addEventListener('click', () => {
            const username = jugador.getAttribute('data-username');
            const jugadorSeleccionado = jugadores.find(j => j.username === username);
            if (jugadorSeleccionado) {
                onJugadorSeleccionado(jugadorSeleccionado);
            }
        });
    });
}

// Inicializa la interfaz cuando se cargan los jugadores
export function mostrarModalJugadores(jugadores) {
    const modalBody = document.getElementById('modal-body'); // Asegúrate de tener un contenedor para los jugadores
    modalBody.innerHTML = ''; // Limpiar contenido anterior
    jugadores.forEach(jugador => {
        const jugadorElement = document.createElement('div');
        jugadorElement.classList.add('jugador');
        jugadorElement.setAttribute('data-username', jugador.username);
        jugadorElement.innerHTML = `
            <img src="${jugador.avatar}" alt="${jugador.username}">
            <p>${jugador.username}</p>
        `;
        modalBody.appendChild(jugadorElement);
    });

    // Agregar los eventos de selección
    agregarEventosDeSeleccion();
}

