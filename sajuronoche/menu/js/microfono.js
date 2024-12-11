// Variables globales
let audioStream = null;
let audioContext = null;
let audioInput = null;
let micEnabled = false; // Estado del micrófono
const peerConnection = new RTCPeerConnection();

// Función para habilitar el micrófono
async function enableMicrophone() {
    try {
        // Solicitar acceso al micrófono del usuario
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Micrófono activado:", audioStream);

        // Inicializar el contexto de audio y la fuente de entrada
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioInput = audioContext.createMediaStreamSource(audioStream);
    } catch (error) {
        console.error("Error al activar el micrófono:", error);
        audioStream = null; // Limpia el flujo en caso de error
    }
}

// Función para desactivar el micrófono
function disableMicrophone() {
    if (audioStream && audioStream.getTracks) {
        // Detener todas las pistas del flujo de audio
        audioStream.getTracks().forEach(track => track.stop());
        console.log("Micrófono desactivado");

        // Liberar recursos
        audioStream = null;
        audioContext = null;
        audioInput = null;
    } else {
        console.log("El micrófono no está activo o el flujo no es válido");
    }
}

// Alternar el estado del micrófono mediante un botón
document.getElementById("micToggle").addEventListener("click", async () => {
    if (!micEnabled) {
        await enableMicrophone(); // Activa el micrófono
        if (audioStream) {
            micEnabled = true;
            document.getElementById("micToggle").innerText = "Desactivar Micrófono";

            // Agregar las pistas de audio al PeerConnection
            audioStream.getTracks().forEach(track => peerConnection.addTrack(track, audioStream));
        }
    } else {
        disableMicrophone(); // Desactiva el micrófono
        micEnabled = false;
        document.getElementById("micToggle").innerText = "Activar Micrófono";
    }
});

// Configuración del PeerConnection
peerConnection.ontrack = event => {
    console.log("Recibiendo audio remoto...");
    const audioElement = document.createElement("audio");
    audioElement.srcObject = event.streams[0];
    audioElement.play();
};

// Análisis de voz (detectar si TÚ estás hablando)
function setupVoiceAnalysis() {
    if (audioContext && audioInput) {
        const analyser = audioContext.createAnalyser();
        audioInput.connect(analyser);

        // Crear un arreglo para los datos de frecuencia
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        // Función para analizar los niveles de audio
        function detectSpeech() {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            return average > 10; // Ajusta este umbral según tu entorno
        }

        // Monitoreo constante de tu propia voz
        setInterval(() => {
            const speaking = detectSpeech();
            console.log(speaking ? "Estás hablando..." : "Silencio...");
            // También puedes mostrarlo en pantalla:
            document.getElementById("voiceStatus").innerText = speaking ? "Hablando" : "Silencio";
        }, 1000); // Cada 500 ms
    } else {
        console.error("No se puede realizar el análisis de voz, faltan configuraciones");
    }
}

// Configuración inicial del análisis de voz
document.getElementById("startVoiceAnalysis").addEventListener("click", () => {
    if (micEnabled && audioContext && audioInput) {
        setupVoiceAnalysis();
    } else {
        console.log("El micrófono debe estar activado para iniciar el análisis de voz");
    }
});