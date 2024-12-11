<?php
header('Content-Type: application/json; charset=utf-8');

// Configuración de la base de datos
$host = "localhost";
$dbname = "sajuro";
$username = "root";
$password = "";

session_start();
$idUsuarioSesion = $_SESSION['id_usuario'] ?? null;

// Validar si el usuario ha iniciado sesión
if (!$idUsuarioSesion) {
    http_response_code(401); // Código HTTP 401: No autorizado
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit;
}

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Filtrar amigos donde usuario1 es el usuario autenticado
    $sql = "SELECT 
    u.id_usuario, 
    u.nombre_usuario, 
    av.img_avatar, 
    COALESCE(r.aciertos, 0) AS puntuacion_total
FROM 
    amigos a
INNER JOIN 
    usuario u 
ON 
    (
        CASE 
            WHEN a.usuario1 = :idUsuarioSesion THEN a.usuario2
            WHEN a.usuario2 = :idUsuarioSesion THEN a.usuario1
        END = u.id_usuario
    )
INNER JOIN 
    avatar av 
ON 
    u.avatar = av.id_avatar
LEFT JOIN 
    resultados_partida r 
ON 
    u.id_usuario = r.id_usuario
WHERE 
    (a.usuario1 = :idUsuarioSesion OR a.usuario2 = :idUsuarioSesion)
    AND u.id_usuario NOT IN (
        SELECT 
            id_bloqueado 
        FROM 
            bloqueos 
        WHERE 
            id_usuario = :idUsuarioSesion
        UNION
        SELECT 
            id_usuario 
        FROM 
            bloqueos 
        WHERE 
            id_bloqueado = :idUsuarioSesion
    );
";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':idUsuarioSesion', $idUsuarioSesion, PDO::PARAM_INT);
    $stmt->execute();

    // Guardar los resultados
    $jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devolver datos en formato JSON
    echo json_encode($jugadores);
} catch (Exception $e) {
    http_response_code(500); // Código HTTP 500: Error del servidor
    echo json_encode(['error' => 'Error al cargar amigos.']);
    exit;
}
?>