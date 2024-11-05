<?php

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

require __DIR__ . '/vendor/autoload.php';

class Chat implements MessageComponentInterface {
    protected $clients;
    protected $salas; // Estructura para mantener jugadores por sala

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->salas = [];
    }

    public function onOpen(ConnectionInterface $conn) {
        echo "Nueva conexión: {$conn->resourceId}\n";
        $this->clients->attach($conn);
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        echo "Mensaje recibido: $msg\n"; // Depuración
        $data = json_decode($msg, true);

        if (isset($data['action'])) {
            $codigoSala = $data['codigo_sala'] ?? null;

            switch ($data['action']) {
                case 'sala_creada':
                    $this->salas[$codigoSala] = [
                        'jugadores' => [],
                        'clients' => new \SplObjectStorage() // Mantiene los clientes de cada sala
                    ];
                    $this->salas[$codigoSala]['clients']->attach($from);
                    $this->broadcastToSala($codigoSala, $msg);
                    break;

                case 'jugador_unido':
                    $nuevoJugador = [
                        'username' => $data['nombreUsuario'],
                        'avatar' => '../../menu/css/img/avatar.png'
                    ];
                    $this->salas[$codigoSala]['jugadores'][] = $nuevoJugador;
                    $this->salas[$codigoSala]['clients']->attach($from);
                    $this->broadcastToSala($codigoSala, json_encode([
                        'action' => 'jugador_unido',
                        'codigo_sala' => $codigoSala,
                        'nombreUsuario' => $data['nombreUsuario']
                    ]));
                    break;

                case 'solicitar_jugadores':
                    $this->broadcastToClient($from, json_encode([
                        'action' => 'lista_jugadores',
                        'codigo_sala' => $codigoSala,
                        'jugadores' => $this->salas[$codigoSala]['jugadores'] ?? []
                    ]));
                    break;

                case 'actualizar_jugadores':
                    $this->salas[$codigoSala]['jugadores'] = $data['jugadores'];
                    $this->broadcastToSala($codigoSala, $msg);
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

                case 'ronda_seleccionada':
                    $rondaSeleccionada = [
                        'action' => 'ronda_seleccionada',
                        'codigo_sala' => $codigoSala,
                        'ronda' => $data['ronda']
                    ];
                    $this->broadcastToSala($codigoSala, json_encode($rondaSeleccionada));
                    break;
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        echo "Conexión cerrada: {$conn->resourceId}\n";
        $this->clients->detach($conn);

        // Eliminar cliente de todas las salas
        foreach ($this->salas as $codigoSala => $sala) {
            if ($sala['clients']->contains($conn)) {
                $sala['clients']->detach($conn);
                if (empty($sala['clients'])) {
                    unset($this->salas[$codigoSala]); // Eliminar sala si está vacía
                }
                break;
            }
        }
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }

    // Enviar mensaje a todos en la sala específica
    protected function broadcastToSala($codigoSala, $msg) {
        if (isset($this->salas[$codigoSala])) {
            foreach ($this->salas[$codigoSala]['clients'] as $client) {
                $client->send($msg);
            }
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
