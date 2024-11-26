<?php 
require 'conexion.php';

// Verificar la conexión
$db = new Database();
$conn = $db->getConnection();
if ($conn === null) {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo conectar a la base de datos.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $codigo_sala = $data['codigo_sala'];
    $id_usuario = $data['id_usuario']; // El ID del jugador que se quiere unir

    // Verificar si la sala existe y obtener el límite de jugadores
    $query = "SELECT id_sala, limite_jugadores FROM sala WHERE codigo_sala = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $codigo_sala);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Sala encontrada, obtener los datos
        $stmt->bind_result($id_sala, $limite_jugadores);
        $stmt->fetch();

        // Verificar cuántos jugadores hay actualmente en la sala
        $jugadoresEnSalaQuery = "SELECT COUNT(*) AS num_jugadores FROM jugador_en_sala WHERE id_sala = ?";
        $stmtJugadoresEnSala = $conn->prepare($jugadoresEnSalaQuery);
        $stmtJugadoresEnSala->bind_param('i', $id_sala);
        $stmtJugadoresEnSala->execute();
        $resultJugadoresEnSala = $stmtJugadoresEnSala->get_result();
        $row = $resultJugadoresEnSala->fetch_assoc();
        $numero_actual_de_jugadores = $row['num_jugadores'];

        // Verificar si el número de jugadores es menor que el límite
        if ($numero_actual_de_jugadores < $limite_jugadores) {
            // Verificar si el usuario ya está en la sala
            $checkUserQuery = "SELECT * FROM jugador_en_sala WHERE id_usuario = ? AND id_sala = ?";
            $stmtCheckUser = $conn->prepare($checkUserQuery);
            $stmtCheckUser->bind_param('ii', $id_usuario, $id_sala);
            $stmtCheckUser->execute();
            $stmtCheckUser->store_result();

            if ($stmtCheckUser->num_rows == 0) {
                // Si el usuario no está en la sala, lo agregamos
                $insertQuery = "INSERT INTO jugador_en_sala (id_usuario, id_sala) VALUES (?, ?)";
                $stmtInsert = $conn->prepare($insertQuery);
                $stmtInsert->bind_param('ii', $id_usuario, $id_sala);
                $stmtInsert->execute();

                if ($stmtInsert->affected_rows > 0) {
                    // Obtener la lista completa de jugadores en la sala
                    $jugadoresQuery = "
                        SELECT usuario.nombre_usuario AS nombreUsuario
                        FROM usuario
                        JOIN jugador_en_sala ON usuario.id_usuario = jugador_en_sala.id_usuario
                        WHERE jugador_en_sala.id_sala = ?
                    ";
                    $stmtJugadores = $conn->prepare($jugadoresQuery);
                    $stmtJugadores->bind_param('i', $id_sala);
                    $stmtJugadores->execute();
                    $resultJugadores = $stmtJugadores->get_result();

                    $jugadores = [];
                    while ($row = $resultJugadores->fetch_assoc()) {
                        $jugadores[] = $row;
                    }

                    // Responder con la lista completa de jugadores
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Te has unido a la sala',
                        'jugadores' => $jugadores // Lista completa de jugadores
                    ]);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Error al unirse a la sala']);
                }
            } else {
                // Usuario ya está en la sala
                echo json_encode(['status' => 'error', 'message' => 'Ya estás en la sala']);
            }
        } else {
            // El límite de jugadores ha sido alcanzado
            echo json_encode(['status' => 'error', 'message' => 'El límite de jugadores ha sido alcanzado']);
        }
    } else {
        // La sala no existe
        echo json_encode(['status' => 'error', 'message' => 'Sala no encontrada']);
    }
}

// Cerrar la conexión
$conn->close();
?>
