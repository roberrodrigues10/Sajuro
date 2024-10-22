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
$id_anfitrion = $data['id_anfitrion'];
$estado = $data['estado'];

// Insertar sala en la base de datos
$sql = "INSERT INTO sala (codigo_sala, id_anfitrion, estado) VALUES (?, ?, ?)";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("sis", $codigo_sala, $id_anfitrion, $estado);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'codigo_sala' => $codigo_sala]);
} else {
    echo json_encode(['success' => false, 'error' => 'Error al crear la sala']);
}

$stmt->close();
$conexion->close();
?>
