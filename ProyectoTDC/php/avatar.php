<?php
// Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "sajuro");

if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

// Función para obtener los avatares
function obtenerAvatares() {
    global $conn;
    
    $sql = "SELECT id_avatar, img_avatar FROM avatar ORDER BY id_avatar ASC";
    $result = $conn->query($sql);
    
    $avatares = [];
    while ($row = $result->fetch_assoc()) {
        // Las imágenes ya están en Base64, simplemente las agregamos
        $avatares[] = $row;
    }
    
    return $avatares;
}

// Obtener los avatares
$avatares = obtenerAvatares();

// Cerrar la conexión
$conn->close();

// Devolver los datos en formato JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode(["avatares" => $avatares]);
?>