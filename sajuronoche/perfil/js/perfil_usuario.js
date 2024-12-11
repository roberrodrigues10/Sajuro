async function cargarPerfilVisitado(idUsuarioVisitado) {
    try {
        const response = await fetch(`./php/vistaPerfil.php?id_usuario=${idUsuarioVisitado}`);
        const data = await response.json();

        if (data.success) {
            const perfil = data.perfil;

            // Actualizar el nivel
            const nivelElement = document.querySelector('.NivelPerfil h4 span');
            nivelElement.textContent = perfil.nivel;

            // Actualizar las cantidades de esferas en el primer contenedor
            document.querySelector('.contenidoCantidadEsferasDoradas h1').textContent = peprfil.esfera_dorada;
            document.querySelector('.contenidoCantidadEsferasAzules h1').textContent = perfil.esfera_azul;
            document.querySelector('.contenidoCantidadEsferasRojas h1').textContent = perfil.esfera_roja;

            // Actualizar las cantidades de esferas en el segundo contenedor
            document.querySelector('.CantidadEsferaDoradaPerfil h3').textContent = perfil.esfera_dorada;
            document.querySelector('.CantidadEsferaAzulPerfil h3').textContent = perfil.esfera_azul;
            document.querySelector('.CantidadEsferaRojaPerfil h3').textContent = perfil.esfera_roja;

            // Actualizar el avatar
            const avatarElement = document.getElementById('avatar');
            avatarElement.src = `data:image/png;base64,${perfil.img_avatar}`;

            // Actualizar el nombre del usuario
            const usuarioElement = document.getElementById('usuario');
            usuarioElement.textContent = perfil.nombre_usuario;
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error al cargar el perfil:', error);
    }
}

// Llamar a la función con el ID del usuario visitado
document.addEventListener('DOMContentLoaded', () => {
    const idUsuarioVisitado = obtenerIdUsuarioVisitado(); // Define cómo obtener este ID
    cargarPerfilVisitado(idUsuarioVisitado);
});

function obtenerIdUsuarioVisitado() {
    // Implementa tu lógica para obtener el ID del usuario visitado.
    const params = new URLSearchParams(window.location.search);
    return params.get('id_usuario');
}
