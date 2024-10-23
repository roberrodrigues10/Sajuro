window.onload = function() {
    fetch('amigos.php')
        .then(response => response.json())
        .then(amigos => {
            const contenedor = document.querySelector('.ContenedorAmigosAmigos');
            contenedor.innerHTML = ''; // Limpiar contenido anterior
            amigos.forEach(amigo => {
                const amigoHTML = `
                    <div class="iconoAmigosAmigos">
                        <img src="./img/${amigo.avatar}" alt="Avatar de ${amigo.nombre_usuario}">
                    </div>
                    <div class="nombreAmigoAmigos">
                        <h3>${amigo.nombre_usuario}</h3>
                    </div>
                    <div class="contenedorIconosAmigosAmigos">
                        <div id="iconoVistaAmigos">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFFFFF" viewBox="0 0 16 16">
                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                            </svg>
                        </div>
                        <div class="iconoMensajeAmigos">
                            <label for="">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFFFFF" class="bi bi-send-fill" viewBox="0 0 16 16">
                                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                                </svg>
                            </label>
                        </div>
                    </div>
                `;
                contenedor.innerHTML += amigoHTML;
            });
        });
        const inputBuscar = document.querySelector('input[type="text"]');

inputBuscar.addEventListener('input', function() {
    const filtro = inputBuscar.value.toLowerCase();
    const amigos = document.querySelectorAll('.nombreAmigoAmigos h3');
    amigos.forEach(amigo => {
        const nombre = amigo.textContent.toLowerCase();
        if (nombre.includes(filtro)) {
            amigo.parentElement.parentElement.style.display = 'block';
        } else {
            amigo.parentElement.parentElement.style.display = 'none';
        }
    });
});

}
