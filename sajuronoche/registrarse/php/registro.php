<?php
require 'conexion.php'; // Incluir la configuración de la base de datos
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Asegúrate de que la ruta sea correcta donde tengas las librerías PHPMailer
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

// Crear una instancia de la clase Database y obtener la conexión
$db = new Database();
$conn = $db->getConnection();

// Verificar si la conexión se realizó correctamente
if ($conn === null) {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo conectar a la base de datos.']);
    exit;
}

// Verificar si la solicitud es de tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Capturar los valores enviados desde el formulario
    $usuario = $_POST['usuario'];
    $contrasena = $_POST['contrasena'];
    $email = $_POST['email'];

    // Validar que los campos no estén vacíos
    if (empty($usuario) || empty($contrasena) || empty($email)) {
        echo json_encode(['status' => 'error', 'message' => 'Todos los campos son requeridos.']);
        exit;
    }

    // Validar formato del correo electrónico
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'formato_message' => 'Formato de correo incorrecto.']);
        exit;
    }

    // Verificar si el usuario o el correo electrónico ya existen
    $sql_check = "SELECT usuario, email FROM registrarse WHERE usuario = ? OR email = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param('ss', $usuario, $email);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        echo json_encode(['status' => 'error', 'correoUsuariomessage' => 'El usuario o el correo ya existen.']);
        exit;
    }

    // Encriptar la contraseña
    $hashed_contrasena = password_hash($contrasena, PASSWORD_DEFAULT);

    // Generar un token único para la verificación
    $token = uniqid('', true);

    // Iniciar una transacción
    $conn->begin_transaction();

    try {
        // Insertar los datos en la tabla registrarse
        $sql = "INSERT INTO registrarse (usuario, contrasena, email, token, is_verified) VALUES (?, ?, ?, ?, 0)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssss', $usuario, $hashed_contrasena, $email, $token);

        if (!$stmt->execute()) {
            throw new Exception('Error en la ejecución de la consulta para registrarse.');
        }

        // Obtener el ID del usuario recién registrado
        $usuario_id = $conn->insert_id;

        // Insertar los datos en la tabla iniciarsesion
        $sql_iniciar_sesion = "INSERT INTO iniciarsesion (usuario_id, usuario, contrasena) VALUES (?, ?, ?)";
        $stmt_iniciar_sesion = $conn->prepare($sql_iniciar_sesion);
        $stmt_iniciar_sesion->bind_param('iss', $usuario_id, $usuario, $hashed_contrasena);

        if (!$stmt_iniciar_sesion->execute()) {
            throw new Exception('Error en la ejecución de la consulta para iniciar sesión.');
        }

        // Enviar correo de verificación utilizando PHPMailer
        $mail = new PHPMailer(true);
        $mail->isSMTP(); // Establecer el uso de SMTP
        $mail->Host = 'smtp.gmail.com'; // Especificar el servidor SMTP de Gmail
        $mail->SMTPAuth = true; // Habilitar la autenticación SMTP
        $mail->Username = 'roberrodrigues300@gmail.com'; // Tu dirección de correo electrónico
        $mail->Password = 'flhk dmrq nrlv bzqe'; // Tu contraseña de Gmail
        $mail->SMTPSecure = 'tls'; // Habilitar TLS
        $mail->Port = 587; // Puerto TCP para la conexión
        

        // Destinatarios
        $mail->setFrom('roberrodrigues300@gmail.com', 'Tu Nombre'); // De quién se envía el correo
        $mail->addAddress($email, $usuario); // A quién se envía (correo ingresado por el usuario)

        $mail->CharSet = 'UTF-8'; // Asegúrate de usar UTF-8


        // Contenido del correo
        // Contenido del correo
        $mail->isHTML(true); // Establecer el formato de correo como HTML
        $mail->Subject = "Verificación de cuenta"; // Asunto del correo
        $mail->Body = 'Haz clic en el siguiente enlace para verificar tu cuenta: <a href="http://localhost/Sajuro/sajuronoche/registrarse/verificacion.html?email=' . $email . '&token=' . $token . '">Verificar cuenta</a>'; // Contenido en HTML del correo
        $mail->AltBody = 'Haz clic en el siguiente enlace para verificar tu cuenta: http://localhost/Sajuro/sajuronoche/registrarse/verificacion.html?email=' . $email . '&token=' . $token; // Contenido alternativo en texto plano


        // Enviar el correo
        if (!$mail->send()) {
            throw new Exception('Error al enviar el correo de verificación: ' . $mail->ErrorInfo);
        }

        // Confirmar la transacción
        $conn->commit();
        echo json_encode(['status' => 'success', 'message' => 'Registro exitoso. Revisa tu correo para verificar tu cuenta.']);

    } catch (Exception $e) {
        // Si hay un error, revertir la transacción
        $conn->rollback();
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }

    // Cerrar los statements
    $stmt->close();
    $stmt_iniciar_sesion->close();
}

// Cerrar la conexión
$conn->close();
?>
