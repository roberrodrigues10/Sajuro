<?php
session_start();
require 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['email']) || !isset($_POST['nombre_usuario']) || !isset($_POST['contrasena'])) {
        echo json_encode(['status' => 'error', 'message' => 'Faltan datos requeridos']);
        exit;
    }

    $email = $_POST['email'];
    $nombre_usuario = $_POST['nombre_usuario'];
    $contrasena = password_hash($_POST['contrasena'], PASSWORD_BCRYPT); // Cifrar contraseña

    $db = new Database();
    $conn = $db->getConnection();

    if ($conn === null) {
        echo json_encode(['status' => 'error', 'message' => 'Error de conexión a la base de datos']);
        exit;
    }

    try {
        // Verificar si el email está marcado como verificado en usuario_temporal
        $sql_check = "SELECT * FROM usuario_temporal WHERE email = ? AND is_verified = 1";
        $stmt_check = $conn->prepare($sql_check);
        $stmt_check->bind_param('s', $email);
        $stmt_check->execute();
        $result = $stmt_check->get_result();

        if ($result->num_rows === 0) {
            throw new Exception('Email no verificado o token inválido');
        }

        if (!$stmt_insert->execute()) {
            throw new Exception('Error al registrar el usuario');
        }

        // Eliminar de usuario_temporal
        $sql_delete = "DELETE FROM usuario_temporal WHERE email = ?";
        $stmt_delete = $conn->prepare($sql_delete);
        $stmt_delete->bind_param('s', $email);
        $stmt_delete->execute();

        echo json_encode(['status' => 'success', 'message' => 'Usuario registrado exitosamente']);

    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    } finally {
        $conn->close();
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
}
?>
