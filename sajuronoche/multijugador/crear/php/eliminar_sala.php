<?php
require 'conexion.php';
$conn = (new Database())->getConnection();

if ($conn === null) {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo conectar a la base de datos.']);
    exit;
}

$sql = "DELETE FROM sala WHERE fecha_creacion < NOW() - INTERVAL 2 MINUTE";
$stmt = $conn->prepare($sql);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Salas antiguas eliminadas exitosamente.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar salas: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
