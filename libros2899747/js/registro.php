<?php
require 'baseDatos.php';

function registrarUsuario($usuario, $contrasena, $email) {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Verificar si el usuario ya existe
    $checkUser = $conn->prepare("SELECT * FROM iniciosesion WHERE usuario = ?");
    $checkUser->bind_param('s', $usuario); // Usamos 's' para indicar que es un string
    $checkUser->execute();
    $result = $checkUser->get_result();

    if ($result->num_rows > 0) {
        return ['status' => 'error', 'message' => 'El usuario ya existe.'];
    }

    // Encriptar la contraseña
    $contrasena_encriptada = password_hash($contrasena, PASSWORD_DEFAULT);

    // Inserta el nuevo usuario en la base de datos
    $sql = "INSERT INTO iniciosesion (usuario, contrasena, email) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    
    // Bind de los parámetros
    $stmt->bind_param('sss', $usuario, $contrasena_encriptada, $email); // 'sss' indica que son tres strings

    // Ejecución de la consulta
    if ($stmt->execute()) {
        return ['status' => 'success', 'message' => 'Registro exitoso.'];
    } else {
        return ['status' => 'error', 'message' => 'Error al registrar: ' . $stmt->error];
    }
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $usuario = $_POST['usuario'] ?? '';
    $contrasena = $_POST['contrasena'] ?? '';
    $email = $_POST['email'] ?? '';

    // Validación simple
    if (empty($usuario) || empty($contrasena) || empty($email)) {
        echo json_encode(['status' => 'error', 'message' => 'Todos los campos son obligatorios.']);
        exit();
    }

    // Validar el formato del email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Email no válido.']);
        exit();
    }

    // Registrar usuario
    $respuesta = registrarUsuario($usuario, $contrasena, $email);
    echo json_encode($respuesta);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido.']);
}
?>
