<?php
// Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "sajuro");

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Directorio donde están las imágenes (Asegúrate de que la ruta sea relativa al script que lo ejecuta)
$directorio = '../img/avatares/'; // Este debe ser el directorio relativo a donde está tu script PHP

// Obtener todas las imágenes del directorio (Solo archivos jpg, png, gif)
$imagenes = glob($directorio . "*.{jpg,png,gif,jpeg}", GLOB_BRACE);

// Si no se encuentran imágenes, mostrar un mensaje de error
if (empty($imagenes)) {
    die("No se encontraron imágenes en el directorio.");
}

// Recorrer cada imagen
foreach ($imagenes as $imagen) {
    // Obtener el nombre del archivo
    $nombreImagen = basename($imagen);

    // Asegurarse de que el archivo exista antes de intentar leerlo
    if (!file_exists($imagen)) {
        echo "Archivo no encontrado: $imagen";
        continue;
    }

    // Convertir la imagen a Base64
    $imagenBase64 = base64_encode(file_get_contents($imagen));

    // Asegúrate de escapar los datos antes de la inserción para evitar problemas de SQL Injection
    $imagenBase64Escapada = $conn->real_escape_string($imagenBase64);

    // Insertar la imagen en la base de datos (Asegúrate de que la columna img_avatar sea lo suficientemente grande para almacenar las imágenes en Base64)
    $sql = "INSERT INTO avatar (img_avatar) VALUES ('$imagenBase64Escapada')";

    if ($conn->query($sql) === TRUE) {
        echo "Imagen '$nombreImagen' insertada correctamente.<br>";
    } else {
        echo "Error al insertar '$nombreImagen': " . $conn->error . "<br>";
    }
}

// Cerrar la conexión
$conn->close();
?>