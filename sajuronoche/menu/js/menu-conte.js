        const solicitudes = document.getElementById('solicitudes');
        const cuadrosoli = document.getElementById('cuadro-soli');
        const afuera = document.getElementById('afuera');  // Asegúrate de que afuera es un contenedor más grande
        const aparecerHome = document.getElementById('home-aparecer');  // Asegúrate de que afuera es un contenedor más grande
        const aparecerAmigo = document.getElementById('amigos-aparecer');  // Asegúrate de que afuera es un contenedor más grande

        solicitudes.addEventListener('click', () => {
                cuadrosoli.style.display = 'flex';
            });
        afuera.addEventListener('click', (e) => {
            if (!cuadrosoli.contains(e.target) && e.target !== solicitudes) {
                cuadrosoli.style.display = 'none';
            }
        });
       // Asegurarte de que los IDs están correctos y únicos en el HTML
        const boton1 = document.getElementById('friend');
        const boton2 = document.getElementById('home');
        const boton3 = document.getElementById('adjust');

        // Función para cambiar el color del botón a uno frío específico
        function cambiarColor(boton) {
            // Cambiar el color del texto del botón activado
            boton.style.color = '#4C3A28'; // Color frío
            // Bloquear los otros botones
            bloquearBotones(boton);
        }

        function bloquearBotones(botonActivado) {
            const botones = [boton1, boton2, boton3];
            botones.forEach(botone => {
                if (botone !== botonActivado) {
                    botone.style.color = 'white'; // Restaurar el color del texto
                    botone.style.backgroundColor = 'transparent'; // Restaurar otros estilos
                }
            });
        }


        

        // Añadir event listeners a cada botón
        boton1.addEventListener('click', (e) => {
            e.preventDefault(); // Prevenir el comportamiento del enlace
            cambiarColor(boton1);
            aparecerHome.style.opacity = "0%";
            aparecerAmigo.style.display = "flex"
          });
        boton2.addEventListener('click', (e) => {
            e.preventDefault();
            cambiarColor(boton2);
            aparecerHome.style.opacity = "100%";
            aparecerAmigo.style.display = "none"
          }); 
        boton3.addEventListener('click', (e) => {
            e.preventDefault();
            cambiarColor(boton3);
        });



