<?php
session_start(); // Iniciar sesión para verificar si el usuario ya está logueado

// Verificar si ya hay una sesión activa
if (isset($_SESSION['nombre_usuario'])) {
    // Si ya está logueado, redirigir a la página principal o la página deseada
    header('Location: https://localhost/sajuro/sajuronoche/menu/amigos-suge.html');
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

    // Realizar la consulta SQL para obtener el avatar
    $sql = "SELECT id_usuario, contrasena, nombre_usuario, is_verified, avatar FROM usuario WHERE nombre_usuario = ? LIMIT 1";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Error en la consulta SQL: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param('s', $usuario);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($user_id, $hashed_contrasena, $nombre_usuario, $is_verified, $avatar_id);
        $stmt->fetch();
    
        if (password_verify($contrasena, $hashed_contrasena)) {
            if ($is_verified == 1) {
                $_SESSION['nombre_usuario'] = $nombre_usuario;
                $_SESSION['id_usuario'] = $user_id;  // Almacenar también el ID de usuario
                // Realizar la consulta para obtener la URL del avatar usando el avatar_id
                $sql_avatar = "SELECT img_avatar FROM avatar WHERE id_avatar = ?";
                $stmt_avatar = $conn->prepare($sql_avatar);

                if (!$stmt_avatar) {
                    echo json_encode(['status' => 'error', 'message' => 'Error en la consulta de avatar: ' . $conn->error]);
                    exit;
                }

                $stmt_avatar->bind_param('i', $avatar_id);
                $stmt_avatar->execute();
                $stmt_avatar->store_result();

                if ($stmt_avatar->num_rows > 0) {
                    $stmt_avatar->bind_result($avatar_url);
                    $stmt_avatar->fetch(); 

                    // Obtener el host actual (localhost o IP)
                    $host_actual = $_SERVER['HTTP_HOST'];

                    // Verificar si el host actual es 'localhost' o la IP de tu computadora
                    if (strpos($host_actual, 'localhost') !== false) {
                        // Si es localhost, cambiar la URL al localhost
                        $avatar_url = "http://localhost/sajuro/sajuronoche/perfil/img/" . $avatar_url; // Ajusta el path según sea necesario
                    } elseif (strpos($host_actual, '192.168.') !== false) {
                        // Si es la IP local, ajustar la URL al IP de tu computadora
                        $avatar_url = "http://localhost/sajuro/sajuronoche/perfil/img/" . $avatar_url; // Ajusta el path según sea necesario
                    } else {
                        // Si es otro host, mantener la URL original
                        $avatar_url = "http://localhost/sajuro/sajuronoche/perfil/img/" . $avatar_url; // Asegúrate de modificar este valor para otros entornos
                    }

                    // Incluir el avatar en la respuesta JSON
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Inicio de sesión exitoso.',
                        'usuarioId' => $user_id,
                        'nombreUsuario' => $nombre_usuario,
                        'avatar' => $avatar_url // Aquí se incluye la URL del avatar
                    ]);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Avatar no encontrado.']);
                }

                $stmt_avatar->close();
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