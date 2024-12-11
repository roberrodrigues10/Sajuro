<?php
session_start();
header('Content-Type: application/json');

try {
    // Verifica si el usuario está autenticado
    if (!isset($_SESSION['id_usuario'])) {
        throw new Exception('Usuario no autenticado');
    }

    $id_usuario = $_SESSION['id_usuario'];

    $conexion = new mysqli("localhost", "root", "", "sajuro");

    if ($conexion->connect_error) {
        die("Error de conexión: " . $conexion->connect_error);
    }

    // Establecer charset para evitar problemas con caracteres especiales
    $conexion->set_charset("utf8");

    // Consulta
    $sql = "SELECT nivel FROM perfil WHERE usuario = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(['nivel' => $row['nivel']]);
    } else {
        echo json_encode(['nivel' => null]);
    }

    $stmt->close();
    $conexion->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
