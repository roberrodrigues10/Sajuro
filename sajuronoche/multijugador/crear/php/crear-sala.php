<?php
require 'conexion.php';
session_start();

$db = new Database();
$conn = $db->getConnection();
if ($conn === null) {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo conectar a la base de datos.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    error_log(print_r($data, true)); // Para depuración
    $codigo_sala = (int) ($data['codigo_sala'] ?? null);
    $id_anfitrion = (int) ($data['id_anfitrion'] ?? null);

    if (!$codigo_sala || !$id_anfitrion) {
        echo json_encode(['status' => 'error', 'message' => 'Faltan datos requeridos.']);
        exit;
    }

    // Primera consulta - Crear sala
    $estado = 'espera'; // Definimos el estado aquí
    $sql = "INSERT INTO sala (codigo_sala, id_anfitrion, estado) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Error en la consulta SQL: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param('iis', $codigo_sala, $id_anfitrion, $estado); // Agregamos el estado como tercer parámetro
    
    if ($stmt->execute()) {
        $id_sala = $stmt->insert_id;

        // Segunda consulta - Agregar jugador a la sala
        $sqlJugador = "INSERT INTO jugador_en_sala (id_usuario, id_sala, es_anfitrion) VALUES (?, ?, ?)";
        $stmtJugador = $conn->prepare($sqlJugador);
        if (!$stmtJugador) {
            echo json_encode(['status' => 'error', 'message' => 'Error en la consulta SQL para jugador_en_sala: ' . $conn->error]);
            exit;
        }

        $es_anfitrion = 1; // Definimos el valor para es_anfitrion
        $stmtJugador->bind_param('iii', $id_anfitrion, $id_sala, $es_anfitrion);
        
        if ($stmtJugador->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Sala creada y jugador añadido exitosamente.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al añadir jugador: ' . $stmtJugador->error]);
        }

        $stmtJugador->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al crear la sala: ' . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método de solicitud no válido.']);
}

$conn->close();
?>