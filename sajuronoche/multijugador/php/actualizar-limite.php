<?php
require 'conexion.php';

session_start();

$db = new Database();
$conn = $db->getConnection();
if ($conn === null) {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo conectar a la base de datos.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $codigo_sala = $data['codigo_sala'] ?? null;
    $limite_jugadores = $data['limite_jugadores'] ?? null;

    if (!$codigo_sala || !$limite_jugadores) {
        echo json_encode(['status' => 'error', 'message' => 'Datos incompletos.']);
        exit;
    }

    $sql = "UPDATE sala SET limite_jugadores = ? WHERE codigo_sala = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Error en la consulta SQL: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param('is', $limite_jugadores, $codigo_sala);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Límite actualizado correctamente.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al actualizar el límite: ' . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no válido.']);
}

$conn->close();
?>
