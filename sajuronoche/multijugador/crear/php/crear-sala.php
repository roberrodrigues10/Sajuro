<?php
header('Content-Type: application/json');
// conectar a la base de datos
require '../iniciosesion/php/conexion.php'; // Asegúrate de tener tu archivo de conexión a la base de datos

session_start(); // Inicia la sesión para acceder a las variables de sesión

if (isset($_SESSION['id_usuario'])) {
    $id_anfitrion = $_SESSION['id_usuario']; // Obtiene el ID del usuario que está creando la sala
    $codigo_sala = generarCodigoSala(); // Llama a la función para generar un código de sala

    // Prepara la consulta para insertar la sala en la base de datos
    $sql = "INSERT INTO sala (codigo_sala, id_anfitrion, estado) VALUES (?, ?, 'espera')";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $codigo_sala, $id_anfitrion);

    if ($stmt->execute()) {
        // La sala se creó correctamente
        echo json_encode(['success' => true, 'codigo_sala' => $codigo_sala]);
    } else {
        // Hubo un error al crear la sala
        echo json_encode(['success' => false, 'error' => 'Error al crear la sala']);
    }

    $stmt->close();
} else {
    // El usuario no está autenticado
    echo json_encode(['success' => false, 'error' => 'Usuario no autenticado']);
}

$conn->close();
?>
<script> 
    const usuarioNombre = <?php echo $_SESSION['id_usuario']; ?>; // Obtiene el ID del usuario que está creando la sala
</script>
