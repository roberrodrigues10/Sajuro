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
    // Capturar el código de la sala y el ID del anfitrión
    $data = json_decode(file_get_contents('php://input'), true);
    $codigo_sala = $data['codigo_sala'];
    $id_anfitrion = $data['id_anfitrion'];

    // Preparar la consulta SQL para insertar la sala
    $sql = "INSERT INTO sala (codigo_sala, id_anfitrion, estado) VALUES (?, ?, 'espera')";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Error en la consulta SQL: ' . $conn->error]);
        exit;
    }

    // Enlazar los parámetros
    $stmt->bind_param('si', $codigo_sala, $id_anfitrion);
    if ($stmt->execute()) {
        // Obtener el ID de la sala creada
        $id_sala = $stmt->insert_id;

        // Preparar la consulta para insertar al anfitrión en la tabla jugador_en_sala
        $sqlJugador = "INSERT INTO jugador_en_sala (id_usuario, id_sala, es_anfitrion) VALUES (?, ?, 1)";
        $stmtJugador = $conn->prepare($sqlJugador);

        if (!$stmtJugador) {
            echo json_encode(['status' => 'error', 'message' => 'Error en la consulta SQL para jugador_en_sala: ' . $conn->error]);
            exit;
        }

        // Enlazar los parámetros para el jugador
        $stmtJugador->bind_param('ii', $id_anfitrion, $id_sala);
        
        // Ejecutar la inserción en jugador_en_sala
        if ($stmtJugador->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Sala creada y jugador añadido exitosamente.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al añadir jugador: ' . $stmtJugador->error]);
        }

        // Cerrar el statement del jugador
        $stmtJugador->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al crear la sala: ' . $stmt->error]);
    }

    // Cerrar el statement de la sala
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método de solicitud no válido.']);
}

// Cerrar la conexión
$conn->close();
?>
