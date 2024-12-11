<?php
session_start();
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'sajuro';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if (isset($_POST['id_solicitud'], $_POST['estado'])) {
        $idSolicitud = $_POST['id_solicitud'];
        $estado = $_POST['estado'];

        // Actualizar el estado de la solicitud
        $stmt = $pdo->prepare("
            UPDATE solicitudes 
            SET estado_solicitud = :estado 
            WHERE id_solicitud = :id_solicitud
        ");

        $stmt->execute([
            ':estado' => $estado,
            ':id_solicitud' => $idSolicitud
        ]);

        // Si la solicitud fue aceptada, crear la relación de amistad
        if ($estado === 'aceptada') {
            // Primero obtener los usuarios involucrados
            $stmtSolicitud = $pdo->prepare("
                SELECT usuario_emisor, usuario_receptor 
                FROM solicitudes 
                WHERE id_solicitud = :id_solicitud
            ");
            $stmtSolicitud->execute([':id_solicitud' => $idSolicitud]);
            $solicitud = $stmtSolicitud->fetch(PDO::FETCH_ASSOC);

            // Insertar la relación de amistad
            $stmtAmistad = $pdo->prepare("
                INSERT INTO amigos (usuario1, usuario2, fecha_amistad) 
                VALUES (:usuario1, :usuario2, NOW())
            ");
            $stmtAmistad->execute([
                ':usuario1' => $solicitud['usuario_emisor'],
                ':usuario2' => $solicitud['usuario_receptor']
            ]);
        }

        echo json_encode([
            'success' => true, 
            'message' => $estado === 'aceptada' ? 'Solicitud aceptada' : 'Solicitud rechazada'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Faltan datos necesarios']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>