<?php
// Verifica si el email ya existe antes de registrar
$sqlCheckEmail = "SELECT * FROM usuarios WHERE email = :email";
$stmtCheckEmail = $conn->prepare($sqlCheckEmail);
$stmtCheckEmail->bindParam(':email', $email);
$stmtCheckEmail->execute();

if ($stmtCheckEmail->rowCount() > 0) {
    echo json_encode(['status' => 'error', 'message' => 'El email ya está en uso.']);
    exit;
}

?>