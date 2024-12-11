<?php
header('Content-Type: application/json'); // Especificar que la respuesta es JSON

include 'conexion.php';
session_start();

// Obtener datos del cuerpo de la solicitud
$entrada = file_get_contents("php://input");
$datos = json_decode($entrada, true);
$conexion = new mysqli("localhost", "root", "", "sajuro");

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Establecer charset para evitar problemas con caracteres especiales
$conexion->set_charset("utf8");

if (!isset($datos['estado'])) {
    echo json_encode(['success' => false, 'message' => 'Estado no proporcionado.']);
    exit;
}

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Usuario no autenticado.'
    ]);
    exit;
}

$usuario_id = $_SESSION['id_usuario'];
$estado = $datos['estado'];

// Actualizar estado en la base de datos
$query = "UPDATE perfil SET estado = ? WHERE usuario = ?";
$stmt = $conexion->prepare($query);
$stmt->bind_param('si', $estado, $usuario_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Estado actualizado correctamente.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar el estado.']);
}
?>