<?php
// Configuración de la base de datos
$host = "localhost";
$dbname = "sajuro";
$username = "root";
$password = "";

session_start(); // Asegúrate de iniciar la sesión
$idUsuarioSesion = $_SESSION['id_usuario'] ?? null; // Obtén el ID del usuario en sesión

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtener texto de búsqueda
    $busqueda = $_GET['q'] ?? '';

    // Modificar la consulta SQL
    $sql = "SELECT 
    u.id_usuario, 
    u.nombre_usuario, 
    av.img_avatar
FROM 
    usuario u
INNER JOIN 
    avatar av 
ON 
    u.avatar = av.id_avatar
WHERE 
    (u.nombre_usuario LIKE :busqueda OR :busqueda = '')
    AND u.id_usuario != :idUsuarioSesion
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
    $stmt->execute([
        'busqueda' => $busqueda ? '%' . $busqueda . '%' : '',
        'idUsuarioSesion' => $idUsuarioSesion
    ]);
    
    // Devolver resultados como JSON
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($resultados);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
