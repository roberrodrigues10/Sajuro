class SajuroAudioSystem {
    constructor(webSocket, salaActual) {
        this.webSocket = webSocket;
        this.salaActual = salaActual;
        this.localStream = null;
        this.peerConnections = new Map();
        this.isAdmin = false;
        this.isMuted = false;

        // Configuración de WebRTC
        this.peerConfiguration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };

        // Bindings
        this.handleWebSocketMessage = this.handleWebSocketMessage.bind(this);
        this.webSocket.addEventListener('message', this.handleWebSocketMessage);

        // Verificaciones de compatibilidad
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("Tu navegador no soporta `getUserMedia`. Actualiza o usa otro navegador.");
        }
        
        if (!window.RTCPeerConnection) {
            console.error("Tu navegador no soporta WebRTC. Actualiza o usa otro navegador.");
        }
    }

    // Inicializar el sistema de audio
    async initialize(isAdmin = false) {
        this.isAdmin = isAdmin;

        // Validar que `salaActual` esté definida
        if (!this.salaActual) {
            console.error("Error: `salaActual` no está definido. No se puede inicializar el audio.");
            return false;
        }

        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ 
                audio: true,
                echoCancellation: true,
                noiseSuppression: true
            });
    
            console.log("Micrófono inicializado correctamente:", this.localStream);
    
            this.createAudioControls();
    
            // Enviar mensaje al WebSocket para unirse al audio
            this.webSocket.send(JSON.stringify({
                action: 'audio_user_joined',
                codigo_sala: this.salaActual,
                userId: localStorage.getItem('usuarioId'),
                username: localStorage.getItem('nombreUsuario'),
                isAdmin: this.isAdmin
            }));
    
            return true;
        } catch (error) {
            console.error("Error al inicializar el audio:", error);

            // Manejar errores comunes de `getUserMedia`
            switch (error.name) {
                case "NotAllowedError":
                    console.error("Permiso denegado para acceder al micrófono.");
                    break;
                case "NotFoundError":
                    console.error("No se encontró un micrófono conectado.");
                    break;
                case "OverconstrainedError":
                    console.error("La configuración de audio no es compatible con este dispositivo.");
                    break;
                default:
                    console.error("Error desconocido al acceder al micrófono:", error.message);
            }
            return false;
        }
    }

    // Crear controles de audio en la UI
    createAudioControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'audio-controls';
        controlsContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 1000;
        `;

        // Botón de micrófono
        const micButton = document.createElement('button');
        micButton.innerHTML = '🎤';
        micButton.style.cssText = `
            padding: 10px;
            border-radius: 50%;
            border: none;
            background: #c19a67;
            cursor: pointer;
            width: 40px;
            height: 40px;
        `;
        micButton.onclick = () => this.toggleMute();

        // Si es admin, agregar botón para silenciar a todos
        if (this.isAdmin) {
            const muteAllButton = document.createElement('button');
            muteAllButton.innerHTML = '🔇';
            muteAllButton.style.cssText = micButton.style.cssText;
            muteAllButton.onclick = () => this.muteAll();
            controlsContainer.appendChild(muteAllButton);
        }

        controlsContainer.appendChild(micButton);
        document.body.appendChild(controlsContainer);
    }

    // Manejar mensajes de WebSocket relacionados con audio
    handleWebSocketMessage(event) {
        try {
            const data = JSON.parse(event.data);
            console.log("Mensaje recibido:", data); // Esto te ayuda a ver lo que realmente se recibe
            
            if (data.error) {
                console.error(`Error recibido del servidor WebSocket: ${data.error}`);
                if (data.detalle) {
                    console.error(`Detalles: ${data.detalle}`);
                }
                return; // Termina el manejo para este caso
            }
    
            if (!data.action) {
                console.error("Mensaje WebSocket no contiene una acción válida:", data);
                return;
            }
    
            switch (data.action) {
                case 'audio_user_joined':
                    this.handleNewAudioUser(data);
                    break;
                case 'audio_offer':
                    this.handleAudioOffer(data);
                    break;
                case 'audio_answer':
                    this.handleAudioAnswer(data);
                    break;
                case 'audio_ice_candidate':
                    this.handleNewICECandidate(data);
                    break;
                case 'mute_user':
                    if (data.userId === localStorage.getItem('usuarioId')) {
                        this.setMute(true);
                    }
                    break;
                case 'mute_all':
                    if (!this.isAdmin) {
                        this.setMute(true);
                    }
                    break;
                case 'error':
                    console.error(`Error recibido: ${data.mensaje}`);
                    if (data.detalle) {
                        console.error(`Detalles del error: ${data.detalle}`);
                    }
                    break;
                case 'lista_jugadores':
                    console.log("Lista de jugadores recibida:", data.jugadores);
                    // Aquí puedes manejar la lógica para actualizar los jugadores
                    break;

                default:
                    console.warn("Acción desconocida en el mensaje WebSocket:", data.action);
            }
        } catch (error) {
            console.error("Error al procesar mensaje WebSocket:", error);
        }
    }
    

    // Manejar nueva conexión de audio
    async handleNewAudioUser(data) {
        // Implementa la lógica para manejar un nuevo usuario de audio
        console.log("Nuevo usuario de audio:", data);
    }

    // Funciones de control de audio
    toggleMute() {
        this.setMute(!this.isMuted);
    }

    setMute(muted) {
        this.isMuted = muted;
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach(track => {
                track.enabled = !muted;
            });
        }
        // Actualizar UI
        const micButton = document.querySelector('.audio-controls button');
        if (micButton) {
            micButton.innerHTML = muted ? '🔇' : '🎤';
            micButton.style.background = muted ? '#ff4444' : '#c19a67';
        }
    }

    muteAll() {
        if (this.isAdmin) {
            this.webSocket.send(JSON.stringify({
                action: 'mute_all',
                codigo_sala: this.salaActual
            }));
        }
    }

    // Limpiar recursos
    cleanup() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        this.peerConnections.forEach(connection => connection.close());
        this.peerConnections.clear();
        const controls = document.querySelector('.audio-controls');
        if (controls) {
            controls.remove();
        }
    }
}

window.onerror = function (message, source, lineno, colno, error) {
    console.error("Error global atrapado:", { message, source, lineno, colno, error });
};

window.onunhandledrejection = function (event) {
    console.error("Promesa no manejada:", event.reason);
};

export default SajuroAudioSystem;
