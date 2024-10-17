<?php
// Conexión a la base de datos (ajusta los detalles según tu configuración)
$conn = new mysqli("localhost", "root", "", "sajuro");

if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

// Función para obtener los rankings
function obtenerRanking($tipo, $limite = 5) {
    global $conn;
    $fecha_inicio = ($tipo == 'semanal') ? date('Y-m-d', strtotime('-1 week')) : '1970-01-01';
    
    $sql = "SELECT r.id_usuario, u.nombre_usuario, r.puntuacion_total 
            FROM ranking r
            JOIN usuario u ON r.id_usuario = u.id_usuario
            WHERE r.tipo = ? AND r.fecha_actualizacion >= ?
            ORDER BY r.puntuacion_total DESC
            LIMIT ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $tipo, $fecha_inicio, $limite);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $rankings = [];
    while ($row = $result->fetch_assoc()) {
        $rankings[] = $row;
    }
    
    return $rankings;
}

// Obtener rankings
$rankingSemanal = obtenerRanking('semanal');
$rankingMundial = obtenerRanking('mundial');

// Generar la respuesta JSON
$response = [
    "ranking_semanal" => $rankingSemanal,
    "ranking_mundial" => $rankingMundial
];

// Cerrar la conexión
$conn->close();

// Devolver la respuesta en formato JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
