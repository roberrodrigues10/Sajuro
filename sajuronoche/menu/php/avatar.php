<?php
// Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "sajuro");

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Selecciona un avatar al azar de la columna `img_avatar`
$query = "SELECT img_avatar FROM avatar ORDER BY RAND() LIMIT 1";
$resultado = $conexion->query($query);
$avatar_base64 = "";

if ($fila = $resultado->fetch_assoc()) {
    $avatar_base64 = $fila['img_avatar']; // Obtiene la imagen en formato base64
}

$conexion->close();
?>