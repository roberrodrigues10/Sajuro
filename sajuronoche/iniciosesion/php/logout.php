<?php
session_start();
session_unset(); // Eliminar todas las variables de sesión
session_destroy(); // Destruir la sesión actual

// Redirigir a la página de inicio de sesión
header('Location: iniciarsesion.html');
exit;
?>
