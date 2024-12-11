<?php
class Database {
    private $host = 'localhost'; // Cambia esto a tu host
    private $db_name = 'sajuro'; // Cambia esto a tu nombre de base de datos
    private $username = 'root'; // Cambia esto a tu usuario de base de datos
    private $password = ''; // Cambia esto a tu contraseña de base de datos
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);

            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }

        } catch (Exception $e) {
            echo "Error de conexión: " . $e->getMessage();
            exit();
        }

        return $this->conn;
    }
}
?>
