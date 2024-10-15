const amigos = [
    { username: "Usuario1", puntos: 1080, activo: true },
    { username: "Usuario2", puntos: 1800, activo: false },
    { username: "Usuario3", puntos: 2000, activo: true }
];

// Función para actualizar la lista de amigos
function mostrarAmigos(amigos) {
    const amigosActivosDiv = document.getElementById('amigos-activos');
    amigosActivosDiv.innerHTML = ''; // Limpiar la lista actual

    amigos.forEach(amigo => {
        const amigoDiv = document.createElement('div');
        amigoDiv.classList.add('usuarios');
        amigoDiv.style.display = 'block'; // Asegúrate de que cada amigo esté en bloque

        amigoDiv.innerHTML = `
            <img src="css/img/conectado.png" alt="" width="270px">
            <div class="logo-usuario-conectado">
                <img src="css/img/avatar.png" alt="" class="cala ${amigo.activo ? 'activo' : ''}">
            </div>
            <div class="usuario-conectado">${amigo.username}</div>
            <div class="point-general point-conectados">
                <div class="sajuro-points point-color-conectados">SajuroPoints</div>
                <div class="contenido-points point-color-conectados puntajes">${amigo.puntos}</div>
                <div class="estado">
                    <div class="en-linea">
                        <img src="css/img/${amigo.activo ? 'enlinea' : 'ofline'}.png" alt="" width="40px" class="logo-enlinea">
                    </div>
                </div>
            </div>
        `;

        amigosActivosDiv.appendChild(amigoDiv);
    });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarAmigos(amigos);
});
