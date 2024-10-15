<?php
require 'conexion.php'; // Incluir la configuración de la base de datos

$db = new Database();
$conn = $db->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $token = $data['token'];
    $nuevaContrasena = $data['nuevaContrasena'];

    // Verificar el token y obtener el email
    $sql_check = "SELECT email FROM usuario WHERE token = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param('s', $token);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Token inválido.']);
        exit;
    }

    // Obtener el email
    $stmt_check->bind_result($email);
    $stmt_check->fetch();

    // Encriptar la nueva contraseña
    $hashed_contrasena = password_hash($nuevaContrasena, PASSWORD_DEFAULT);

    // Actualizar la contraseña y resetear el token
    $sql_update = "UPDATE usuario SET contrasena = ?, token = NULL WHERE token = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param('ss', $hashed_contrasena, $token);
    
    // Ejecutar la actualización
    $conn->begin_transaction();
    try {
        if (!$stmt_update->execute()) {
            throw new Exception('Error al actualizar la contraseña.');
        }

        $conn->commit();
        echo json_encode(['status' => 'success', 'message' => 'Contraseña restablecida con éxito.']);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }

    // Cerrar los statements
    $stmt_check->close();
    $stmt_update->close();
}

$conn->close();
?>

