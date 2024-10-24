<?php
include 'conexion.php'; // Archivo donde tienes la clase Database para conectar a la base de datos.

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $codigo_sala = $_POST['codigo_sala'];
    $id_jugador = $_POST['id_jugador']; // El ID del jugador que se quiere unir

    // Verificar si la sala existe
    $query = "SELECT id_sala FROM sala WHERE codigo_sala = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param('s', $codigo_sala);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Unir al jugador a la sala
        $stmt->bind_result($id_sala);
        $stmt->fetch();

        $insertQuery = "INSERT INTO jugador_en_sala (id_jugador, id_sala) VALUES (?, ?)";
        $stmtInsert = $db->prepare($insertQuery);
        $stmtInsert->bind_param('ii', $id_jugador, $id_sala);
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
