function crearSolicitudDiv(solicitud) {
    const solicitudDiv = document.createElement('div');
    solicitudDiv.classList.add('infoSolicitudSolicitudes'); // Clase única para cada solicitud

    const avatarAmigo = 'http://localhost/sajuro/sajuronoche/perfil/img/';

    solicitudDiv.innerHTML = `
        <p></p>
        <div class="IconoSolicitud">
            <img src="${avatarAmigo}${solicitud.img_avatar}" alt="Avatar" class="avatarSoli">
        </div>
        <div class="nombreSolicitud">
            <h3>${solicitud.nombre_usuario}</h3>
        </div>
        <div class="iconosRevision">
            <svg class="rechazar-solicitud" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#af9080" ...>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
            </svg>
            <svg class="aceptar-solicitud" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#af9080" ...>
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
            </svg>
        </div>
    `;

    // Eventos para aceptar y rechazar
    solicitudDiv.querySelector('.aceptar-solicitud').addEventListener('click', () => {
        gestionarSolicitud(solicitud.id_solicitud, 'aceptada');
    });

    solicitudDiv.querySelector('.rechazar-solicitud').addEventListener('click', () => {
        gestionarSolicitud(solicitud.id_solicitud, 'rechazada');
    });

    return solicitudDiv;
}
function gestionarSolicitud(idSolicitud, estado) {
    fetch('./php/gestionarSolicitud.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id_solicitud=${idSolicitud}&estado=${estado}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            cargarSolicitudes(); // Recargar la lista de solicitudes
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function cargarSolicitudes() {
    fetch('./php/obtenerSolicitudes.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Selecciona el contenedor correcto
                const contenedorSolicitudes = document.querySelector('.contenidoGeneralInfoSoli');
                contenedorSolicitudes.innerHTML = ''; // Limpia el contenedor antes de agregar

                if (data.solicitudes.length === 0) {
                    contenedorSolicitudes.innerHTML = '<p>No tienes solicitudes pendientes</p>';
                    return;
                }

                data.solicitudes.forEach(solicitud => {
                    const solicitudDiv = crearSolicitudDiv(solicitud);
                    contenedorSolicitudes.appendChild(solicitudDiv); // Agrega cada solicitud
                });
            } else {
                console.error('Error al cargar solicitudes:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', cargarSolicitudes);
