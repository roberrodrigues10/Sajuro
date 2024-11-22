<?php
session_start();
require 'conexion.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario'];
    $contrasena = $_POST['contrasena'];
    $email = $_POST['email'];

    if (empty($usuario) || empty($contrasena) || empty($email)) {
        echo json_encode(['status' => 'error', 'message' => 'Todos los campos son requeridos.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'formato_message' => 'Formato de correo incorrecto.']);
        exit;
    }

    $db = new Database();
    $conn = $db->getConnection();

    if ($conn === null) {
        echo json_encode(['status' => 'error', 'message' => 'No se pudo conectar a la base de datos.']);
        exit;
    }

    $sql_check = "SELECT nombre_usuario, email FROM usuario_temporal WHERE nombre_usuario = ? OR email = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param('ss', $usuario, $email);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        echo json_encode(['status' => 'error', 'correoUsuariomessage' => 'El usuario o el correo ya existen.']);
        $conn->close();
        exit;
    }

    $stmt_check->close();

    $hashed_contrasena = password_hash($contrasena, PASSWORD_DEFAULT);
    $token = uniqid('', true);
    $expira = date('Y-m-d H:i:s', time() + (24 * 60 * 60)); // 24 horas

    $sql_insert = "INSERT INTO usuario_temporal (nombre_usuario, contrasena, email, token, expira) VALUES (?, ?, ?, ?, ?)";
    $stmt_insert = $conn->prepare($sql_insert);
    $stmt_insert->bind_param('sssss', $usuario, $hashed_contrasena, $email, $token, $expira);

    if (!$stmt_insert->execute()) {
        echo json_encode(['status' => 'error', 'message' => 'Error al registrar usuario temporal.']);
        $stmt_insert->close();
        $conn->close();
        exit;
    }

    $stmt_insert->close();
    $conn->close();

    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'sajurosoportes@gmail.com';
        $mail->Password = 'reqx wjgv qnzy kecs';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        
        $mail->setFrom('sajurosoportes@gmail.com', 'Sajuro');
        $mail->addAddress($email);
        $mail->CharSet = 'UTF-8';

        $mail->isHTML(true);
        $mail->Subject = "Verificación de cuenta";
        $mail->Body = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verificación de cuenta</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: Arial, sans-serif;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto;">
                <tr>
                    <td style="background-color: #4F46E5; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">¡Bienvenido a Sajuro!</h1>
                    </td>
                </tr>
                <tr>
                    <td style="background-color: white; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-top: 0; margin-bottom: 20px; font-size: 20px;">Confirma tu cuenta</h2>
                        
                        <p style="color: #666; line-height: 1.5; margin-bottom: 25px;">
                            Gracias por registrarte. Para completar tu registro, por favor verifica tu cuenta haciendo clic en el botón de abajo.
                            El enlace expirará en 24 horas.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="http://192.168.1.35/sajuro/sajuronoche/registrarse/verificacion.html?email=' . $email . '&token=' . $token . '" 
                            style="background-color: #4F46E5; 
                                    color: white; 
                                    padding: 12px 30px; 
                                    text-decoration: none; 
                                    border-radius: 5px; 
                                    font-weight: bold;
                                    display: inline-block;">
                                Verificar mi cuenta
                            </a>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                            Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:
                        </p>
                        
                        <p style="color: #666; font-size: 12px; word-break: break-all; margin-bottom: 25px;">
                            http://192.168.1.35/sajuro/sajuronoche/registrarse/verificacion.html?email=' . $email . '&token=' . $token . '
                        </p>
                        
                        <p style="color: #666; font-size: 14px; margin-bottom: 25px;">
                            Si no has creado una cuenta en Sajuro, puedes ignorar este mensaje.
                        </p>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #888; font-size: 12px; margin: 5px 0;">
                                Este es un correo automático, por favor no respondas a este mensaje.
                            </p>
                            <p style="color: #888; font-size: 12px; margin: 5px 0;">
                                &copy; ' . date("Y") . ' Sajuro. Todos los derechos reservados.
                            </p>
                        </div>
                    </td>
                </tr>
            </table>
        </body>
        </html>';

        $mail->AltBody = 'Haz clic en el siguiente enlace para verificar tu cuenta: http://192.168.1.35/sajuro/sajuronoche/registrarse/verificacion.html?email=' . $email . '&token=' . $token;

        if (!$mail->send()) {
            throw new Exception('Error al enviar el correo de verificación: ' . $mail->ErrorInfo);
        }

        echo json_encode(['status' => 'success', 'message' => 'Revisa tu correo para verificar tu cuenta.']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}
?>
