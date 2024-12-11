<?php
session_start();
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'sajuro';
$username = 'root';
$password = '';

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtener el ID del usuario de la sesión
    $idUsuario = $_SESSION['id_usuario'];

    // Consulta para obtener las solicitudes pendientes junto con la información del usuario emisor
    $stmt = $pdo->prepare("
         SELECT s.*, u.nombre_usuario, a.img_avatar 
        FROM solicitudes s
        INNER JOIN usuario u ON s.usuario_emisor = u.id_usuario
        INNER JOIN avatar a ON u.avatar = a.id_avatar
        WHERE s.usuario_receptor = :id_usuario 
        AND s.estado_solicitud = 'pendiente'
    ");
    
    $stmt->execute([':id_usuario' => $idUsuario]);
    $solicitudes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'solicitudes' => $solicitudes]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>