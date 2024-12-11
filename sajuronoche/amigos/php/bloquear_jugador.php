<?php
session_start();
require 'conexion.php'; 
header('Content-Type: application/json');

$database = new Database();
$conn = $database->getConnection();

// Verificar que la sesión esté iniciada
if (!isset($_SESSION['id_usuario'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Sesión no iniciada']);
    exit;
}

// Verificar que el id_bloqueado haya sido enviado
if (!isset($_POST['id_bloqueado']) || empty($_POST['id_bloqueado'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Datos incompletos: falta id_bloqueado.',
        'debug' => $_POST // Para depurar el contenido recibido
    ]);
    exit;
}

$id_usuario = $_SESSION['id_usuario']; // Usuario que bloquea
$id_bloqueado = intval($_POST['id_bloqueado']); // Usuario bloqueado

// Validar que el usuario a bloquear existe
$query = "SELECT id_usuario FROM usuario WHERE id_usuario = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('i', $id_bloqueado);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'El jugador a bloquear no existe en la base de datos.']);
    exit;
}

// Verificar si el jugador ya está bloqueado
$query_bloqueo = "SELECT * FROM bloqueos WHERE id_usuario = ? AND id_bloqueado = ?";
$stmt_bloqueo = $conn->prepare($query_bloqueo);
$stmt_bloqueo->bind_param('ii', $id_usuario, $id_bloqueado);
$stmt_bloqueo->execute();
$result_bloqueo = $stmt_bloqueo->get_result();

if ($result_bloqueo->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Este jugador ya está bloqueado.']);
    exit;
}

// Insertar el bloqueo en la base de datos
$query_insertar = "INSERT INTO bloqueos (id_usuario, id_bloqueado, fecha_bloqueo) VALUES (?, ?, NOW())";
$stmt_insertar = $conn->prepare($query_insertar);
$stmt_insertar->bind_param('ii', $id_usuario, $id_bloqueado);

if ($stmt_insertar->execute()) {
    echo json_encode(['success' => true, 'message' => 'Jugador bloqueado correctamente.']);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al bloquear jugador: ' . $stmt_insertar->error
    ]);
}

// Cerrar las conexiones
$stmt->close();
$stmt_bloqueo->close();
$stmt_insertar->close();
$conn->close();
?>