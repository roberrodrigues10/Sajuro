function cargarAmigos() {
    fetch('./php/obtener_amigos.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos de amigos recibidos:', data);
            
            // Verifica si data es un array, de lo contrario muestra un error
            if (!Array.isArray(data)) {
                throw new Error('El formato de datos recibido no es un array');
            }

            const contenedorAmigos = document.getElementById('amigosCerrar');
            
            if (!contenedorAmigos) {
                console.error('No se encontró el contenedor de amigos');
                return;
            }
            
            contenedorAmigos.innerHTML = ''; // Limpiar el contenedor actual
            const avatarAmigo = 'http://localhost/sajuro/sajuronoche/perfil/img/';
            data.forEach(amigo => {
                console.log(amigo.estado);
                const amigoHTML = `}
                    <div class="usuarios">
                        <img src="css/img/conectado.png" alt="" class="imgFondoactivo" width="270px">
                        <div class="logo-usuario-conectado">
                            <img src="${avatarAmigo}/${amigo.img_avatar}" alt="" class="calaActivo">
                        </div>
                        <div class="usuario-conectado">${amigo.nombre_usuario}</div>
                        <div class="point-general point-conectados">
                            <div class="sajuro-points point-color-conectados">SajuroPoints</div>
                            <div class="contenido-points point-color-conectados puntajes">${amigo.puntuacion_total}</div>
                            <div class="estado">
                                <div class="en-linea" id="on" style="opacity: ${amigo.estado === 'En línea' ? 1: 0}">
                                    <img src="css/img/enlinea.png" alt="" width="40px" class="logo-enlinea">
                                </div>
                                <div class="onflinne" id="off" style="opacity: ${amigo.estado === 'Desconectado' ? 1 : 0}">
                                    <img src="css/img/ofline.png" alt="" width="40px" class="logo-enlinea ofline">
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                contenedorAmigos.innerHTML += amigoHTML;
            });
        })
        .catch(error => {
            console.error('Error al cargar amigos:', error);
        });
}

// Cargar amigos cuando se carga la página
document.addEventListener('DOMContentLoaded', cargarAmigos);
