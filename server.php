<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

require __DIR__ . '/vendor/autoload.php';

class Chat implements MessageComponentInterface {
    protected $clients;
    protected $salas; // Mantener información de las salas, incluyendo el límite de jugadores

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
                        'jugadores' => []
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
                            if (count($sala['jugadores']) < $sala['limite']) {
                                $sala['jugadores'][] = [
                                    'username' => $data['nombreUsuario'],
                                    'avatar' => $data['avatar'] // Guardar avatar enviado por el cliente
                                ];
                    
                                // Notificar a todos en la sala
                                $this->broadcastToSala($codigoSala, json_encode([
                                    'action' => 'jugador_unido',
                                    'codigo_sala' => $codigoSala,
                                    'nombreUsuario' => $data['nombreUsuario'],
                                    'avatar' => $data['avatar']
                                ]));
                            } else {
                                $this->broadcastToClient($from, json_encode([
                                    'action' => 'sala_llena',
                                    'codigo_sala' => $codigoSala,
                                    'mensaje' => 'La sala ha alcanzado el límite de jugadores.'
                                ]));
                            }
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
                        // Verificar si la sala existe y enviar los jugadores
                        if (isset($this->salas[$codigoSala])) {
                            // Obtener los jugadores de la sala solicitada
                            $jugadores = $this->salas[$codigoSala]['jugadores'] ?? [];
                    
                            // Depuración
                            echo "Sala encontrada: $codigoSala\n";
                            echo "Jugadores: " . json_encode($jugadores) . "\n";
                    
                            // Enviar la lista de jugadores al cliente que hizo la solicitud
                            $this->broadcastToClient($from, json_encode([
                                'action' => 'lista_jugadores',
                                'codigo_sala' => $codigoSala,
                                'jugadores' => $jugadores
                            ]));
                        } else {
                            // Enviar mensaje de error si la sala no existe
                            echo "Sala no encontrada: $codigoSala\n";
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
                        $this->broadcastToSala($codigoSala, json_encode([
                            'action' => 'partida_iniciada',
                            'codigo_sala' => $codigoSala,
                            'mensaje' => 'La partida ha comenzado'
                        ]));
                    }
                    error_log('Sala encontrada para iniciar partida: ' . $codigoSala);
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
