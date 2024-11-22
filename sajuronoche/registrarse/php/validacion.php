<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');

require 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['email']) || !isset($_GET['token'])) {
        echo json_encode(['status' => 'error', 'message' => 'Faltan parámetros requeridos']);
        exit;
    }

    $email = $_GET['email'];
    $token = $_GET['token'];

    $db = new Database();
    $conn = $db->getConnection();

    if ($conn === null) {
        echo json_encode(['status' => 'error', 'message' => 'Error de conexión a la base de datos']);
        exit;
    }

    try {
        // Validar el token en usuario_temporal
        $sql = "SELECT * FROM usuario_temporal WHERE email = ? AND token = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $email, $token);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode(['status' => 'error', 'message' => 'Token inválido o ya utilizado']);
            exit;
        }

        // Obtener los datos de usuario temporal
        $usuario_data = $result->fetch_assoc();
        
        // Mover datos a la tabla de usuarios
        $sql_insert = "INSERT INTO usuario (nombre_usuario, contrasena, email, is_verified) VALUES (?, ?, ?, 1)";
        $stmt_insert = $conn->prepare($sql_insert);
        $stmt_insert->bind_param('sss', $usuario_data['nombre_usuario'], $usuario_data['contrasena'], $usuario_data['email']);
        
        if ($stmt_insert->execute()) {
            // Si la inserción es exitosa, marcar como verificado y eliminar de usuario_temporal
            $sql_update = "UPDATE usuario_temporal SET is_verified = 1 WHERE email = ? AND token = ?";
            $stmt_update = $conn->prepare($sql_update);
            $stmt_update->bind_param('ss', $email, $token);
            $stmt_update->execute();
            
            // Eliminar el registro de usuario temporal
            $sql_delete = "DELETE FROM usuario_temporal WHERE email = ? AND token = ?";
            $stmt_delete = $conn->prepare($sql_delete);
            $stmt_delete->bind_param('ss', $email, $token);
            $stmt_delete->execute();

            echo json_encode(['status' => 'success', 'message' => 'Email verificado y cuenta registrada correctamente.']);
        } else {
            throw new Exception('Error al registrar la cuenta en la tabla usuario');
        }

    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    } finally {
        if (isset($stmt)) {
            $stmt->close();
        }
        if (isset($stmt_insert)) {
            $stmt_insert->close();
        }
        if (isset($stmt_update)) {
            $stmt_update->close();
        }
        if (isset($stmt_delete)) {
            $stmt_delete->close();
        }
        $conn->close();
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
}
?>
