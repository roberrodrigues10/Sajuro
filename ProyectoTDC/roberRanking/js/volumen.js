document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById('gameAudio');
    const volumeControl = document.querySelector('.wrapper input[type="range"]');
    const volumeDisplay = document.querySelector('.wrapper .slide-value');
    const icon = document.querySelector('.wrapper svg');

    let isMuted = true;

    // Función para actualizar el icono
    function updateIcon() {
        if (isMuted || audio.volume === 0) {
            icon.innerHTML = '<path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06m7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0"/>';
        } else {
            icon.innerHTML = '<path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>';
        }
    }

    // Inicializar el volumen desde el Local Storage
    const savedVolume = localStorage.getItem('audioVolume') || 0;
    const savedIsMuted = localStorage.getItem('audioMuted') === 'true';

    audio.volume = savedVolume;
    volumeControl.value = savedVolume * 100;
    volumeDisplay.textContent = volumeControl.value;
    isMuted = savedIsMuted || savedVolume === 0;
    updateIcon();

    // Reproducir el audio si no está muteado y no está pausado
    if (!isMuted && audio.paused) {
        audio.play();
    }

    // Evento para el control de volumen
    volumeControl.addEventListener('input', function () {
        const volume = this.value / 100;
        audio.volume = volume;
        volumeDisplay.textContent = this.value;
        isMuted = volume === 0;

        // Guardar en Local Storage
        localStorage.setItem('audioVolume', volume);
        localStorage.setItem('audioMuted', isMuted);

        updateIcon();

        // Iniciar la reproducción si no está muteado
        if (!isMuted && audio.paused) {
            audio.play();
        }
    });

    // Evento para el icono (mutear/desmutear)
    icon.addEventListener('click', function () {
        if (isMuted) {
            audio.volume = volumeControl.value / 100;
            if (audio.paused) {
                audio.play();
            }
        } else {
            audio.volume = 0;
        }

        isMuted = !isMuted;

        // Guardar en Local Storage
        localStorage.setItem('audioVolume', audio.volume);
        localStorage.setItem('audioMuted', isMuted);

        updateIcon();
    });
});