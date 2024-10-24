<?php
class Database {
    private $host = "localhost"; // Servidor de base de datos
    private $db_name = "libros"; // Nombre de la base de datos
    private $username = "root"; // Usuario de la base de datos
    private $password = ""; // Contraseña del usuario
    private $conn; // Variable para almacenar la conexión

    // Método para obtener la conexión
    public function getConnection() {
        $this->conn = null;

        try {
            // Se crea la instancia PDO con los datos de conexión para MySQL
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            // Configurar PDO para lanzar excepciones en caso de error
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Error de conexión: " . $exception->getMessage();
        }

        return $this->conn; // Retorna la conexión o null en caso de error
    }
}

// Crear una nueva instancia de la base de datos
$db = new Database();
$conn = $db->getConnection();

// Obtener los datos del cuerpo de la solicitud
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$titulo = $data['titulo'];
$autor = $data['autor'];

// Consulta para insertar datos
$sql = "INSERT INTO libros (titulo, autor) VALUES (:titulo, :autor)";
$stmt = $conn->prepare($sql);

// Vincular los parámetros
$stmt->bindParam(':titulo', $titulo);
$stmt->bindParam(':autor', $autor);

$response = array();

if ($stmt->execute()) {
    // Si la inserción es exitosa
    $response['success'] = true;
} else {
    // Si hay un error al insertar
    $response['success'] = false;
    $response['message'] = 'Error al insertar los datos.';
}

// Retornar la respuesta en formato JSON
echo json_encode($response);

// Cerrar la conexión
$conn = null;
?>
