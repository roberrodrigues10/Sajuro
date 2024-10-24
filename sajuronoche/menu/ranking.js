function obtenerRankings() {
    fetch('ranking.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(data => {
            // Mostrar rankings
            document.getElementById('ranking-semanal').innerHTML = generarHTMLRanking(data.ranking_semanal);
            document.getElementById('ranking-mundial').innerHTML = generarHTMLRanking(data.ranking_mundial);
        })
        .catch(error => {
            console.error('Error al obtener los rankings:', error);
        });
}

function generarHTMLRanking(rankings) {
    return rankings.map((usuario, index) => `
        <div class="usuario-ranking">
            <div class="numero">${index + 1}.</div>
            <div class="calabera">
                <img src="" alt="" class="cala">
            </div>
            <div class="usuario">${usuario.nombre_usuario}</div>
            <div class="point-general">
                <div class="sajuro-points">SajuroPoints</div>
                <div class="contenido-points">${usuario.puntuacion_total}</div>
            </div>
        </div>
    `).join('');
}

// Llamar a la función para obtener rankings al cargar la página
window.onload = obtenerRankings;