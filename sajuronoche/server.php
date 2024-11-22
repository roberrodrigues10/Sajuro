<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

require __DIR__ . '/vendor/autoload.php';

class Chat implements MessageComponentInterface {
    protected $clients;
    protected $rooms;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->rooms = [];
    }

    public function onOpen(ConnectionInterface $conn) {
        echo "Nueva conexión: {$conn->resourceId}\n";
        $this->clients->attach($conn);
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        echo "Mensaje recibido: $msg\n";

        $data = json_decode($msg);
        if (!$data || !isset($data->action)) {
            echo "Mensaje inválido recibido.\n";
            return;
        }

        switch ($data->action) {
            case 'audio_user_joined':
            case 'audio_offer':
            case 'audio_answer':
            case 'audio_ice_candidate':
            case 'mute_user':
            case 'mute_all':
                if (!isset($data->codigo_sala)) {
                    echo "El mensaje no contiene 'codigo_sala'.\n";
                    break;
                }

                // Reenviar el mensaje solo a los usuarios de la misma sala
                foreach ($this->clients as $client) {
                    if ($from !== $client && isset($this->rooms[$data->codigo_sala]) && in_array($client, $this->rooms[$data->codigo_sala])) {
                        $client->send($msg);
                    }
                }
                break;

            default:
                // Reenviar a todos excepto al remitente
                foreach ($this->clients as $client) {
                    if ($from !== $client) {
                        $client->send($msg);
                    }
                }
                break;
        }
    }

    public function onClose(ConnectionInterface $conn) {
        echo "Conexión cerrada: {$conn->resourceId}\n";
        $this->clients->detach($conn);

        // Eliminar al usuario de todas las salas
        foreach ($this->rooms as $roomId => &$clients) {
            $clients = array_filter($clients, fn($client) => $client !== $conn);
            if (empty($clients)) {
                unset($this->rooms[$roomId]);
            }
        }
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }
}

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new Chat()
        )
    ),
    8080 // Cambiar el puerto a 80
);

echo "Servidor WebSocket corriendo en el puerto 80\n";
$server->run();

?>
