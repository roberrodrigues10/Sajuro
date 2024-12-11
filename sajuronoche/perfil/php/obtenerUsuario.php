<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['id_usuario'])) {  // Asegúrate de que 'id_usuario' esté en la sesión
    echo json_encode([
        'success' => false,
        'message' => 'Usuario no autenticado.'
    ]);
    exit;
}

try {
    $id_usuario = $_SESSION['id_usuario'];  // Usar 'id_usuario' en lugar de 'nombre_usuario'

    require_once 'conexion.php';
    $db = new Database();
    $conn = $db->getConnection();

    // Obtener el avatar actual del usuario
    $stmt = $conn->prepare("SELECT avatar.img_avatar FROM usuario 
                            INNER JOIN avatar ON usuario.avatar = avatar.id_avatar 
                            WHERE usuario.id_usuario = ?");
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $stmt->bind_result($img_avatar);
    $stmt->fetch();
    $stmt->close();

    if ($img_avatar) {
        // Si 'img_avatar' es un nombre de archivo, agrega la ruta base a la URL
        $avatar_url = "http://192.168.1.35/sajuro/sajuronoche/perfil/img/" . $img_avatar;

        echo json_encode([
            'success' => true,
            'avatar' => $avatar_url  // Aquí devolvemos la URL completa del avatar
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No se encontró un avatar asociado.'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error en el servidor: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
