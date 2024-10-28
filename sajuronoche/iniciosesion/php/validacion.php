<?php
require 'conexion.php'; // Incluir la configuración de la base de datos
session_start(); 

// Verificar la conexión
$db = new Database();
$conn = $db->getConnection();
if ($conn === null) {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo conectar a la base de datos.']);
    exit;
}

// Verificar si la solicitud es de tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['usuario']) || !isset($_POST['contrasena'])) {
        echo json_encode(['status' => 'error', 'message' => 'Faltan parámetros en la solicitud.']);
        exit;
    }

    // Capturar los valores enviados desde el formulario
    $usuario = $_POST['usuario'];
    $contrasena = $_POST['contrasena'];

    // Preparar la consulta SQL
    $sql = "SELECT id_usuario, contrasena, nombre_usuario, is_verified FROM usuario WHERE nombre_usuario = ? LIMIT 1";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Error en la consulta SQL: ' . $conn->error]);
        exit;
    }

    // Enlazar el parámetro
    $stmt->bind_param('s', $usuario);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Obtener los datos del usuario
        $stmt->bind_result($user_id, $hashed_contrasena, $nombre_usuario, $is_verified);
        $stmt->fetch();
    
        // Verificar la contraseña
        if (password_verify($contrasena, $hashed_contrasena)) {
            // Verificar si la cuenta está verificada
            if ($is_verified == 1) {
                // Establecer el nombre de usuario en la sesión
                $_SESSION['nombre_usuario'] = $nombre_usuario;

                // Enviar respuesta exitosa con el ID del usuario
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Inicio de sesión exitoso.',
                    'usuarioId' => $user_id,
                    'nombreUsuario' => $nombre_usuario 
                ]);
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
