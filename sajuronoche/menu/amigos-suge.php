<?php
session_start();
if (empty($_SESSION["id_usuario"])) {
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, usuario-mundial-scalable=no">
    <link rel="shortcut icon" href="css/img/logo.png">
    <title>Sajuro</title>
    <link rel="stylesheet" href="../../sajuronoche/menu/css/modal-home.css">
    <link rel="stylesheet" href="../menu/css/amigos-suge copy.css">
    <link rel="stylesheet" href="../menu/css/conten-home.css">
    <link rel="stylesheet" href="../css/inicio.css">
    <style>
        /* Aquí puedes agregar estilos personalizados si es necesario */
    </style>
</head>
<body>
    <div class="contenido-general" id="afuera">
        <div class="contenido-home-oculto" id="home-aparecer">
            <div class="ranking">
                <div class="ranking-conte">
                    <div class="logo-perfi">
                        <a href="inicio-menu.html">
                            <img src="css/img/logo-perfil-pi.png" alt="" width="130px">
                        </a>
                    </div>
                    <div class="bienvenido">
                        <div class="content-bienvenido">
                            <img src="css/img/biemvenido.png" alt="" class="bienvenido-img"> 
                            <div class="titulo-bienvenido">BIENVENIDO</div>
                            <div class="titulo-user"><?php echo $_SESSION["nombre_usuario"] ; ?></div>
                        </div>           
                    </div>
                    <div class="logo-ranking">
                        <img src="css/img/ranking-logoEspada.png" id="openModalBtn" alt="" class="ranking-logo" width="120px">
                    </div>  
                </div>
            </div>
        </div>
    </div>
            <div class="nuevo-contenido-home">
                <div class="contenido-home-modalidad">
                    <div class="campos">
                        <div class="solitario">
                            <a href="../modos/modo_juego.html" class="solitario-a">
                            <img src="css/img/campo-modalidad.png" alt="" width="270px">
                            <div class="titulo-solitario">SOLITARIO</div>
                        </a>
                        </div>
                        <div class="multijugador">
                            <img src="css/img/campo-modalidad.png" alt="" width="270px">
                            <div class="titulo-multijugador">MULTIJUGADOR</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="contenido-amigos-activos" id="amigos-activos">
    
            
        </div>
        <div class="contenido-amigos" id="amigos-aparecer">
            <div id='rectangle234' class='rectangle234'>
                <div class="nombre-amigos">
                    Amigos
                </div>
                <div class="buscar">
                <form action="#" method="get">
                    <input type="text" name="search" placeholder="Buscar amigo" class="input">
                    <button type="submit" class="search-button">
                      <i class="fa fa-search"></i>
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="27" height="28" viewBox="0,0,300,150">
                        <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M10,2c-4.40347,0 -8,3.59653 -8,8c0,4.40347 3.59653,8 8,8c1.75213,0 3.37052,-0.57793 4.69141,-1.54102l5.1543,5.1543c0.31352,0.32654 0.77908,0.45808 1.21713,0.34388c0.43805,-0.1142 0.78014,-0.45628 0.89433,-0.89433c0.1142,-0.43805 -0.01734,-0.90361 -0.34388,-1.21713l-5.1543,-5.1543c0.96309,-1.32088 1.54102,-2.93928 1.54102,-4.69141c0,-4.40347 -3.59653,-8 -8,-8zM10,4.5c3.05237,0 5.5,2.44763 5.5,5.5c0,3.05237 -2.44763,5.5 -5.5,5.5c-3.05237,0 -5.5,-2.44763 -5.5,-5.5c0,-3.05237 2.44763,-5.5 5.5,-5.5z"></path></g></g>
                        </svg>
                    </button>
                        <img src="/sajuronoche/css/img/🦆 icon _person_.png" alt="" id="solicitudes" width="22" class="usuario-mundial">
                  </form>
                </div>
                <div class="contenido-sugerencias">
                    <div class="randon-1">
                        <img src="/sajuronoche/css/img/foto.png" alt="" class="logo-randon">
                        <div class="nombre-suge">rober2110</div>
                        <div class="ver-suge">
                            <img src="/sajuronoche/css/img/🦆 icon _eye_.png" alt="" class="logos-suge" id="solicitudes">
                        </div>
                        <div class="enviar-suge">
                            <img src="/sajuronoche/css/img/enviar.png" alt="" class="logos-suge">
                        </div>
                    </div>
                    <div class="randon-1">
                        <img src="/sajuronoche/css/img/foto.png" alt="" class="logo-randon">
                        <div class="nombre-suge">rober2110</div>
                        <div class="ver-suge">
                            <img src="/sajuronoche/css/img/🦆 icon _eye_.png" alt="" class="logos-suge">
                        </div>
                        <div class="enviar-suge">
                            <img src="/sajuronoche/css/img/enviar.png" alt="" class="logos-suge">
                        </div>
                    </div>
                    <div class="randon-1">
                        <img src="/sajuronoche/css/img/foto.png" alt="" class="logo-randon">
                        <div class="nombre-suge">rober2110</div>
                        <div class="ver-suge">
                            <img src="/sajuronoche/css/img/🦆 icon _eye_.png" alt="" class="logos-suge">
                        </div>
                        <div class="enviar-suge">
                            <img src="/sajuronoche/css/img/enviar.png" alt="" class="logos-suge">
                        </div>
                    </div>
                    <div class="randon-1">
                        <img src="/sajuronoche/css/img/foto.png" alt="" class="logo-randon">
                        <div class="nombre-suge">rober2110</div>
                        <div class="ver-suge">
                            <img src="/sajuronoche/css/img/🦆 icon _eye_.png" alt="" class="logos-suge">
                        </div>
                        <div class="enviar-suge">
                            <img src="/sajuronoche/css/img/enviar.png" alt="" class="logos-suge">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="myModal" class="modal">
            <div class="modal-content">
                <span class="close"></span>
                <div class="contenido-ranking-todo">
                    <div class="contenidoSuperior-ranking">
                        <div class="ranking-superior">RANKING</div>
                        <div class="diario-semana">
                            <div class="semanal" id="clickSemanal">Semanal</div>
                            <div class="mundial" id="clickMundial">Mundial</div>
                        </div>
                    </div>
                    <div class="ranking-dentro" id="rankingSemanal">
                        <div class="usuario-ranking">
                            <div class="numero">1.</div>
                            <div class="calabera">
                                <img src="css/img/avatar.png" alt="" class="cala">
                            </div>
                            <div class="usuario">Username</div>
                            <div class="point-general">
                                <div class="sajuro-points">SajuroPoints</div>
                                <div class="contenido-points">1000</div>
                             </div>
                            </div>
                            <div class="usuario-ranking">
                                <div class="numero">2.</div>
                                <div class="calabera">
                                    <img src="css/img/avatar.png" alt="" class="cala">
                                </div>
                                <div class="usuario">Username</div>
                            <div class="point-general">
                                <div class="sajuro-points">SajuroPoints</div>
                                <div class="contenido-points">1000</div>
                             </div>
                            </div>
                            <div class="usuario-ranking">
                                <div class="numero">3.</div>
                                <div class="calabera">
                                    <img src="css/img/avatar.png" alt="" class="cala">
                                </div>
                                <div class="usuario">Username</div>
                            <div class="point-general">
                                <div class="sajuro-points">SajuroPoints</div>
                                <div class="contenido-points">1000</div>
                            </div>
                        </div>
                        <div class="usuario-ranking">
                            <div class="numero">4.</div>
                            <div class="calabera">
                                <img src="css/img/avatar.png" alt="" class="cala">
                            </div>
                            <div class="usuario">Username</div>
                            <div class="point-general">
                                <div class="sajuro-points">SajuroPoints</div>
                                <div class="contenido-points">1000</div>
                            </div>
                        </div>
                        <div class="usuario-ranking">
                            <div class="numero">5.</div>
                            <div class="calabera">
                                <img src="css/img/avatar.png" alt="" class="cala">
                            </div>
                            <div class="usuario">Username</div>
                            <div class="point-general">
                                <div class="sajuro-points">SajuroPoints</div>
                                <div class="contenido-points">1000</div>
                            </div>
                        </div>
                    </div>
                    <div class="ranking-dentroMundial" id="ranking-Mundial">
                        <div class="usuario-ranking">
                            <div class="numero">1.</div>
                            <div class="calabera">
                                <img src="css/img/avatar.png" alt="" class="cala">
                            </div>
                            <div class="usuario">Username</div>
                            <div class="point-general">
                                <div class="sajuro-points">SajuroPoints</div>
                                <div class="contenido-points">1000</div>
                             </div>
                            </div>
                            <div class="usuario-ranking">
                                <div class="numero">2.</div>
                                <div class="calabera">
                                    <img src="css/img/avatar.png" alt="" class="cala">
                                </div>
                                <div class="usuario">Username</div>
                            <div class="point-general">
                                <div class="sajuro-points">SajuroPoints</div>
                                <div class="contenido-points">1000</div>
                             </div>
                            </div>
                            <div class="usuario-ranking">
                                <div class="numero">3.</div>
                                <div class="calabera">
                                    <img src="css/img/avatar.png" alt="" class="cala">
                                </div>
                                <div class="usuario">Username</div>
                            <div class="point-general">
                                <div class="sajuro-points">SajuroPoints</div>
                                <div class="contenido-points">1000</div>
                            </div>
                        </div>
                        <div class="usuario-ranking">
                            <div class="numero">4.</div>
                            <div class="calabera">
                                <img src="css/img/avatar.png" alt="" class="cala">
                            </div>
                            <div class="usuario">Username</div>
                            <div class="point-general">
                                <div class="sajuro-points">SajuroPoints</div>
                                <div class="contenido-points">1000</div>
                            </div>
                        </div>
                        <div class="usuario-ranking">
                            <div class="numero">5.</div>
                            <div class="calabera">
                                <img src="css/img/avatar.png" alt="" class="cala">
                            </div>
                            <div class="usuario">Username</div>
                            <div class="point-general">
                                <div class="sajuro-points">SajuroPoints</div>
                                <div class="contenido-points">1000</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Bloqueando el zoom con teclado
        document.addEventListener('keydown', function(event) {
          if (event.ctrlKey && (event.key === '+' || event.key === '-')) {
            event.preventDefault(); // Detiene el zoom
          }
        });
    
        // Evitar el zoom con el mouse (Ctrl + scroll)
        document.addEventListener('wheel', function(event) {
          if (event.ctrlKey) {
            event.preventDefault(); // Bloquear zoom con scroll
          }
        });
      </script>
    <script src="js/menu-conte.js"></script>
    <script src="js/modal-menu.js"></script>
    <script src="js/amigos.js"></script>
</body>
</html>
