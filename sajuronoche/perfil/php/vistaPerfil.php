<?php
session_start();
header('Content-Type: application/json');

// Verificar que el usuario esté autenticado
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Usuario no autenticado.'
    ]);
    exit;
}

// Conexión a la base de datos
$host = 'localhost';
$db = 'sajuro';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificar que se pase el ID del usuario visitado
    if (!isset($_GET['id_usuario'])) {
        echo json_encode([
            'success' => false,
            'message' => 'ID de usuario visitado no proporcionado.'
        ]);
        exit;
    }

    // ID del usuario visitado
    $idUsuarioVisitado = $_GET['id_usuario'];

    // Consulta con JOIN para obtener datos del perfil, nombre de usuario y avatar
    $stmt = $pdo->prepare('
        SELECT 
        usuario.nombre_usuario, 
        avatar.img_avatar, 
        perfil.esfera_azul, 
        perfil.esfera_roja, 
        perfil.esfera_dorada, 
        perfil.nivel, 
        perfil.estado
    FROM perfil
    INNER JOIN usuario ON perfil.id_usuario = usuario.id_usuario
    INNER JOIN avatar ON usuario.avatar = avatar.id_avatar
    WHERE perfil.id_usuario = ?
    ');
    $stmt->execute([$idUsuarioVisitado]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode([
            'success' => true,
            'perfil' => $result
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Perfil no encontrado.'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error en la conexión: ' . $e->getMessage()
    ]);
}
