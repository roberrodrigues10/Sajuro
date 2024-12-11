function obtenerRankings() {
    fetch('./php/ranking.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data); // Para depurar{}
            console.log(data.ranking_semanal)
            document.getElementById('ranking-semanal').innerHTML = generarHTMLRanking(data.ranking_semanal);
            document.getElementById('ranking-Mundial').innerHTML = generarHTMLRanking(data.ranking_mundial);
        })
        .catch(error => {
            console.error('Error al obtener los rankings:', error);
        });
}

function generarHTMLRanking(rankings) {
    console.log('Rankings a procesar:', rankings); // Para depurar
    const avatarAmigo = 'http://localhost/sajuro/sajuronoche/perfil/img/';
    return rankings.map((usuario, index) => {
        console.log('Procesando usuario:', usuario); // Para ver cada usuario y su avatar
        
        return `
            <div class="usuario-ranking">
                <div class="numero">${index + 1}.</div>
                <div class="calabera">
                    <img src="${avatarAmigo}/${usuario.avatar}" 
                         alt="Avatar de ${usuario.nombre_usuario}"
                         class="cala"
                         onerror="console.log('Error cargando avatar para:', usuario.nombre_usuario)"/> 
                </div>
                <div class="usuario">${usuario.nombre_usuario}</div>
                <div class="point-general">
                    <div class="sajuro-points">SajuroPoints</div>
                    <div class="contenido-points">${usuario.puntuacion_total}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Llamar a la función para obtener rankings al cargar la página
window.onload = obtenerRankings;
document.head.appendChild(styleSheet);
