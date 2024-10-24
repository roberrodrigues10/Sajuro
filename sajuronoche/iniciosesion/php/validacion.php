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
    if (!isset($_POST['email']) || !isset($_POST['contrasena'])) {
        echo json_encode(['status' => 'error', 'message' => 'Faltan parámetros en la solicitud.']);
        exit;
    }

    // Capturar los valores enviados desde el formulario
    $email = $_POST['email'];
    $contrasena = $_POST['contrasena'];

    // Preparar la consulta SQL para verificar el usuario
    $sql = "SELECT id_usuario, nombre_usuario, email, contrasena, is_verified FROM usuario WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Obtener los datos del usuario
        $user = $result->fetch_assoc();

        // Verificar si la contraseña es correcta
        if (password_verify($contrasena, $user['contrasena'])) {
            // Verificar si la cuenta está verificada
            if ($user['is_verified'] == 1) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Inicio de sesión exitoso.',
                    'user' => [
                        'id' => $user['id_usuario'],
                        'nombre' => $user['nombre_usuario'],
                        'email' => $user['email']
                    ]
                ]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'La cuenta no está verificada. Por favor, verifica tu correo electrónico.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Correo electrónico o contraseña incorrectos.']);
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