<?php
require 'conexion.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

function verificarCorreo($email) {
    list($usuario, $dominio) = explode('@', $email);
    
    // Verificar si el dominio tiene registros MX
    if (!checkdnsrr($dominio, 'MX')) {
        return false;
    }
    
    // Obtener los registros MX
    getmxrr($dominio, $mxhosts);
    
    // Conectar al servidor SMTP
    $socket = @fsockopen($mxhosts[0], 25, $errno, $errstr, 30);
    if (!$socket) {
        return false;
    }
    
    $response = fgets($socket);
    if (substr($response, 0, 3) != '220') {
        return false;
    }
    
    // Simular una conexión SMTP
    fputs($socket, "HELO example.com\r\n");
    $response = fgets($socket);
    fputs($socket, "MAIL FROM: <verify@example.com>\r\n");
    $response = fgets($socket);
    fputs($socket, "RCPT TO: <$email>\r\n");
    $response = fgets($socket);
    
    // Cerrar la conexión
    fputs($socket, "QUIT\r\n");
    fclose($socket);
    
    // Verificar la respuesta
    return (substr($response, 0, 3) == '250');
}

$db = new Database();
$conn = $db->getConnection();

if ($conn === null) {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo conectar a la base de datos.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario'];
    $contrasena = $_POST['contrasena'];
    $email = $_POST['email'];

    if (empty($usuario) || empty($contrasena) || empty($email)) {
        echo json_encode(['status' => 'error', 'message' => 'Todos los campos son requeridos.']);
        exit;
    }

    if (!verificarCorreo($email)) {
        echo json_encode(['status' => 'error', 'message' => 'El correo electrónico proporcionado no existe.']);
        exit;
    } 

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'formato_message' => 'Formato de correo incorrecto.']);
        exit;
    }

    $sql_check = "SELECT nombre_usuario, email FROM usuario WHERE nombre_usuario = ? OR email = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param('ss', $usuario, $email);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        echo json_encode(['status' => 'error', 'correoUsuariomessage' => 'El usuario o el correo ya existen.']);
        exit;
    }

    $hashed_contrasena = password_hash($contrasena, PASSWORD_DEFAULT);
    $token = uniqid('', true);

    $conn->begin_transaction();

    try {
        $sql = "INSERT INTO usuario (nombre_usuario, contrasena, email, token, is_verified) VALUES (?, ?, ?, ?, 0)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssss', $usuario, $hashed_contrasena, $email, $token);

        if (!$stmt->execute()) {
            throw new Exception('Error en la ejecución de la consulta para registrar usuario.');
        }

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'roberrodrigues300@gmail.com';
        $mail->Password = 'flhk dmrq nrlv bzqe';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        
        $mail->setFrom('roberrodrigues300@gmail.com', 'Tu Nombre');
        $mail->addAddress($email, $usuario);
        $mail->CharSet = 'UTF-8';

        $mail->isHTML(true);
        $mail->Subject = "Verificación de cuenta";
        $mail->Body = 'Haz clic en el siguiente enlace para verificar tu cuenta: <a href="http://localhost/Sajuro/sajuronoche/registrarse/verificacion.html?email=' . $email . '&token=' . $token . '">Verificar cuenta</a>';
        $mail->AltBody = 'Haz clic en el siguiente enlace para verificar tu cuenta: http://localhost/Sajuro/sajuronoche/registrarse/verificacion.html?email=' . $email . '&token=' . $token;

        if (!$mail->send()) {
            throw new Exception('Error al enviar el correo de verificación: ' . $mail->ErrorInfo);
        }

        $conn->commit();
        echo json_encode(['status' => 'success', 'message' => 'Registro exitoso. Revisa tu correo para verificar tu cuenta.']);

    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }

    $stmt->close();
}


$conn->close();
?>