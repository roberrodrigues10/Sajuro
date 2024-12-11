document.addEventListener('DOMContentLoaded', () => {
    const buscarAmigosInput = document.getElementById('buscarAmigos');
    const listaAmigos = document.getElementById('listaAmigos');

    // Función para cargar todos los amigos
    function cargarAmigos() {
        fetch('./php/mostrar_jugadores.php')
            .then(response => response.json())
            .then(data => {
                listaAmigos.innerHTML = ''; // Limpiar el contenedor

                data.forEach(jugador => {
                    const amigoDiv = crearAmigoDiv(jugador);
                    listaAmigos.appendChild(amigoDiv);
                });
            })
            .catch(error => console.error('Error al cargar los amigos:', error));
    }
    const avatarAmigo = 'http://localhost/sajuro/sajuronoche/perfil/img/';

    // Función para crear el div de un amigo
    function crearAmigoDiv(jugador) {
        let amigoDiv = document.createElement('div');
        amigoDiv.classList.add('amigo');
        amigoDiv.setAttribute('data-id', jugador.id_usuario); // Agregar id_usuario al div

        amigoDiv.innerHTML = `
            <div class="iconoAmigosAmigos">
                <img src="${avatarAmigo}/${jugador.img_avatar}" alt="">
            </div>
            <div class="nombreAmigoAmigos">
                <h3>${jugador.nombre_usuario}</h3>
            </div>
            <div class="contenedorIconosAmigosAmigos">
                <div class="iconoVistaAmigos" data-id="${jugador.id_usuario}">
                    <svg xmlns="http://www.w3.org/2000/svg"class="iconoVis" width="5vh" height="5vh" fill="#5c4033" viewBox="0 0 16 16">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"></path>
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"></path>
                    </svg>
                </div>
                <div id="iconoSolicitudesAmigos" data-id="${jugador.id_usuario}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="iconoAgre" width="5vh" fill="#5c4033" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    </svg>
                </div>
            </div>
        `;

        // Evento para bloquear al usuario
        amigoDiv.querySelector('.iconoVistaAmigos').addEventListener('click', (e) => {
            const jugadorId = e.currentTarget.getAttribute('data-id');
            if (!jugadorId) {
                alert('El ID del jugador no está definido.');
                return;
            }

            if (confirm('¿Seguro que quieres bloquear a este jugador?')) {
                fetch('./php/bloquear_jugador.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `id_bloqueado=${encodeURIComponent(jugadorId)}`,
                    credentials: 'same-origin',
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert('Jugador bloqueado correctamente.');
                            // Eliminar el jugador del DOM
                            amigoDiv.remove();
                        } else {
                            alert(`Error al bloquear jugador: ${data.message}`);
                        }
                    })
                    .catch(error => {
                        console.error('Error en la solicitud:', error);
                        alert('Ocurrió un error al bloquear.');
                    });
            }
        });

        // Evento para redirigir al perfil del usuario
        amigoDiv.querySelector('#iconoSolicitudesAmigos').addEventListener('click', (e) => {
            const jugadorId = e.currentTarget.getAttribute('data-id');
            if (!jugadorId) {
                alert('No se pudo identificar al usuario.');
                return;
            }
            // Redirigir al perfil del usuario con el parámetro correcto 'id_usuario'
            window.location.href = `./../Perfil/perfilAmigos.html?id_usuario=${jugadorId}`;
        });
        
        return amigoDiv;
    }
    function crearBusquedaDiv(jugador) {
        let amigoDiv = document.createElement('div');
        amigoDiv.classList.add('amigo');
        amigoDiv.setAttribute('data-id', jugador.id_usuario); // Agregar id_usuario al div
    
        amigoDiv.innerHTML = `
            <div class="iconoAmigosAmigos">
                <img src="${avatarAmigo}/${jugador.img_avatar}" alt="">
            </div>
            <div class="nombreAmigoAmigos">
                <h3>${jugador.nombre_usuario}</h3>
            </div>
            <div class="contenedorIconosAmigosAmigos">
                <div class="iconoVistaAmigos" data-id="${jugador.id_usuario}" data-username="${jugador.nombre_usuario}">
                    <svg xmlns="http://www.w3.org/2000/svg"class="iconoVis" width="5vh" height="5vh" fill="#5c4033" viewBox="0 0 16 16">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"></path>
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"></path>
                    </svg> 
                </div>
                <div id="iconoSolicitudesAmigos" data-id="${jugador.id_usuario}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="iconoAgre" width="5vh" fill="#5c4033" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    </svg>
                </div>
            </div>
        `;
    
        // Evento para enviar solicitud de amistad
        amigoDiv.querySelector('.iconoVistaAmigos').addEventListener('click', (e) => {
            const idEmisor = localStorage.getItem('usuarioId');
            const idReceptor = e.currentTarget.getAttribute('data-id')
            const estadoSolicitud = 'pendiente'; // Define el estado inicial de la solicitud
            const confirmacion = confirm(`¿Seguro quieres agregar a este jugador como amigo?`);
            
            if (confirmacion) {
                // Enviar la solicitud al servidor
                console.log({ idEmisor, idReceptor, estadoSolicitud });
                fetch('./php/enviarSolicitud.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `id_emisor=${encodeURIComponent(idEmisor)}&id_receptor=${encodeURIComponent(idReceptor)}&estado_solicitud=${encodeURIComponent(estadoSolicitud)}`,
                    credentials: 'same-origin',
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // Asegurarse de que sea un JSON válido
                })
                .then(data => {
                    if (data.success) {
                        alert(data.message);
                    } else {
                        console.error('Error del servidor:', data.message);
                        alert('Error: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error al enviar la solicitud:', error);
                    alert('Hubo un problema al procesar la solicitud.');
                });             
            }
        });
    
        // Evento para redirigir al perfil del usuario
        amigoDiv.querySelector('#iconoSolicitudesAmigos').addEventListener('click', (e) => {
            const jugadorId = e.currentTarget.getAttribute('data-id');
            if (!jugadorId) {
                alert('No se pudo identificar al usuario.');
                return;
            }
            // Redirigir al perfil del usuario con el parámetro correcto 'id_usuario'
            window.location.href = `./../Perfil/perfilAmigos.html?id_usuario=${jugadorId}`;
        });

        // Evento para redirigir al perfil del usuario
        amigoDiv.querySelector('#iconoSolicitudesAmigos').addEventListener('click', (e) => {
            const jugadorId = e.currentTarget.getAttribute('data-id');
            if (!jugadorId) {
                alert('No se pudo identificar al usuario.');
                return;
            }
            // Redirigir al perfil del usuario con el parámetro correcto 'id_usuario'
            window.location.href = `./../Perfil/perfilAmigos.html?id_usuario=${jugadorId}`;
        });
        
        return amigoDiv;
    }

    // Evento de búsqueda
    buscarAmigosInput.addEventListener('input', () => {
        const filtro = buscarAmigosInput.value;

        if (!filtro.trim()) {
            cargarAmigos();
            return;
        }

        fetch(`./php/buscar_jugadores.php?q=${encodeURIComponent(filtro)}`)
            .then(response => response.json())
            .then(data => {
                listaAmigos.innerHTML = '';

                data.forEach(jugador => {
                    const amigoDiv = crearBusquedaDiv(jugador);
                    listaAmigos.appendChild(amigoDiv);

                    
                });
            })
            .catch(error => console.error('Error al buscar jugadores:', error));
    });

    // Cargar amigos al inicio
    cargarAmigos();
});
