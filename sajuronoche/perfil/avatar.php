<?php
class Database {
    private $host = "localhost";
    private $db_name = "sajuro";
    private $username = "root";
    private $password = "";
    private $conn;

    // Método para obtener la conexión
    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);

            if ($this->conn->connect_error) {
                throw new Exception("Error de conexión: " . $this->conn->connect_error);
            }

            $this->conn->set_charset("utf8");
        } catch (Exception $exception) {
            echo json_encode(["error" => "Error de conexión: " . $exception->getMessage()]);
        }

        return $this->conn;
    }

    // Método para cerrar la conexión
    public function closeConnection() {
        if ($this->conn) {
            $this->conn->close();
        }
    }
}

class AvatarService {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    // Función para obtener los avatares
    public function obtenerAvatares() {
        $conn = $this->db->getConnection();

        if ($conn === null) {
            return ["error" => "No se pudo establecer la conexión con la base de datos."];
        }

        $sql = "SELECT id_avatar, img_avatar FROM avatar ORDER BY id_avatar ASC";
        $result = $conn->query($sql);

        if (!$result) {
            return ["error" => "Error en la consulta: " . $conn->error];
        }

        $avatares = [];
        while ($row = $result->fetch_assoc()) {
            $avatares[] = $row;
        }

        $this->db->closeConnection();
        return $avatares;
    }
}

// Crear una instancia del servicio de avatar y obtener los avatares
$avatarService = new AvatarService();
$avatares = $avatarService->obtenerAvatares();

// Devolver los datos en formato JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode(["avatares" => $avatares]);
?>