<?php
header('Content-Type: application/json');
include 'conexion.php'; // Archivo de conexión a la base de datos

session_start();
$conexion = new mysqli("localhost", "root", "", "sajuro");

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Establecer charset para evitar problemas con caracteres especiales
$conexion->set_charset("utf8");

$usuario_id = $_SESSION['id_usuario'];

try {
    if (!isset($_SESSION['id_usuario'])) {
        echo json_encode(['success' => false, 'message' => 'Usuario no autenticado.']);
        exit;
    }
    // Consultar el estado del usuario
    $query = "SELECT estado, usuario FROM perfil WHERE usuario = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param('i', $usuario_id); // 'i' para integer
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $fila = $resultado->fetch_assoc();
        echo json_encode([
            'success' => true,
            'estado' => $fila['estado'],
            'id_usuario' => $fila['usuario']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se encontró el estado del usuario.']);
    }
} catch (mysqli_sql_exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
}
?>
