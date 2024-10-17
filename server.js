const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',  // Cambia esto si tu base de datos está en otro host
  user: 'root',       // Cambia esto por tu usuario de MySQL
  password: '', // Cambia esto por tu contraseña de MySQL
  database: 'sajuro' // Cambia esto por tu nombre de base de datos
});

// Conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

// Servir archivos estáticos de la carpeta 'sajuronoche'
app.use(express.static(path.join(__dirname, 'sajuronoche')));

// Ruta principal que sirve el archivo 'index.html'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'sajuronoche', 'index.html'));
});

// Ejemplo de ruta para obtener datos de una tabla 'usuarios'
app.get('/usuario', (req, res) => {
  connection.query('SELECT * FROM usuario', (err, results) => {
    if (err) {
      res.status(500).send('Error obteniendo datos');
      return;
    }
    res.json(results);
  });
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
