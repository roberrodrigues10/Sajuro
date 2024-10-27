<?php
require 'conexion.php';

session_start();

// Verificar la conexión
$db = new Database();
$conn = $db->getConnection();
if ($conn === null) {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo conectar a la base de datos.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $codigo_sala = $data['codigo_sala'];
    $id_usuario = $data['id_usuario']; // El ID del jugador que se quiere unir

    // Verificar si la sala existe
    $query = "SELECT id_sala FROM sala WHERE codigo_sala = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $codigo_sala);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Unir al jugador a la sala
        $stmt->bind_result($id_sala);
        $stmt->fetch();
        $insertQuery = "INSERT INTO jugador_en_sala (id_usuario, id_sala) VALUES (?, ?)";
        $stmtInsert = $conn->prepare($insertQuery);
        $stmtInsert->bind_param('ii', $id_usuario, $id_sala);
        $stmtInsert->execute();

        if ($stmtInsert->affected_rows > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Te has unido a la sala']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al unirse a la sala']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Sala no encontrada']);
    }
}
?>
