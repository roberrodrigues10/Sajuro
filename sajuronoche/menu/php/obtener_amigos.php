<?php
// obtener_amigos.php
header('Content-Type: application/json');

try {
    // Configuración de la base de datos
    $host = 'localhost';
    $dbname = 'sajuro'; // Asegúrate de que este es el nombre correcto de tu base de datos
    $username = 'root';
    $password = '';
    
    // Crear conexión PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    
    // Configurar el modo de error de PDO para que lance excepciones
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    session_start();
    $idUsuarioSesion = $_SESSION['id_usuario'] ?? null;

    // Validar si el usuario ha iniciado sesión
    if (!$idUsuarioSesion) {
        http_response_code(401); // Código HTTP 401: No autorizado
        echo json_encode(['error' => 'Usuario no autenticado']);
        exit;
    }
    
    // Tu consulta SQL
    $sql = "
SELECT 
    u.id_usuario, 
    u.nombre_usuario, 
    av.img_avatar, 
    COALESCE(SUM(p.puntuacion), 0) AS puntuacion_total,
    pr.estado
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
    puntuacion p 
ON 
    u.id_usuario = p.id_usuario
LEFT JOIN
    perfil pr
ON
    u.id_usuario = pr.usuario
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
    )
GROUP BY 
    u.id_usuario, 
    u.nombre_usuario, 
    av.img_avatar,
    pr.estado;
";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':idUsuarioSesion', $idUsuarioSesion, PDO::PARAM_INT);
    $stmt->execute();
    
    // Obtener todos los resultados
    $amigos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Devolver los resultados como JSON
    echo json_encode($amigos);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>