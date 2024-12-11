<?php
header('Content-Type: application/json');
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'conexion.php';

$conexion = new mysqli("localhost", "root", "", "sajuro");

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Establecer charset para evitar problemas con caracteres especiales
$conexion->set_charset("utf8");

try {
    $datos = json_decode(file_get_contents('php://input'), true);

    if (!isset($datos['esfera_primera']) || 
        !isset($datos['esfera_segunda']) || 
        !isset($datos['esfera_tercera']) || 
        !isset($datos['nivel'])) {
        throw new Exception('Datos incompletos');
    }

    if (!isset($_SESSION['id_usuario'])) {
        throw new Exception('Usuario no autenticado');
    }
    $id_usuario = $_SESSION['id_usuario'];

    // Primero verificamos si existe un perfil para este usuario
    $checkSql = "SELECT COUNT(*) FROM perfil WHERE usuario = ?";
    $checkStmt = $conexion->prepare($checkSql);
    $checkStmt->bind_param("i", $id_usuario);
    $checkStmt->execute();
    $checkStmt->bind_result($count);
    $checkStmt->fetch();
    $checkStmt->close();

    if ($count > 0) {
        // Si existe, actualizamos
        $sql = "UPDATE perfil SET 
                esfera_primera = ?, 
                esfera_segunda = ?, 
                esfera_tercera = ?,
                nivel = ?
                WHERE usuario = ?";
                
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("iiiii", 
            $datos['esfera_primera'],
            $datos['esfera_segunda'],
            $datos['esfera_tercera'],
            $datos['nivel'],
            $id_usuario
        );
    } else {
        // Si no existe, insertamos
        $sql = "INSERT INTO perfil (usuario, esfera_primera, esfera_segunda, esfera_tercera, nivel) 
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("iiiii", 
            $id_usuario,
            $datos['esfera_primera'],
            $datos['esfera_segunda'],
            $datos['esfera_tercera'],
            $datos['nivel']
        );
    }

    if (!$stmt->execute()) {
        throw new Exception('Error al guardar los datos: ' . $stmt->error);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Datos guardados correctamente'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>