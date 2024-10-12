<?php
require 'conexion.php'; // Incluir la configuración de la base de datos

// Crear una instancia de la clase Database y obtener la conexión
$db = new Database();
$conn = $db->getConnection();

// Verificar la conexión
if ($conn === null) {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo conectar a la base de datos.']);
    exit;
}

// Verificar si la solicitud es de tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar que se reciban los parámetros esperados
    if (!isset($_POST['usuario']) || !isset($_POST['contrasena'])) {
        echo json_encode(['status' => 'error', 'message' => 'Faltan parámetros en la solicitud.']);
        exit;
    }

    // Capturar los valores enviados desde el formulario
    $usuario = $_POST['usuario'];
    $contrasena = $_POST['contrasena'];

    // Preparar la consulta SQL para verificar el usuario
    $sql = "SELECT id, contrasena, is_verified FROM registrarse WHERE usuario  = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $usuario);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Obtener los datos del usuario
        $stmt->bind_result($user_id, $hashed_contrasena, $is_verified);
        $stmt->fetch();

        // Verificar si la contraseña es correcta
        if (password_verify($contrasena, $hashed_contrasena)) {
            // Verificar si la cuenta está verificada
            if ($is_verified == 1) {
                echo json_encode(['status' => 'success', 'message' => 'Inicio de sesión exitoso.']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'La cuenta no está verificada.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Usuario o contraseña incorrectos.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado.']);
    }

    // Cerrar el statement
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método de solicitud no válido.']);
}

// Cerrar la conexión
$conn->close();
?>
