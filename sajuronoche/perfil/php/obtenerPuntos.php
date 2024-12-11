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

    // ID del usuario en sesión
    $idUsuario = $_SESSION['id_usuario'];

    // Obtener la puntuación total del usuario
    $stmt = $pdo->prepare('SELECT SUM(puntuacion) AS puntosTotales FROM puntuacion WHERE id_usuario = ?');
    $stmt->execute([$idUsuario]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    $puntosTotales = $result['puntosTotales'] ?? 0;

    echo json_encode([
        'success' => true,
        'puntosTotales' => $puntosTotales
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error en la conexión: ' . $e->getMessage()
    ]);
}
