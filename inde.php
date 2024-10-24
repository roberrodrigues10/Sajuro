<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Asegúrate de que la ruta sea correcta donde tengas las librerías PHPMailer
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

// Crear una instancia de PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuración del servidor
    $mail->isSMTP(); // Establecer el uso de SMTP
    $mail->Host = 'smtp.gmail.com'; // Especificar el servidor SMTP de Gmail
    $mail->SMTPAuth = true; // Habilitar la autenticación SMTP
    $mail->Username = 'roberrodrigues300@gmail.com'; // Tu dirección de correo electrónico
    $mail->Password = 'mlxy sfcg cjgu gjuh'; // Tu contraseña de Gmail
    $mail->SMTPSecure = 'tls'; // Habilitar TLS
    $mail->Port = 587; // Puerto TCP para la conexión

    // Destinatarios
    $mail->setFrom('roberrodrigues300@gmail.com', 'Tu Nombre'); // De quién se envía el correo
    $mail->addAddress('roberrodrigues300@gmail.com', 'Tu Nombre'); // A quién se envía

    // Contenido del correo
    $mail->isHTML(true); // Establecer el formato de correo como HTML
    $mail->Subject = 'Aquí está el asunto'; // Asunto del correo
    $mail->Body    = 'Este es el contenido en <b>HTML</b>'; // Contenido en HTML del correo
    $mail->AltBody = 'Este es el contenido alternativo en texto plano para clientes de correo que no soportan HTML'; // Contenido alternativo en texto plano

    // Enviar el correo
    $mail->send();
    echo 'El correo ha sido enviado';
} catch (Exception $e) {
    echo "Error al enviar el correo: {$mail->ErrorInfo}"; // Mensaje de error en caso de fallo
}
?>
