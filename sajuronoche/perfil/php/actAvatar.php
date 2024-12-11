<?php
require 'conexion.php';
$db = new Database();
$conn = $db->getConnection();

$data = json_decode(file_get_contents('php://input'), true);
$usuarioId = $data['usuarioId'];

$sql = "SELECT img_avatar FROM usuario u 
        JOIN avatar a ON u.avatar = a.id_avatar 
        WHERE u.id_usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $usuarioId);
$stmt->execute();
$stmt->bind_result($avatarUrl);
$stmt->fetch();

// Construir URL completa del avatar
$avatarUrl = "http://localhost/sajuro/sajuronoche/perfil/img/" . $avatarUrl;

echo json_encode([
    'avatar' => $avatarUrl
]);
?>