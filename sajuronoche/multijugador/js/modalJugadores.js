import { sendWebSocketMessage } from './juego.js';
import { captureScreen} from './juego.js';



export function mostrarModalJugadores(jugadores, salaActual) {
    const contenidoJugadores = document.querySelector('.contenidoJugadores');
    if (!contenidoJugadores) {
        console.error('No se encontró el contenedor de jugadores.');
        return;
    }

    contenidoJugadores.innerHTML = ''; // Limpiar el contenido anterior

    jugadores.forEach(jugador => {
        const jugadorDiv = document.createElement('div');
        jugadorDiv.classList.add('Jugador');
        
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('imagen-usuario');
        const avatarImg = document.createElement('img');
        avatarImg.src = jugador.avatar; // Usar avatar del jugador
        avatarImg.alt = 'Avatar';
        avatarImg.classList.add('imgUsuariounirse');
        avatarImg.width = 100;
        avatarDiv.appendChild(avatarImg);

        const usernameDiv = document.createElement('div');
        usernameDiv.classList.add('username-multi');
        usernameDiv.textContent = jugador.username;


        
        const urlParams = new URLSearchParams(window.location.search);
        const salaActual = urlParams.get('codigo');

        // Agregar un evento de clic al avatar para redirigir a la partida de ese jugador
        avatarImg.addEventListener('click', () => {


            console.log('Datos enviados:', jugador.username, salaActual);
            // Enviar solicitud para obtener la partida del jugador

            captureScreen()
            sendWebSocketMessage({
                action: 'mostrar_partida',
                usuario: jugador.username,
                codigoSala: salaActual
            });
        });

        jugadorDiv.appendChild(avatarDiv);
        jugadorDiv.appendChild(usernameDiv);
        contenidoJugadores.appendChild(jugadorDiv);
    });
}