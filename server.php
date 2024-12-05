<?php
// Mostrar todos los errores
ini_set('display_errors', 1);
error_reporting(E_ALL); // Reportar todos los errores (warnings, notices, etc.)

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

require __DIR__ . '/vendor/autoload.php';

class Chat implements MessageComponentInterface {
    protected $clients;
    protected $salas;
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
        $this->salas = []; // ['codigo_sala' => ['jugadores' => [], 'limite' => 0]]
    }

    public function onOpen(ConnectionInterface $conn) {
        echo "Nueva conexión: {$conn->resourceId}\n";
        $this->clients->attach($conn);
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        echo "Mensaje recibido: $msg\n";
        $data = json_decode($msg, true);

        if (isset($data['action'])) {
            $codigoSala = $data['codigo_sala'] ?? null;

            switch ($data['action']) {
                case 'sala_creada':
                    // Crear la sala con la lista inicial de jugadores
                    $this->salas[$codigoSala] = [
                        'jugadores' => [], 
                        'estado' => 'espera'
                    ];
                    $this->broadcastToSala($codigoSala, json_encode([
                        'action' => 'actualizar_jugadores',
                        'codigo_sala' => $codigoSala,
                        'jugadores' => $this->salas[$codigoSala]['jugadores']
                    ]));
                    break;

                case 'actualizar_limite_jugadores':
                    // Actualizar el límite en la sala y la base de datos
                    if (isset($this->salas[$codigoSala])) {
                        $this->salas[$codigoSala]['limite'] = $data['numJugadores'];

                        // Notificar a todos los jugadores en la sala
                        $this->broadcastToSala($codigoSala, json_encode([
                            'action' => 'actualizar_limite_jugadores',
                            'codigo_sala' => $codigoSala,
                            'numJugadores' => $data['numJugadores']
                        ]));
                    }
                    break;

                    case 'jugador_unido':
                        if (isset($this->salas[$codigoSala])) {
                            $sala = &$this->salas[$codigoSala];
                            
                            // Verificar si el jugador ya está en la lista
                            foreach ($sala['jugadores'] as $jugador) {
                                if ($jugador['username'] === $data['nombreUsuario']) {
                                    // No hacer nada si el jugador ya está en la lista
                                    return;
                                }
                            }
                    
                            // Agregar al nuevo jugador
                            $sala['jugadores'][] = [
                                'username' => $data['nombreUsuario'],
                                'avatar' => $data['avatar'] ?? '../../menu/css/img/avatar.png' // Avatar por defecto
                            ];
                    
                            // Enviar la lista de jugadores actualizada a todos los jugadores en la sala
                            $this->broadcastToSala($codigoSala, json_encode([
                                'action' => 'actualizar_jugadores',
                                'codigo_sala' => $codigoSala,
                                'jugadores' => $sala['jugadores']
                            ]));
                        } else {
                            // Sala no existe
                            $this->broadcastToClient($from, json_encode([
                                'action' => 'sala_llena',
                                'codigo_sala' => $codigoSala,
                                'mensaje' => 'La sala ha alcanzado el límite de jugadores.'
                            ]));
                        }
                        break;
                        
                case 'mensaje_chat':
                    $mensaje = [
                        'action' => 'mensaje_chat',
                        'codigo_sala' => $codigoSala,
                        'nombreUsuario' => $data['nombreUsuario'],
                        'mensaje' => $data['mensaje']
                    ];
                    $this->broadcastToSala($codigoSala, json_encode($mensaje));
                    break;

                    case 'solicitar_jugadores':
                        // Verificar si la sala existe
                        if (isset($this->salas[$codigoSala])) {
                            // Obtener los jugadores de la sala solicitada
                            $jugadores = $this->salas[$codigoSala]['jugadores'] ?? [];
                    
                            // Enviar la lista de jugadores al cliente que hizo la solicitud
                            $this->broadcastToClient($from, json_encode([
                                'action' => 'lista_jugadores',
                                'codigo_sala' => $codigoSala,
                                'jugadores' => $jugadores
                            ]));
                        } else {
                            // Enviar mensaje de error si la sala no existe
                            $this->broadcastToClient($from, json_encode([
                                'action' => 'error',
                                'codigo_sala' => $codigoSala,
                                'mensaje' => 'La sala no existe.'
                            ]));
                        }
                        break;
                case 'actualizar_modo_juego':
                    // Validar que la sala exista
                    if (isset($this->salas[$codigoSala])) {
                        // Guardar el modo de juego en la sala
                        $this->salas[$codigoSala]['modo_juego'] = $data['modo'];

                        // Notificar a todos los jugadores de la sala el nuevo modo
                        $this->broadcastToSala($codigoSala, json_encode([
                            'action' => 'actualizar_modo_juego',
                            'codigo_sala' => $codigoSala,
                            'modo' => $data['modo']
                        ]));
                    } else {
                        // Notificar al cliente que la sala no existe
                        $this->broadcastToClient($from, json_encode([
                            'action' => 'error',
                            'mensaje' => 'La sala no existe.'
                        ]));
                    }
                    break;

                    case 'partida_iniciada':
                        if (isset($this->salas[$codigoSala])) {
                            // Verificar si la partida ya está en curso o no
                            if (!isset($this->salas[$codigoSala]['partida'])) {
                                // Inicializar la partida si no está creada aún
                                $this->salas[$codigoSala]['partida'] = [
                                    'estado' => 'espera', // Estado de espera antes de comenzar
                                    'jugadores' => $this->salas[$codigoSala]['jugadores'], // Asigna los jugadores
                                    'movimientos' => [] // Inicializar movimientos
                                ];
                            }
                    
                            // Cambiar el estado de la partida a "en curso" si hay jugadores
                            if (count($this->salas[$codigoSala]['jugadores']) > 0) {
                                $this->salas[$codigoSala]['partida']['estado'] = 'en curso';
                                $this->broadcastToSala($codigoSala, json_encode([
                                    'action' => 'partida_iniciada',
                                    'codigo_sala' => $codigoSala,
                                    'mensaje' => 'La partida ha comenzado'
                                ]));
                            } else {
                                // Si no hay jugadores, no inicies la partida
                                $this->broadcastToSala($codigoSala, json_encode([
                                    'action' => 'error',
                                    'codigo_sala' => $codigoSala,
                                    'mensaje' => 'No hay suficientes jugadores para iniciar la partida.'
                                ]));
                            }
                        }
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

                            case 'mostrar_streaming':
                                // Obtener la sala y el jugador que está solicitando el streaming
                                $codigoSala = $data['codigo_sala'] ?? null;
                                $usuario = $data['usuario'] ?? null;
                            
                                if (isset($this->salas[$codigoSala])) {
                                    // Buscar el jugador en la sala
                                    $jugadores = $this->salas[$codigoSala]['jugadores'];
                                    $jugador = null;
                                    foreach ($jugadores as $j) {
                                        if ($j['username'] === $usuario) {
                                            $jugador = $j;
                                            break;
                                        }
                                    }
                            
                                    if ($jugador) {
                                        // Aquí puedes definir la URL o la lógica para obtener el streaming en vivo del jugador
                                        $urlStreaming = "ruta_del_streaming_en_vivo_" . $jugador['username'] . ".mp4"; // O la URL dinámica
                            
                                        // Enviar a todos los jugadores de la sala que hay un nuevo streaming disponible
                                        $this->broadcastToSala($codigoSala, json_encode([
                                            'action' => 'mostrar_streaming',
                                            'codigo_sala' => $codigoSala,
                                            'usuario' => $usuario,
                                            'url_streaming' => $urlStreaming // La URL del video en vivo
                                        ]));
                                    }
                                }
                                break;
                                                                           
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        echo "Conexión cerrada: {$conn->resourceId}\n";
        $this->clients->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }

    // Enviar mensaje a todos en la sala
    protected function broadcastToSala($codigoSala, $msg) {
        foreach ($this->clients as $client) {
            $client->send($msg);
        }
    }

    // Enviar mensaje a un solo cliente
    protected function broadcastToClient(ConnectionInterface $client, $msg) {
        $client->send($msg);
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
