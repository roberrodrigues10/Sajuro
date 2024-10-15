<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="css/img/logo.png">
    <title>Sajuro - Registro</title>
    <link rel="stylesheet" href="../css/inicio.css">
    <link rel="stylesheet" href="css/registrarse.css">
</head>
<body>
    <div class="contenedor">
        <div class="tarjeta">
            <div class="conten">
                <div class="logo-login">
                    <a href="../index.html">
                        <img src="../css/img/logo-login.png" alt="Logo de Sajuro" width="150px">
                    </a>
                </div>
                <form id="registro-form" method="POST" onsubmit="registrarUsuario(event)">
                    <div class="conten-sesion">
                        <div class="input-container">
                            <input type="text" id="usuario" name="usuario" spellcheck="false" required>
                            <label>Usuario</label>
                            <svg xmlns="http://www.w3.org/2000/svg" width="" height="25" fill="currentColor" class="user" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                            </svg>
                        </div>
                        <div class="input-container">
                            <input type="email" id="email" name="email" spellcheck="false" required>
                            <label>Email</label>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="25" class="user email" viewBox="0 -2.5 20 20">
                                <path d="M294,774.474 L284,765.649 L284,777 L304,777 L304,765.649 L294,774.474 Z M294.001,771.812 L284,762.981 L284,762 L304,762 L304,762.981 L294.001,771.812 Z"/>
                            </svg>
                        </div>
                        <div class="input-container">
                            <input type="password" id="contrasena" name="contrasena" autocomplete="new-password" required>
                            <label>Contraseña</label>
                            <svg xmlns="http://www.w3.org/2000/svg" class="pass" width="" height="28" viewBox="0 0 24 24">
                                <rect x="6" y="12" width="12" height="7" rx="2" fill="currentColor" stroke="currentColor" stroke-width="2"/>
                                <path d="M12 2C9.8 2 8 3.8 8 6v4h8V6c0-2.2-1.8-4-4-4z" fill="currentColor"/>
                                <rect x="11" y="14" width="2" height="4" rx="1" fill="currentColor"/>
                            </svg>
                        </div>
                        <br>
                        <div id="mensaje-formato"></div>
                        <div id="mensaje-correoOusuario"></div>
                        <div id="loading-indicator" style="display: none;">Registrando...</div>
                        <button class="login-button" id="registrar-button" type="submit">Registrarse</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <script src="js/registro.js"></script>
</body>
</html>

