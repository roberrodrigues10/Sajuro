    <?php
    // Incluimos la clase Database
    require 'conexion.php';

    session_start();

    // Crear una nueva instancia de la clase Database
    $db = new Database();
    $conn = $db->getConnection();

    // Obtenemos el código de la sala desde los parámetros de la URL
    $codigoSala = $_GET['codigoSala'];

    // Comprobamos si se ha recibido el código de la sala
    if (!$codigoSala) {
        echo json_encode(["error" => "Código de sala no proporcionado."]);
        exit;
    }

    // Consulta SQL para obtener el límite de jugadores y contar los jugadores actuales
    $sql = "SELECT s.limite_jugadores, 
                (SELECT COUNT(*) FROM jugador_en_sala js 
                    JOIN sala s2 ON js.id_sala = s2.id_sala 
                    WHERE s2.codigo_sala = ?) AS jugadores_actuales 
            FROM sala s
            WHERE s.codigo_sala = ?";
    $params = [$codigoSala, $codigoSala];

    // Ejecutamos la consulta
    $result = $db->ejecutarConsulta($sql, $params);

    // Verificamos si encontramos un resultado
    if (count($result) > 0) {
        $limite_jugadores = $result[0]['limite_jugadores'];
        $jugadores_actuales = $result[0]['jugadores_actuales'];
    
        // Verificamos si el límite no está definido (es null)
        if (is_null($limite_jugadores)) {
            echo json_encode([
                "tipo_error" => "limite_no_definido",
                "mensaje" => "No puedes unirte, no se ha establecido un límite de jugadores en esta sala.",
                "jugadores_actuales" => $jugadores_actuales
            ]);
            exit;
        }
    
        // Verificamos si la sala está llena
        if ($jugadores_actuales >= $limite_jugadores) {
            echo json_encode([
                "tipo_error" => "sala_llena",
                "mensaje" => "La sala está llena. No se pueden unir más jugadores.",
                "limite" => $limite_jugadores,
                "jugadores_actuales" => $jugadores_actuales
            ]);
            exit;
        }
    
        // Si la sala no está llena, devolvemos la información
        echo json_encode([
            "limite_jugadores" => $limite_jugadores,
            "jugadores_actuales" => $jugadores_actuales,
            "puede_unirse" => true
        ]);
    } else {
        // Manejar el caso donde no se encuentre información de la sala
        echo json_encode([
            "tipo_error" => "sala_no_encontrada",
            "mensaje" => "La sala no existe o no se encontró información sobre ella."
        ]);
    }    
    // Cerramos la conexión a la base de datos
    $db->closeConnection();
    ?>