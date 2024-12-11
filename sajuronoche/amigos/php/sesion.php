<?php
session_start();
header('Content-Type: application/json');

$isAuthenticated = isset($_SESSION['id_usuario']) && isset($_SESSION['nombre_usuario']);

echo json_encode([
    'authenticated' => $isAuthenticated,
    'session_data' => [
        'id_usuario' => $_SESSION['id_usuario'] ?? null,
        'nombre_usuario' => $_SESSION['nombre_usuario'] ?? null
    ]
]);