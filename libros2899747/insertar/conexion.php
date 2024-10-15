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

            // Mensaje de éxito
            echo "Conexión exitosa a la base de datos.<br>";
        } catch(PDOException $exception) {
            // En caso de error, se imprime el mensaje
            echo "Error de conexión: " . $exception->getMessage();
        }

        return $this->conn; // Retorna la conexión o null en caso de error
    }

    // Método para ejecutar una consulta SQL con parámetros
    public function ejecutarConsulta($sql, $params = []) {
        try {
            // Verificamos que la conexión esté establecida
            if ($this->conn === null) {
                throw new Exception("No se ha establecido la conexión a la base de datos.");
            }

            // Preparamos la consulta SQL
            $stmt = $this->conn->prepare($sql);

            // Vinculamos los parámetros
            foreach ($params as $key => $value) {
                // El método bindValue enlaza los valores a los parámetros nombrados o posicionales
                $stmt->bindValue($key, $value);
            }

            // Ejecutamos la consulta
            $stmt->execute();

            // Retornamos los resultados como un arreglo asociativo
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $exception) {
            echo "Error en la consulta: " . $exception->getMessage();
            return [];
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }
}
?>
