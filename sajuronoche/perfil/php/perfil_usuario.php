<?php
session_start();
require_once 'conexion.php';

// Configuración para devolver siempre JSON
header('Content-Type: application/json');

// Verificar que se haya pasado el id_usuario
if (!isset($_GET['id_usuario'])) {
    echo json_encode([
        'success' => false,
        'message' => 'No se especificó ningún usuario.'
    ]);
    exit;
}

$id_usuario = intval($_GET['id_usuario']);

try {
    $db = new Database();
    $conn = $db->getConnection();

    $stmt = $conn->prepare("
        SELECT u.nombre_usuario, a.img_avatar 
        FROM usuario u
        INNER JOIN avatar a ON u.avatar = a.id_avatar
        WHERE u.id_usuario = ?
    ");
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $usuario = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'usuario' => $usuario
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Usuario no encontrado.'
        ]);
    }
} catch (Exception $e) {
    // Captura cualquier excepción y devuelve un error en JSON
    echo json_encode([
        'success' => false,
        'message' => 'Error al cargar el perfil: ' . $e->getMessage()
    ]);
}
