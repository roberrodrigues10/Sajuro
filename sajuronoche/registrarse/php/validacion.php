<?php
require 'conexion.php'; // Incluir la configuración de la base de datos

// Crear una instancia de la clase Database y obtener la conexión
$db = new Database();
$conn = $db->getConnection();

// Verificar si la conexión se realizó correctamente
if ($conn === null) {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo conectar a la base de datos.']);
    exit;
}

// Obtener los parámetros de la URL
$email = isset($_GET['email']) ? $_GET['email'] : '';
$token = isset($_GET['token']) ? $_GET['token'] : '';

// Validar que el email y el token no estén vacíos
if (empty($email) || empty($token)) {
    echo json_encode(['status' => 'error', 'message' => 'El email o el token no son válidos.']);
    exit;
}

// Buscar el usuario en la base de datos
$sql = "SELECT * FROM registrarse WHERE email = ? AND token = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ss', $email, $token);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si se encontró el usuario
if ($result->num_rows === 1) {
    // Actualizar el estado de verificación del usuario
    $sql_update = "UPDATE registrarse SET is_verified = 1 WHERE email = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param('s', $email);
    
    if ($stmt_update->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Tu cuenta ha sido verificada con éxito.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al verificar la cuenta.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'El email o el token son incorrectos.']);
}

// Cerrar los statements
$stmt->close();
$stmt_update->close();

// Cerrar la conexión
$conn->close();
?>
