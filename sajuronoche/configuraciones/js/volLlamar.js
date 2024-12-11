document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    const audio = document.getElementById('gameAudio');
    
    if (!audio) {
        console.error('Audio element not found');
        return;
    }

    console.log('Audio element found:', audio);

    // Cargar configuración guardada
    const savedVolume = parseFloat(localStorage.getItem('audioVolume')) || 0;
    const savedCurrentTime = parseFloat(localStorage.getItem('audioCurrentTime')) || 0;

    // Configurar audio
    audio.volume = savedVolume;
    audio.currentTime = savedCurrentTime;

    // Iniciar reproducción automática
    audio.muted = true;
    audio.play()
        .then(() => {
            setTimeout(() => {
                audio.muted = false;
                audio.volume = savedVolume;
            }, 100);
        })
        .catch(error => {
            console.error('Error al reproducir:', error);
        });

    // Guardar tiempo antes de salir
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('audioCurrentTime', audio.currentTime);
    });
});