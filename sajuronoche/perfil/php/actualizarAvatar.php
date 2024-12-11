<?php
session_start();
header('Content-Type: application/json');

// Verificar que el usuario esté autenticado
if (!isset($_SESSION['nombre_usuario']) || !isset($_SESSION['id_usuario'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Usuario no autenticado.'
    ]);
    exit;
}

$nombre_usuario = $_SESSION['nombre_usuario'];
$id_usuario = $_SESSION['id_usuario'];  // Obtienes el ID para consultas que lo requieran

// Leer datos enviados desde el cliente
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['avatar_id'])) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos.']);
    exit;
}

try {
    $avatar_id = $data['avatar_id'];
    $id_usuario = $_SESSION['id_usuario'];

    require_once 'conexion.php';
    $db = new Database();
    $conn = $db->getConnection();

    // Verificar si el avatar existe en la tabla avatar
    $stmt = $conn->prepare("SELECT COUNT(*) FROM avatar WHERE id_avatar = ?");
    $stmt->bind_param("i", $avatar_id);
    $stmt->execute();
    $stmt->bind_result($exists);
    $stmt->fetch();
    $stmt->close();

    if ($exists == 0) {
        echo json_encode([
            'success' => false,
            'message' => 'El avatar seleccionado no existe.'
        ]);
        exit;
    }

    // Actualizar el avatar del usuario
    $stmt = $conn->prepare("UPDATE usuario SET avatar = ? WHERE id_usuario = ?");
    $stmt->bind_param("ii", $avatar_id, $id_usuario);

    if ($stmt->execute()) {
        // Opcional: obtener la imagen del avatar actualizado
        // Obtener la imagen del avatar actualizado
        $stmt = $conn->prepare("SELECT img_avatar FROM avatar WHERE id_avatar = ?");
        $stmt->bind_param("i", $avatar_id);
        $stmt->execute();
        $stmt->bind_result($img_avatar);
        $stmt->fetch();
        $stmt->close();

        echo json_encode([
            'success' => true,
            'message' => 'Avatar actualizado correctamente',
            'avatar' => $img_avatar // No aplicar base64_encode si ya está codificado en la base de datos
        ]);
    } else {
        throw new Exception("Error al actualizar el avatar: " . $conn->error);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error en el servidor: ' . $e->getMessage()
    ]);
}

// Cerrar la conexión
$conn->close();
?>
