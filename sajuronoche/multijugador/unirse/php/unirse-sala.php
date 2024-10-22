<?php
header('Content-Type: application/json');

// Conectar a la base de datos
$conexion = new mysqli('localhost', 'root', '', 'sajuro');

if ($conexion->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión a la base de datos']);
    exit;
}

// Obtener datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);
$codigo_sala = $data['codigo_sala'];
$id_usuario = $data['id_usuario'];

// Comprobar si la sala existe
$sql = "SELECT * FROM sala WHERE codigo_sala = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $codigo_sala);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Unir al usuario a la sala (ejemplo: tabla 'jugador_en_sala')
    $sql = "INSERT INTO jugador_en_sala (id_usuario, codigo_sala) VALUES (?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("is", $id_usuario, $codigo_sala);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'codigo_sala' => $codigo_sala]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error al unirse a la sala']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Sala no encontrada']);
}

$stmt->close();
$conexion->close();
?>
