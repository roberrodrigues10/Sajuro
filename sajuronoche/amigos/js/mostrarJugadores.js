// Obtener referencia al contenedor donde se mostrarán los amigos
const listaAmigos = document.getElementById('listaAmigos');

// Función para cargar y renderizar amigos
function cargarAmigos() {
    fetch('./php/mostrar_jugadores.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los amigos');
            }
            return response.json();
        })
        .then(data => {
            listaAmigos.innerHTML = ''; // Limpiar el contenedor

            data.forEach(jugador => {
                // Crear el contenedor del amigo
                const amigoDiv = document.createElement('div');
                amigoDiv.classList.add('amigo');
                amigoDiv.setAttribute('data-id', jugador.id_usuario); // ID del usuario
                const avatarAmigo = 'http://localhost/sajuro/sajuronoche/perfil/img/';
                const avatarFinal = `${avatarAmigo}/${jugador.img_avatar}`;
                console.log(avatarFinal)
                // Rellenar el contenido del amigo
                amigoDiv.innerHTML = `
                    <div class="iconoAmigosAmigos">
                        <img src="${avatarFinal}" alt="">
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
                        <div id="iconoSolicitudesAmigos">
                            <svg xmlns="http://www.w3.org/2000/svg" class="iconoAgre" width="5vh" fill="#5c4033" viewBox="0 0 16 16">
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                            </svg>
                        </div>
                    </div>
                `;

                // Agregar el amigo al contenedor principal
                listaAmigos.appendChild(amigoDiv);

                
            });
        })
        .catch(error => {
            console.error('Hubo un problema al cargar los amigos:', error);
            listaAmigos.innerHTML = `<p class="error">No se pudieron cargar los amigos.</p>`;
        });
}

// Llamar a la función para cargar amigos al inicio
cargarAmigos();
