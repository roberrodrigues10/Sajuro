    function arrastrarSoltar() {
        // Seleccionar todos los elementos específicos de los campos de equipo
        const jEquipoUnoUno = document.querySelector('#jEquipoUno-uno');
        const jEquipoUnoDos = document.querySelector('#jEquipoUno-dos');
        const jEquipoUnoTres = document.querySelector('#jEquipoUno-tres');
        const jEquipoUnoCuatro = document.querySelector('#jEquipoUno-cuatro');
        const jEquipoUnoCinco = document.querySelector('#jEquipoUno-cinco');
        const jEquipoUnoSeis = document.querySelector('#jEquipoUno-seis');
        const jEquipoUnoSiete = document.querySelector('#jEquipoUno-siete');
        const jEquipoUnoOcho = document.querySelector('#jEquipoUno-ocho');
        const jEquipoUnoNueve = document.querySelector('#jEquipoUno-nueve');
        const jEquipoUnoDiez = document.querySelector('#jEquipoUno-diez');
        const jEquipoUnoOnce = document.querySelector('#jEquipoUno-once');
        const jEquipoDosUno = document.querySelector('#jEquipoDos-uno');
        const jEquipoDosDos = document.querySelector('#jEquipoDos-dos');
        const jEquipoDosTres = document.querySelector('#jEquipoDos-tres');
        const jEquipoDosCuatro = document.querySelector('#jEquipoDos-cuatro');
        const jEquipoDosCinco = document.querySelector('#jEquipoDos-cinco');
        const jEquipoDosSeis = document.querySelector('#jEquipoDos-seis');
        const jEquipoDosSiete = document.querySelector('#jEquipoDos-siete');
        const jEquipoDosOcho = document.querySelector('#jEquipoDos-ocho');
        const jEquipoDosNueve = document.querySelector('#jEquipoDos-nueve');
        const jEquipoDosDiez = document.querySelector('#jEquipoDos-diez');
        const jEquipoDosOnce = document.querySelector('#jEquipoDos-once');
        const jEquipoUnoUnoE = document.querySelector('#jEquipoUno-uno-E');
        const jEquipoUnoDosE = document.querySelector('#jEquipoUno-dos-E');
        const jEquipoUnoTresE = document.querySelector('#jEquipoUno-tres-E');
        const jEquipoUnoCuatroE = document.querySelector('#jEquipoUno-cuatro-E');
        const jEquipoUnoCincoE = document.querySelector('#jEquipoUno-cinco-E');
        const jEquipoUnoSeisE = document.querySelector('#jEquipoUno-seis-E');
        const jEquipoUnoSieteE = document.querySelector('#jEquipoUno-siete-E');
        const jEquipoUnoOchoE = document.querySelector('#jEquipoUno-ocho-E');
        const jEquipoUnoNueveE = document.querySelector('#jEquipoUno-nueve-E');
        const jEquipoUnoDiezE = document.querySelector('#jEquipoUno-diez-E');
        const jEquipoUnoOnceE = document.querySelector('#jEquipoUno-once-E');
        const jEquipoDosUnoE = document.querySelector('#jEquipoDos-uno-E');
        const jEquipoDosDosE = document.querySelector('#jEquipoDos-dos-E');
        const jEquipoDosTresE = document.querySelector('#jEquipoDos-tres-E');
        const jEquipoDosCuatroE = document.querySelector('#jEquipoDos-cuatro-E');
        const jEquipoDosCincoE = document.querySelector('#jEquipoDos-cinco-E');
        const jEquipoDosSeisE = document.querySelector('#jEquipoDos-seis-E');
        const jEquipoDosSieteE = document.querySelector('#jEquipoDos-siete-E');
        const jEquipoDosOchoE = document.querySelector('#jEquipoDos-ocho-E');
        const jEquipoDosNueveE = document.querySelector('#jEquipoDos-nueve-E');
        const jEquipoDosDiezE = document.querySelector('#jEquipoDos-diez-E');
        const jEquipoDosOnceE = document.querySelector('#jEquipoDos-once-E');

        const conjuntoA = ['jugadoresA-1', 'jugadoresA-2', 'jugadoresA-3', 'jugadoresA-4', 'jugadoresA-5', 'jugadoresA-6', 'jugadoresA-7', 'jugadoresA-8', 'jugadoresA-9', 'jugadoresA-10', 'jugadoresA-11', 'jugadoresA-12'];
        const conjuntoB = ['jugadores-B-1', 'jugadores-B-2', 'jugadores-B-3', 'jugadores-B-4', 'jugadores-B-5', 'jugadores-B-6', 'jugadores-B-7', 'jugadores-B-8', 'jugadores-B-9', 'jugadores-B-10', 'jugadores-B-11', 'jugadores-B-12'];
        const conjuntoC = ['jugadores-C-1', 'jugadores-C-2', 'jugadores-C-3', 'jugadores-C-4', 'jugadores-C-5', 'jugadores-C-6', 'jugadores-C-7', 'jugadores-C-8', 'jugadores-C-9', 'jugadores-C-10', 'jugadores-C-11', 'jugadores-C-12'];
        const conjuntoD = ['jugadores-D-1', 'jugadores-D-2', 'jugadores-D-3', 'jugadores-D-4', 'jugadores-D-5', 'jugadores-D-6', 'jugadores-D-7', 'jugadores-D-8', 'jugadores-D-9', 'jugadores-D-10', 'jugadores-D-11', 'jugadores-D-12'];
        const totalJugadores = conjuntoA.length + conjuntoB.length + conjuntoC.length + conjuntoD.length;

        // Lista de campos en el orden de activación
        const campos = [jEquipoUnoUno, jEquipoUnoDos, jEquipoUnoTres, jEquipoUnoCuatro, jEquipoUnoCinco, jEquipoUnoSeis, jEquipoUnoSiete, jEquipoUnoOcho, jEquipoUnoNueve, jEquipoUnoDiez, jEquipoUnoOnce, jEquipoDosUno, jEquipoDosDos, jEquipoDosTres, jEquipoDosCuatro, jEquipoDosCinco, jEquipoDosSeis, jEquipoDosSiete, jEquipoDosOcho, jEquipoDosNueve, jEquipoDosDiez, jEquipoDosOnce];
        const camposE = [jEquipoUnoUnoE, jEquipoUnoDosE, jEquipoUnoTresE, jEquipoUnoCuatroE, jEquipoUnoCincoE, jEquipoUnoSeisE, jEquipoUnoSieteE, jEquipoUnoOchoE, jEquipoUnoNueveE, jEquipoUnoDiezE, jEquipoUnoOnceE, jEquipoDosUnoE, jEquipoDosDosE, jEquipoDosTresE, jEquipoDosCuatroE, jEquipoDosCincoE, jEquipoDosSeisE, jEquipoDosSieteE, jEquipoDosOchoE, jEquipoDosNueveE, jEquipoDosDiezE, jEquipoDosOnceE];
        // Deshabilitar todos los campos al inicio
        campos.forEach(campo => campo.classList.add('invisible'));

        function habilitarCampo(index) {
            if (index >= campos.length) return;
            const campoActual = campos[index];
            const campoActualE = camposE[index];
            
            // Habilitar el campo actual y establecer opacidad al 100%
            campoActual.classList.remove('invisible');
            campoActualE.style.opacity = '1';
            console.log(`Habilitado: ${campoActual.id}`);
            setTimeout(() => {
                // Si no fue arrastrado, establecer opacidad al 50%
                campoActualE.style.opacity = '0.5';             
                campoActual.classList.add('invisible');
                console.log(`Deshabilitado: ${campoActual.id}`);
                
                setTimeout(() => {
                    habilitarCampo(index + 1);
                }, 100);
            }, 10000);
        }
        
        
                
        let indiceCampo = 0; // Para controlar el índice del campo actual
        let JugadoresCorrectos = 0; // Contador de jugadores correctos

    
        // Iniciar la habilitación de campos desde el primero
        habilitarCampo(0);

        // Configuración de arrastrar y soltar en cada campo
        campos.forEach(colorGeneraljugador => {
            colorGeneraljugador.addEventListener('dragover', (event) => {
                event.preventDefault();
                if (!colorGeneraljugador.classList.contains('deshabilitado')) {
                    colorGeneraljugador.classList.add('cancha-hover'); // Solo activa el hover si el campo está habilitado
                }
            });

            colorGeneraljugador.addEventListener('dragleave', () => {
                colorGeneraljugador.classList.remove('cancha-hover');
            });

            // En el archivo del juego
        function verificarPuntos(puntos) {
            if (puntos % 10 === 0) { // Cada 10 puntos
                // Obtener esferas actuales del localStorage
                let esferasAzules = parseInt(localStorage.getItem('esferasAzules')) || 0;
                
                // Aumentar en 1 la cantidad de esferas azules
                esferasAzules += 1;
                
                // Guardar en localStorage
                localStorage.setItem('esferasAzules', esferasAzules);
                
                // Disparar un evento personalizado para notificar al sistema
                const evento = new CustomEvent('nuevaEsferaAzul', {
                    detail: { cantidad: 1 }
                });
                window.dispatchEvent(evento);
            }
        }

            colorGeneraljugador.addEventListener('drop', (event) => {
                event.preventDefault();
                const objetoId = event.dataTransfer.getData('text');
                const objeto = document.getElementById(objetoId);
                // Verificar si el campo está habilitado antes de procesar el drop
                if (!colorGeneraljugador.classList.contains('invisible')) {
                    let esCorrecto = false;
                    if (
                        (colorGeneraljugador === jEquipoUnoUno && conjuntoD[9] === objetoId) ||
                        (colorGeneraljugador === jEquipoUnoDos && conjuntoA[5] === objetoId) ||
                        (colorGeneraljugador === jEquipoUnoTres && conjuntoB[6] === objetoId) ||
                        (colorGeneraljugador === jEquipoUnoCuatro && conjuntoB[3] === objetoId) ||
                        (colorGeneraljugador === jEquipoUnoCinco && conjuntoA[0] === objetoId) ||
                        (colorGeneraljugador === jEquipoUnoSeis && conjuntoC[8] === objetoId) ||
                        (colorGeneraljugador === jEquipoUnoSiete && conjuntoC[2] === objetoId) ||
                        (colorGeneraljugador === jEquipoUnoOcho && conjuntoB[0] === objetoId) ||
                        (colorGeneraljugador === jEquipoUnoNueve && conjuntoA[10] === objetoId) ||
                        (colorGeneraljugador === jEquipoUnoDiez && conjuntoC[6] === objetoId) ||
                        (colorGeneraljugador === jEquipoUnoOnce && conjuntoA[2] === objetoId) ||
                        (colorGeneraljugador === jEquipoDosUno && conjuntoD[3] === objetoId) ||
                        (colorGeneraljugador === jEquipoDosDos && conjuntoA[9] === objetoId) ||
                        (colorGeneraljugador === jEquipoDosTres && conjuntoB[11] === objetoId) ||
                        (colorGeneraljugador === jEquipoDosCuatro && conjuntoC[10] === objetoId) ||
                        (colorGeneraljugador === jEquipoDosCinco && conjuntoC[11] === objetoId) ||
                        (colorGeneraljugador === jEquipoDosSeis && conjuntoB[5] === objetoId) ||
                        (colorGeneraljugador === jEquipoDosSiete && conjuntoA[1] === objetoId) ||
                        (colorGeneraljugador === jEquipoDosOcho && conjuntoB[2] === objetoId) ||
                        (colorGeneraljugador === jEquipoDosNueve && conjuntoD[11] === objetoId) ||
                        (colorGeneraljugador === jEquipoDosDiez && conjuntoD[7] === objetoId) ||
                        (colorGeneraljugador === jEquipoDosOnce && conjuntoD[2] === objetoId) 
                    ) {
                        esCorrecto = true;
                    }
                        if(esCorrecto){
                        colorGeneraljugador.appendChild(objeto); // Añadir objeto a la caja
                        objeto.remove(); // Eliminar el objeto del DOM
                        colorGeneraljugador.style.opacity = '1' // Añadir clase invisible
                        JugadoresCorrectos++;
                        let puntosElemento = document.querySelector('#puntos');
                        let puntos = parseInt(puntosElemento.textContent) || 0; // Obtener el valor numérico actual
                        puntos++; // Incrementar puntos
                        puntosElemento.textContent = puntos; // Actualizar el contenido de texto en el DOM
                        verificarPuntos(puntos);
                        if (JugadoresCorrectos === totalJugadores) {
                            tocaHacerla(); // Se llama esta función cuando todos los jugadores están en posición correcta
                        }

                        const imgVar = document.querySelector('.img-var');
                        const imgBloqueo = document.querySelector('.img-bloqueoVar');
                        const modal = document.querySelector('#modalUsuarios');
                        const closeModal = document.querySelector('.close');

                        function accionCartaBloqueo() {
                            console.log('¡Usaste la carta! bloqueo');
                            imgBloqueo.removeEventListener('click', accionCartaBloqueo);
                        }

                        if(puntos >= 2) {
                            imgBloqueo.style.opacity = '1'; 
                            imgBloqueo.addEventListener('click', accionCartaBloqueo);
                        } else {
                            imgBloqueo.style.opacity = '0.5';
                            imgBloqueo.removeEventListener('click', accionCartaBloqueo);
                        }

                        function accionCarta() {
                            console.log('¡Usaste la carta!');
                            imgVar.removeEventListener('click', accionCarta);
                            modal.style.display = 'block'; // Muestra el moda
                        }

                        // Función para abrir el modal
                        function abrirModal() {
                            modal.style.display = 'flex'; // Muestra el modal
                            setTimeout(() => {
                                modal.classList.add('show'); // Añade la clase para animar
                            }, 10); // Espera un poco para asegurarse de que el display es "flex"
                        }

                        if(puntos >= 1) {
                            imgVar.style.opacity = '1';
                            imgVar.addEventListener('click', accionCarta);
                        } else {
                            imgVar.style.opacity = '0.5';
                            imgVar.removeEventListener('click', accionCarta);
                        }

                        // Función para cerrar el modal
                        function cerrarModal() {
                            modal.style.display = 'none';
                        }

                        // Listeners
                        imgVar.addEventListener('click', abrirModal);
                        closeModal.addEventListener('click', cerrarModal);
                        window.addEventListener('click', (event) => {
                            if (event.target === modal) {
                                cerrarModal();
                            }
                        });

                        verificarPuntosYHabilitar();
                    } else {
                        alert('Este jugador no pertenece a esta posición.');
                    }
                } else {
                    alert('Este campo aún no está habilitado.');
                }

                colorGeneraljugador.classList.remove('cancha-hover'); // Quitar estilo de hover
            });
        });
        // Configuración de los objetos arrastrables
        const objetos = document.querySelectorAll('[draggable="true"]');
        objetos.forEach(objeto => {
            objeto.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text', event.target.id);
            });
        });

        // Seleccionar elementos del DOM y campos a habilitar
        const timerElement = document.querySelector('.timer-deportes');

        // Variables de tiempo y campo actual
        let tiempoRestante = 10;  // Tiempo inicial para cada jugador en segundos
        let campoActualIndex = 0;  // Índice del campo que está siendo habilitado actualmente

        // Función para habilitar y deshabilitar campos con temporizador de 6 segundos
        function habilitarCampoConTemporizador() {
            if (campoActualIndex >= campos.length) return; // Termina cuando todos los campos se hayan habilitado
            // Habilitar el campo actual
            const campoActual = campos[campoActualIndex];
            campoActual.removeAttribute('disabled');
            campoActual.classList.add('habilitado');  // Añade clase para estilo habilitado en CSS
            // Temporizador para el campo actual
            const intervalId = setInterval(() => {
                // Actualizar el tiempo restante en pantalla
                timerElement.textContent = `Tiempo: ${tiempoRestante}s`;
                console.log(tiempoRestante)
                tiempoRestante--;

                if (tiempoRestante < 0) {
                    // Tiempo terminado para el campo actual
                    clearInterval(intervalId);  // Detener temporizador

                    // Deshabilitar el campo actual y avanzar al siguiente
                    campoActual.setAttribute('disabled', true);
                    campoActual.classList.remove('habilitado');

                    // Reiniciar el tiempo y habilitar el siguiente campo
                    tiempoRestante = 10;
                    campoActualIndex++;
                    habilitarCampoConTemporizador(); // Llamar de nuevo para el siguiente campo
                }
            }, 1000); // Actualizar cada segundo
        }

        // Iniciar la habilitación de campos desde el primero
        habilitarCampoConTemporizador();
    }
    document.addEventListener('DOMContentLoaded', function() {
        const jugadoresDentro = document.querySelector('.jugadoresDentro-deportes');
        const tituloJugadores = document.querySelector('.tituloJugadores');
        
        tituloJugadores.addEventListener('click', function() {
            // Crear el nuevo contenido
            const nuevoContenido = `
                <div class="jugadores">              
                    <div class="jugador-1">
                        <img src="./img/jugadorDeportes-rojo.png" alt="">
                    </div>
                    <div class="jugador-1">
                        <img src="./img/jugadorDeportes-rojo.png" alt="">
                    </div>
                    <div class="jugador-1">
                        <img src="./img/jugadorDeportes-rojo.png" alt="">
                    </div>
                    <div class="jugador-1">
                        <img src="./img/jugadorDeportes-rojo.png" alt="">
                    </div>
                    <div class="jugador-1">
                        <img src="./img/jugadorDeportes-rojo.png" alt="">
                    </div>
                </div>
            `;
            
            // Reemplazar el div completo
            jugadoresDentro.insertAdjacentHTML('beforebegin', nuevoContenido);
            jugadoresDentro.remove();
        });
    });
    // Función que se ejecuta cuando el contador llega a 0
    function ejecutarFuncion() {
        alert("¡El contador ha llegado a 0!");
        // Aquí puedes poner cualquier acción que necesites ejecutar al llegar a 0
    }

    // Inicializamos el tiempo en 4 minutos (240 segundos)
    let tiempo = 4 * 60; 
    const displayContador = document.getElementById("contador");

    // Función para actualizar el contador en formato "minutos:segundos"
    function actualizarContador() {
        const minutos = Math.floor(tiempo / 60);
        const segundos = tiempo % 60;

        // Formatear el tiempo para que aparezca como "minutos:segundos"
        displayContador.textContent = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;

        // Reducir el tiempo en 1 segundo
        if (tiempo > 0) {
            tiempo--;
        } else {
            ejecutarFuncion();
            clearInterval(intervalo);
        }
    }

    // Intervalo que actualiza el contador cada segundo
    const intervalo = setInterval(actualizarContador, 1000);