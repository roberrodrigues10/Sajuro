<?php

session_start();

// Verificar si el id_anfitrion está disponible en la sesión
if (!isset($_SESSION['id_anfitrion'])) {
    die(json_encode(['success' => false, 'error' => 'El usuario no ha iniciado sesión']));
}

$id_anfitrion = $_SESSION['id_anfitrion']; // Obtener el ID del anfitrión desde la sesión


// Conectar a la base de datos
$servername = "localhost"; // Cambia esto según tu servidor
$username = "root"; // Cambia esto por tu usuario de MySQL
$password = ""; // Cambia esto por tu contraseña de MySQL
$dbname = "sajuro"; // Cambia esto por el nombre de tu base de datos

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Error de conexión a la base de datos']));
}

// Obtener los datos enviados desde el fetch (en formato JSON)
$data = json_decode(file_get_contents('php://input'), true);
$codigo_sala = $data['codigo_sala'];
$id_anfitrion = $data['id_anfitrion'];
$estado = $data['estado'];

// Validar que los datos no estén vacíos
if (empty($codigo_sala) || empty($id_anfitrion)) {
    die(json_encode(['success' => false, 'error' => 'Datos faltantes']));
}

// Insertar en la base de datos
$stmt = $conn->prepare("INSERT INTO sala (codigo_sala, id_anfitrion, estado) VALUES (?, ?, ?)");
$stmt->bind_param("sis", $codigo_sala, $id_anfitrion, $estado);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'codigo_sala' => $codigo_sala]);
} else {
    echo json_encode(['success' => false, 'error' => 'Error al crear la sala']);
}

$stmt->close();
$conn->close();
?>

