<?php
// Configurar los datos de conexión a la base de datos
$servername = "localhost";  // Como usas XAMPP, este será 'localhost'
$username = "root";  // Usuario predeterminado de MySQL en XAMPP
$password = "";  // Sin contraseña predeterminada en XAMPP, deja esto vacío
$dbname = "sajuro";  // Nombre de la base de datos que creaste

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// El resto del código para manejar la inserción de los datos...
?>
