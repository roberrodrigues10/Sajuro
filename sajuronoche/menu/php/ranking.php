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
   
    // Modificada la consulta para obtener específicamente img_avatar
    $sql = "SELECT r.id_usuario, u.nombre_usuario, r.puntuacion_total, av.img_avatar as avatar
            FROM ranking r
            JOIN usuario u ON r.id_usuario = u.id_usuario
            LEFT JOIN avatar av ON u.avatar = av.id_avatar
            WHERE r.tipo = ? AND r.fecha_actualizacion >= ?
            ORDER BY r.puntuacion_total DESC
            LIMIT ?";
   
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        return []; // Retorna array vacío si hay error en la preparación
    }

    $stmt->bind_param("ssi", $tipo, $fecha_inicio, $limite);
    
    if (!$stmt->execute()) {
        return []; // Retorna array vacío si hay error en la ejecución
    }
    
    $result = $stmt->get_result();
   
    $rankings = [];
    while ($row = $result->fetch_assoc()) {
        // Verifica si el avatar existe, si no, usa uno por defecto o null
        $rankings[] = [
            'id_usuario' => $row['id_usuario'],
            'nombre_usuario' => $row['nombre_usuario'],
            'puntuacion_total' => $row['puntuacion_total'],
            'avatar' => $row['avatar'] ?? null // Si no hay avatar, será null
        ];
    }
   
    $stmt->close();
    return $rankings;
}

try {
    // Obtener rankings
    $rankingSemanal = obtenerRanking('semanal');
    $rankingMundial = obtenerRanking('mundial');

    // Generar la respuesta JSON
    $response = [
        "ranking_semanal" => $rankingSemanal,
        "ranking_mundial" => $rankingMundial
    ];

    // Configurar headers
    header('Content-Type: application/json');
    header('Cache-Control: no-cache, must-revalidate');
    
    // Devolver la respuesta en formato JSON
    echo json_encode($response);

} catch (Exception $e) {
    // En caso de error, devolver un mensaje de error
    header('Content-Type: application/json');
    echo json_encode(["error" => "Error al obtener los rankings: " . $e->getMessage()]);
}

// Cerrar la conexión
$conn->close();
?>