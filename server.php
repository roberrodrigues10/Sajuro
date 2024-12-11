<?php

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

require __DIR__ . '/vendor/autoload.php';

class Chat implements MessageComponentInterface {
    protected $clients;
    protected $salas; // Estructura para mantener jugadores y detalles por sala
    private $obtenerPartida = []; // Mantener información de las salas, incluyendo el límite de jugadores
    private function obtenerPartida($codigoSala, $usuario) {
        // Verificar si la sala existe
        if (isset($this->salas[$codigoSala])) {
            error_log('Sala encontrada: ' . json_encode($this->salas[$codigoSala]));
            
            // Verificar si la partida está asociada a la sala
            if (isset($this->salas[$codigoSala]['partida'])) {
                error_log('Partida encontrada: ' . json_encode($this->salas[$codigoSala]['partida']));
                return $this->salas[$codigoSala]['partida'];
            } else {
                error_log('No se encontró partida asociada a la sala: ' . $codigoSala);
            }
        } else {
            error_log('No se encontró la sala con el código: ' . $codigoSala);
        }
        
        return null; // Si no se encuentra la partida
    }
    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->salas = [];
    }

    public function onOpen(ConnectionInterface $conn){
        $queryParams = $conn->httpRequest->getUri()->getQuery();
        parse_str($queryParams, $params);
        
        $conn->sala = $params['codigoSala'] ?? null;
        $conn->nombreUsuario = $params['nombreUsuario'] ?? 'Invitado';
        
        $this->clients->attach($conn);
    }


    public function onMessage(ConnectionInterface $from, $msg) {
        try {
            $this->log("Mensaje recibido", [
                'mensaje' => $msg,
                'from_resourceId' => $from->resourceId
            ]);

            $data = json_decode($msg, true);

            if (!$data) {
                $this->handleError($from, "Mensaje JSON inválido");
                return;
            }

            // Validar que se proporcione código de sala
            if (!isset($data['codigoSala'])) {
                $this->handleError($from, "Falta código de sala");
                return;
            }

            $codigoSala = $data['codigoSala'];

            // Procesar el mensaje según la acción
            if (isset($data['action'])) {
                switch ($data['action']) {
                    case 'sala_creada':
                        $this->procesarSalaCreada($codigoSala, $data);
                        break;

                    case 'jugador_unido':
                        $this->procesarJugadorUnido($codigoSala, $data);
                        break;

                    case 'solicitar_jugadores':
                        $this->enviarListaJugadores($from, $codigoSala);
                        break;

                    case 'actualizar_jugadores':
                        $this->actualizarJugadores($codigoSala, $data);
                        break;

                    case 'mensaje_chat':
                        $this->procesarMensajeChat($codigoSala, $data);
                        break;

                    case 'actualizar_rondas':
                        $this->actualizarRondas($codigoSala, $data);
                        break;

                    case 'actualizar_tiempo':
                        $this->actualizarTiempo($codigoSala, $data);
                        break;

                    case 'actualizar_modo_juego':
                        $this->actualizarModoJuego($codigoSala, $data);
                        break;

                    case 'iniciar_partida':
                        $this->iniciarPartida($codigoSala);
                        break;
                    case 'audio_user_joined':
                        $this->procesarUsuarioAudio($codigoSala, $data, $from);
                        break;
                    case 'actualizar_limite_jugadores':
                        $this->actualizarLimiteJugadores($codigoSala, $data, $from);
                        break;
                    case 'oferta':
                        // Enviar la oferta a todos los jugadores excepto al que la envió
                        foreach ($this->salas[$codigoSala]['jugadores'] as $jugador) {
                            if ($jugador['username'] !== $data['nombreUsuario']) {
                                $this->broadcastToClient($jugador['client'], json_encode([
                                    'action' => 'oferta',
                                    'codigo_sala' => $codigoSala,
                                    'oferta' => $data['oferta'],
                                    'origen' => $data['nombreUsuario']
                                ]));
                            }
                        }
                        break;
                    
                    case 'respuesta':
                        // Enviar la respuesta a la persona que hizo la oferta
                        $this->broadcastToClient($this->salas[$codigoSala]['jugadores'][$data['destino']]['client'], json_encode([
                            'action' => 'respuesta',
                            'codigo_sala' => $codigoSala,
                            'respuesta' => $data['respuesta'],
                            'origen' => $data['nombreUsuario']
                        ]));
                        break;
                    
                    case 'nuevo_ICE_candidate':
                        // Enviar el candidato ICE a los demás jugadores
                        foreach ($this->salas[$codigoSala]['jugadores'] as $jugador) {
                            if ($jugador['username'] !== $data['origen']) {
                                $this->broadcastToClient($jugador['client'], json_encode([
                                    'action' => 'nuevo_ICE_candidate',
                                    'codigo_sala' => $codigoSala,
                                    'candidate' => $data['candidate'],
                                    'origen' => $data['origen']
                                ]));
                            }
                        }
                        break;
                        case 'espiar_partida':
                            $codigoSala = $data['codigoSala'];
                            $usuarioObjetivo = $data['usuario']; // El jugador que será espiado
                        
                            foreach ($this->clients as $client) {
                                if ($client !== $from && isset($client->sala) && $client->sala === $codigoSala) {
                                    // Si el cliente corresponde al usuario objetivo, enviar el mensaje
                                    if ($client->nombreUsuario === $usuarioObjetivo) {
                                        $client->send(json_encode([
                                            'action' => 'espiar_partida',
                                            'codigoSala' => $codigoSala,
                                            'usuario' => $usuarioObjetivo,
                                            'estado_partida' => 'partida en curso' // Puedes ajustar este valor según tu lógica
                                        ]));
                                    }
                                }
                            }
                            break;                        
                    default:
                        $this->handleError($from, "Acción no reconocida: " . $data['action']);
                }
            } else {
                $this->handleError($from, "Acción no especificada");
            }

        } catch (\Exception $e) {
            $this->log("Error procesando mensaje", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            $this->handleError($from, "Error interno del servidor: " . $e->getMessage());
        }
    }

    private function procesarSalaCreada($codigoSala, $data) {
        if (!isset($data['jugadores'])) {
            $this->log("Error: No se proporcionaron jugadores al crear sala", ['codigoSala' => $codigoSala]);
            return;
        }

        $this->salas[$codigoSala] = ['jugadores' => $data['jugadores']];
        $this->broadcastToSala($codigoSala, $data, "Sala creada correctamente");
    }

    private function procesarJugadorUnido($codigoSala, $data) {
        if (!isset($data['nombreUsuario'])) {
            $this->log("Error: No se proporcionó nombre de usuario", ['codigoSala' => $codigoSala]);
            return;
        }

        if (!isset($this->salas[$codigoSala]['jugadores'])) {
            $this->salas[$codigoSala]['jugadores'] = [];
        }

        $nuevoJugador = [
            'username' => $data['nombreUsuario'],
            'avatar' => $data['avatar']
            
        ];
        $this->salas[$codigoSala]['jugadores'][] = $nuevoJugador;

        $this->broadcastToSala($codigoSala, [
            'action' => 'jugador_unido',
            'codigoSala' => $codigoSala,
            'nombreUsuario' => $data['nombreUsuario']
        ], "Jugador unido a la sala");
    }

    private function enviarListaJugadores(ConnectionInterface $cliente, $codigoSala) {
        $jugadores = $this->salas[$codigoSala]['jugadores'] ?? [];
        $respuesta = [
            'action' => 'lista_jugadores',
            'codigoSala' => $codigoSala,
            'jugadores' => $jugadores
        ];
        $this->broadcastToClient($cliente, $respuesta, "Lista de jugadores solicitada");
    }
    private function procesarUsuarioAudio($codigoSala, $data, ConnectionInterface $from) {
        // Validar que el usuario envió la información requerida
        if (!isset($data['userId']) || !isset($data['username'])) {
            $this->handleError($from, "Faltan datos de usuario para unirse al audio.");
            return;
        }
    
        // Asegurarte de que la sala exista
        if (!isset($this->salas[$codigoSala])) {
            $this->handleError($from, "La sala especificada no existe.");
            return;
        }
    
        // Registrar al usuario en la sala
        $usuarioAudio = [
            'userId' => $data['userId'],
            'username' => $data['username'],
            'isAdmin' => $data['isAdmin'] ?? false,
        ];
    
        // Opcional: agregar lógica específica para gestionar usuarios de audio
        $this->salas[$codigoSala]['usuarios_audio'][] = $usuarioAudio;
    
        // Notificar a los usuarios de la sala que un nuevo usuario se unió al audio
        $mensaje = [
            'action' => 'audio_user_joined',
            'codigoSala' => $codigoSala,
            'userId' => $data['userId'],
            'username' => $data['username'],
            'isAdmin' => $data['isAdmin'] ?? false
        ];
    
        $this->broadcastToSala($codigoSala, $mensaje, "Usuario unido al sistema de audio.");
    }
    

    private function actualizarJugadores($codigoSala, $data) {
        if (!isset($data['jugadores'])) {
            $this->log("Error: No se proporcionaron jugadores para actualizar", ['codigoSala' => $codigoSala]);
            return;
        }
        $this->salas[$codigoSala]['jugadores'] = $data['jugadores'];
        $this->broadcastToSala($codigoSala, $data, "Jugadores actualizados");
    }

    private function procesarMensajeChat($codigoSala, $data) {
        if (!isset($data['nombreUsuario']) || !isset($data['mensaje'])) {
            $this->log("Error: Mensaje de chat incompleto", ['codigoSala' => $codigoSala]);
            return;
        }

        $mensaje = [
            'action' => 'mensaje_chat',
            'codigoSala' => $codigoSala,
            'nombreUsuario' => $data['nombreUsuario'],
            'mensaje' => $data['mensaje']
        ];
        $this->broadcastToSala($codigoSala, $mensaje, "Mensaje de chat enviado");
    }

    private function actualizarRondas($codigoSala, $data) {
        if (!isset($data['numRondas'])) {
            $this->log("Error: Número de rondas no proporcionado", ['codigoSala' => $codigoSala]);
            return;
        }
        $this->salas[$codigoSala]['numRondas'] = $data['numRondas'];
        $this->broadcastToSala($codigoSala, $data, "Rondas actualizadas");
    }

    private function actualizarTiempo($codigoSala, $data) {
        if (!isset($data['numTiempo'])) {
            $this->log("Error: Tiempo no proporcionado", ['codigoSala' => $codigoSala]);
            return;
        }
        $this->salas[$codigoSala]['numTiempo'] = $data['numTiempo'];
        $this->broadcastToSala($codigoSala, $data, "Tiempo actualizado");
    }

    private function actualizarModoJuego($codigoSala, $data) {
        if (!isset($data['modo'])) {
            $this->log("Error: Modo de juego no proporcionado", ['codigoSala' => $codigoSala]);
            return;
        }
        $this->salas[$codigoSala]['modoJuego'] = $data['modo'];
        $this->broadcastToSala($codigoSala, $data, "Modo de juego actualizado");
    }

    private function iniciarPartida($codigoSala) {
        // Verificar si la sala existe
        if (!isset($this->salas[$codigoSala])) {
            $this->broadcastToSala($codigoSala, json_encode([
                'action' => 'error',
                'codigoSala' => $codigoSala,
                'mensaje' => 'La sala no existe.'
            ]));
            return;
        }
    
        // Verificar si la clave 'jugadores' existe y es un array
        if (!isset($this->salas[$codigoSala]['jugadores']) || !is_array($this->salas[$codigoSala]['jugadores'])) {
            $this->salas[$codigoSala]['jugadores'] = []; // Inicializar si no existe
        }
    
        // Verificar si hay jugadores en la sala
        if (count($this->salas[$codigoSala]['jugadores']) === 0) {
            $this->broadcastToSala($codigoSala, json_encode([
                'action' => 'error',
                'codigoSala' => $codigoSala,
                'mensaje' => 'No hay jugadores en la sala. No se puede iniciar la partida.'
            ]));
            return;
        }
    
        // Verificar si la partida ya ha sido creada
        if (!isset($this->salas[$codigoSala]['partida'])) {
            // Inicializar la partida
            $this->salas[$codigoSala]['partida'] = [
                'estado' => 'espera', // Estado inicial de espera
                'jugadores' => $this->salas[$codigoSala]['jugadores'], // Asignar jugadores actuales
                'movimientos' => [] // Inicializar movimientos
            ];
        }
    
        // Cambiar el estado de la partida a "en curso"
        $this->salas[$codigoSala]['partida']['estado'] = 'en curso';
    
        // Notificar a todos los jugadores de la sala que la partida ha comenzado
        $this->broadcastToSala($codigoSala, json_encode([
            'action' => 'partida_iniciada',
            'codigoSala' => $codigoSala,
            'mensaje' => 'La partida ha comenzado'
        ]));
    }
    
    private function actualizarLimiteJugadores($codigoSala, $data, $from) {
        // Validar que se proporcionó un número válido de jugadores
        if (!isset($data['numJugadores']) || !is_numeric($data['numJugadores'])) {
            $this->handleError($from, "Número de jugadores inválido");
            return;
        }
    
        $nuevoLimite = $data['numJugadores'];
        $jugadoresActuales = count($this->salas[$codigoSala]['jugadores']);
    
        // Verificar si el nuevo límite es menor que los jugadores actuales
        if ($nuevoLimite < $jugadoresActuales) {
            $this->handleError($from, "El límite no puede ser menor que los jugadores actuales");
            return;
        }
    
        // Actualizar el límite
        $this->salas[$codigoSala]['limite_jugadores'] = $nuevoLimite;
    
        // Notificar a todos los jugadores en la sala
        $this->broadcastToSala($codigoSala, [
            'action' => 'actualizar_limite_jugadores',
            'codigoSala' => $codigoSala,
            'limite_jugadores' => $nuevoLimite,  // Cambié 'numJugadores' a 'limite_jugadores'
            'jugadoresActuales' => $jugadoresActuales
        ]);
    }
    
    public function onClose(ConnectionInterface $conn) {
        $this->log("Conexión cerrada", [
            'resourceId' => $conn->resourceId
        ]);
        $this->clients->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        $this->log("Error en la conexión", [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        $conn->close();
    }

    // Enviar mensaje a todos en la sala específica
    protected function broadcastToSala($codigoSala, $data, $logMessage = '') {
        $mensaje = is_array($data) ? json_encode($data) : $data;
        
        $this->log("Broadcast a sala", [
            'codigoSala' => $codigoSala,
            'mensaje' => $logMessage
        ]);
    
        // Almacenar el código de sala en la conexión del cliente
        foreach ($this->clients as $client) {
            // Almacenar el código de sala como una propiedad de la conexión
            $client->codigoSala = $codigoSala;
            
            // Solo enviar a clientes de la misma sala
            if ($client->codigoSala === $codigoSala) {
                $client->send($mensaje);
            }
        }
    }

    // Enviar mensaje a un solo cliente
    protected function broadcastToClient(ConnectionInterface $client, $data, $logMessage = '') {
        $mensaje = is_array($data) ? json_encode($data) : $data;
        
        $this->log("Mensaje a cliente", [
            'resourceId' => $client->resourceId,
            'mensaje' => $logMessage
        ]);

        $client->send($mensaje);
    }

    // Método de manejo de errores
    protected function handleError(ConnectionInterface $client, $mensaje) {
        // Construye el mensaje de error con una acción específica
        $error = [
            'action' => 'error', // Acción explícita
            'mensaje' => $mensaje,
            'detalle' => 'Campo faltante o dato inválido' // Más detalles si es necesario
        ];
    
        // Registra el error en los logs
        $this->log("Error manejado", [
            'mensaje' => $mensaje,
            'cliente' => $client->resourceId
        ]);
    
        // Envía el mensaje de error al cliente
        $client->send(json_encode($error));
    }
    
    

    // Método de registro de eventos
    protected function log($evento, $detalles = []) {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[{$timestamp}] {$evento} ";
        
        foreach ($detalles as $key => $value) {
            $logMessage .= "| {$key}: " . (is_array($value) ? json_encode($value) : $value) . " ";
        }
        
        echo $logMessage . "\n";
    }
}


$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new Chat()
        )
    ),
    8080
);

echo "Servidor WebSocket corriendo en el puerto 8080\n";
$server->run();
?>