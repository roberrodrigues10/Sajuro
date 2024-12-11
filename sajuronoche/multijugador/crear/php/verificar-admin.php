<?php
require 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $codigoSala = $data['codigoSala'];
    $id_usuario = $data['id_usuario'];

    $db = new Database();
    $conn = $db->getConnection();

    $query = "SELECT id_anfitrion FROM sala WHERE codigo_sala = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $codigoSala);
    $stmt->execute();
    $result = $stmt->get_result();
    $sala = $result->fetch_assoc();

    echo json_encode([
        'isAdmin' => $sala['id_anfitrion'] == $id_usuario
    ]);

    $conn->close();
}
?>
