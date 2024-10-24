<?php
require 'conexion.php'; // Incluir la configuración de la base de datos
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Asegúrate de que la ruta sea correcta donde tengas las librerías PHPMailer
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

$db = new Database();
$conn = $db->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'];

    // Verificar si el email existe
    $sql_check = "SELECT usuario FROM registrarse WHERE email = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param('s', $email);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'El correo no está registrado.']);
        exit;
    }

    // Generar un token
    $token = uniqid('', true);
    $expiration_time = date('Y-m-d H:i:s', strtotime('+1 hour')); // Establecer expiración
    $sql_token = "UPDATE registrarse SET token = ? WHERE email = ?";
    $stmt_token = $conn->prepare($sql_token);
    $stmt_token->bind_param('ss', $token, $email);
    $stmt_token->execute();

    // Enviar el correo con el enlace de restablecimiento
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'roberrodrigues300@gmail.com'; // Tu dirección de correo electrónico
        $mail->Password = 'flhk dmrq nrlv bzqe'; // Tu contraseña de Gmail
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('roberrodrigues300@gmail.com', 'Tu Nombre');
        $mail->addAddress($email);
        $mail->CharSet = 'UTF-8'; // Asegúrate de usar UTF-8

        $mail->isHTML(true);
        $mail->Subject = "Restablecer contraseña";
        $mail->Body = 'Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="http://localhost/Sajuro/sajuronoche/restablecer/verificar.html?token=' . $token . '">Restablecer contraseña</a>';

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Revisa tu correo para restablecer la contraseña.']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'No se pudo enviar el correo: ' . $mail->ErrorInfo]);
    }
}

$conn->close();
?>
