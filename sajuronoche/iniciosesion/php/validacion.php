<?php
session_start(); // Iniciar sesión para verificar si el usuario ya está logueado

// Verificar si ya hay una sesión activa
if (isset($_SESSION['nombre_usuario'])) {
    // Si ya está logueado, redirigir a la página principal o la página deseada
    header('Location: http://192.168.1.35/sajuro/sajuronoche/menu/amigos-suge.html');
    exit; // Detener el script después de la redirección
}

require 'conexion.php'; // Incluir la configuración de la base de datos

// Crear una instancia de la clase Database para obtener la conexión
$db = new Database();
$conn = $db->getConnection(); // Obtener la conexión

// Verificar si la conexión fue exitosa
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

    $usuario = $_POST['usuario'];
    $contrasena = $_POST['contrasena'];

    $sql = "SELECT id_usuario, contrasena, nombre_usuario, is_verified FROM usuario WHERE nombre_usuario = ? LIMIT 1";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Error en la consulta SQL: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param('s', $usuario);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($user_id, $hashed_contrasena, $nombre_usuario, $is_verified);
        $stmt->fetch();
    
        if (password_verify($contrasena, $hashed_contrasena)) {
            if ($is_verified == 1) {
                $_SESSION['nombre_usuario'] = $nombre_usuario;

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

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método de solicitud no válido.']);
}

// Cerrar la conexión
$conn->close();
?>
