<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';
$dbname = 'sajuro';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos: ' . $e->getMessage()]);
    exit();
}

// Verificar que los datos están siendo recibidos correctamente
if (isset($_POST['id_emisor'], $_POST['id_receptor'], $_POST['estado_solicitud'])) {
    $idEmisor = $_POST['id_emisor'];
    $idReceptor = $_POST['id_receptor'];
    $estadoSolicitud = $_POST['estado_solicitud'];

    // Depuración: Imprimir valores para verificar que se reciben correctamente
    error_log("id_emisor: $idEmisor, id_receptor: $idReceptor, estado_solicitud: $estadoSolicitud");

    if ($idEmisor === $idReceptor) {
        echo json_encode(['success' => false, 'message' => 'No puedes enviarte una solicitud a ti mismo.']);
        exit();
    }

    try {
        // Verificar que el emisor existe
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM usuario WHERE id_usuario = :id");
        $stmt->execute([':id' => $idEmisor]);
        $emisor_existe = $stmt->fetchColumn();

        // Verificar que el receptor existe
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM usuario WHERE id_usuario = :id");
        $stmt->execute([':id' => $idReceptor]);
        $receptor_existe = $stmt->fetchColumn();

        // Depuración: Verificar si el emisor y receptor existen
        error_log("emisor_existe: $emisor_existe, receptor_existe: $receptor_existe");

        if (!$emisor_existe || !$receptor_existe) {
            echo json_encode(['success' => false, 'message' => 'Uno o ambos usuarios no existen.']);
            exit();
        }

        // Verificar si ya existe una solicitud entre estos usuarios
        $stmt = $pdo->prepare("
            SELECT * FROM solicitudes 
            WHERE (usuario_emisor = :id_emisor AND usuario_receptor = :id_receptor)
                OR (usuario_emisor = :id_receptor AND usuario_receptor = :id_emisor)
        ");
        $stmt->execute([
            ':id_emisor' => $idEmisor,
            ':id_receptor' => $idReceptor
        ]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Ya existe una solicitud entre estos usuarios.']);
            exit();
        }

        // Insertar la solicitud
        $insertStmt = $pdo->prepare("
            INSERT INTO solicitudes (usuario_emisor, usuario_receptor, estado_solicitud, fecha_solicitud) 
            VALUES (:id_emisor, :id_receptor, :estado_solicitud, NOW())
        ");
        $insertStmt->execute([
            ':id_emisor' => $idEmisor,
            ':id_receptor' => $idReceptor,
            ':estado_solicitud' => $estadoSolicitud
        ]);

        echo json_encode(['success' => true, 'message' => 'Solicitud enviada con éxito.']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al procesar la solicitud: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Faltan datos necesarios para procesar la solicitud.']);
}
?>
