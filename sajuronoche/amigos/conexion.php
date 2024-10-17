<?php
// Conexión a la base de datos
$mysqli = new mysqli('localhost', 'usuario', 'contraseña', 'sajuro');

// Verificar conexión
if ($mysqli->connect_error) {
    die('Error en la conexión: ' . $mysqli->connect_error);
}

// ID del usuario logueado
$usuario_id = 1; // Reemplaza por la sesión actual

// Consulta para obtener los amigos
$query = "SELECT u.nombre_usuario, u.avatar, u.is_verified
          FROM sajuro_amigos a
          JOIN sajuro_usuario u ON (a.usuario1 = u.id_usuario OR a.usuario2 = u.id_usuario)
          WHERE (a.usuario1 = ? OR a.usuario2 = ?) AND u.id_usuario != ?";

// Preparar y ejecutar la consulta
$stmt = $mysqli->prepare($query);
$stmt->bind_param('iii', $usuario_id, $usuario_id, $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

// Crear un array para almacenar los resultados
$amigos = [];
while ($row = $result->fetch_assoc()) {
    $amigos[] = $row;
}

// Retornar los amigos como JSON
header('Content-Type: application/json');
echo json_encode($amigos);

$mysqli->close();
?>
