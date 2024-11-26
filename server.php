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
                    // Crear la sala con el límite inicial
                    $this->salas[$codigoSala] = [
                        'jugadores' => [],
                        'limite' => $data['limite_jugadores']
                    ];
                    $this->broadcastToSala($codigoSala, $msg);
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
                    // Validar si se puede unir más jugadores
                    if (isset($this->salas[$codigoSala])) {
                        $sala = &$this->salas[$codigoSala];
                        if (count($sala['jugadores']) < $sala['limite']) {
                            $sala['jugadores'][] = $data['nombreUsuario'];

                            // Notificar a todos en la sala
                            $this->broadcastToSala($codigoSala, json_encode([
                                'action' => 'jugador_unido',
                                'codigo_sala' => $codigoSala,
                                'nombreUsuario' => $data['nombreUsuario']
                            ]));
                        } else {
                            // Notificar al cliente que la sala está llena
                            $this->broadcastToClient($from, json_encode([
                                'action' => 'sala_llena',
                                'codigo_sala' => $codigoSala,
                                'mensaje' => 'La sala ha alcanzado el límite de jugadores.'
                            ]));
                        }
                    }
                    break;

                case 'solicitar_jugadores':
                    // Enviar la lista de jugadores actuales
                    $this->broadcastToClient($from, json_encode([
                        'action' => 'lista_jugadores',
                        'codigo_sala' => $codigoSala,
                        'jugadores' => $this->salas[$codigoSala]['jugadores'] ?? []
                    ]));
                    break;

                default:
                    echo "Acción desconocida: {$data['action']}\n";
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
