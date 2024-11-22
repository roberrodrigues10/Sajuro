// audioSystem.js
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
    }

    // Inicializar el sistema de audio
    async initialize(isAdmin = false) {
        this.isAdmin = isAdmin;
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ 
                audio: true,
                echoCancellation: true,
                noiseSuppression: true
            });

            // Crear botón de micrófono si no existe
            this.createAudioControls();

            // Notificar a la sala que hay un nuevo usuario con audio
            this.webSocket.send(JSON.stringify({
                action: 'audio_user_joined',
                codigo_sala: this.salaActual,
                userId: sessionStorage.getItem('usuarioId'),
                username: sessionStorage.getItem('nombreUsuario'),
                isAdmin: this.isAdmin
            }));

            return true;
        } catch (error) {
            console.error('Error al inicializar el audio:', error);
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

        // Si es admin, agregar botones de control para otros usuarios
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
        const data = JSON.parse(event.data);
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
                if (data.userId === sessionStorage.getItem('usuarioId')) {
                    this.setMute(true);
                }
                break;
            case 'mute_all':
                if (!this.isAdmin) {
                    this.setMute(true);
                }
                break;
        }
    }

    // Manejar nueva conexión de audio
    async handleNewAudioUser(data) {
        if (data.userId !== sessionStorage.getItem('usuarioId')) {
            const peerConnection = new RTCPeerConnection(this.peerConfiguration);
            this.peerConnections.set(data.userId, peerConnection);

            // Agregar stream local
            this.localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, this.localStream);
            });

            // Configurar eventos ICE
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    this.webSocket.send(JSON.stringify({
                        action: 'audio_ice_candidate',
                        codigo_sala: this.salaActual,
                        candidate: event.candidate,
                        userId: data.userId
                    }));
                }
            };

            // Crear y enviar oferta
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            this.webSocket.send(JSON.stringify({
                action: 'audio_offer',
                codigo_sala: this.salaActual,
                offer: offer,
                userId: data.userId
            }));
        }
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

export default SajuroAudioSystem;
