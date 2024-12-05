function startCountdown() {
    const countdownModal = document.getElementById('countdownModal');
    const countdownNumber = document.getElementById('countdownNumber');
    let count = 3;

    // Mostrar el modal de cuenta regresiva
    countdownModal.style.display = 'flex';

    // Iniciar el conteo regresivo
    const countdownInterval = setInterval(() => {
        countdownNumber.textContent = count;
        countdownNumber.classList.remove('animate'); // Resetear la animación
        void countdownNumber.offsetWidth; // Forzar el reflujo para reiniciar la animación
        countdownNumber.classList.add('animate'); // Aplicar la animación

        // Cambiar a "Inicia Partida" al final
        if (count === 0) {
            countdownNumber.textContent = "Inicia Partida";
            countdownNumber.classList.add("final");
            
            // Iniciar la partida después de un breve retraso para que se vea el mensaje
            setTimeout(() => {
                countdownModal.style.display = 'none'; // Ocultar modal
            }, 500); // Puedes ajustar el tiempo de retraso si deseas que el mensaje dure más
        }

        count--;
    }, 1000); // Disminuir el conteo cada segundo
}

startCountdown();

setTimeout(function arrastrarSoltar() {

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

        // Lista de campos en el orden de activación
        const campos = [jEquipoUnoUno, jEquipoUnoDos, jEquipoUnoTres, jEquipoUnoCuatro, jEquipoUnoCinco, jEquipoUnoSeis, jEquipoUnoSiete, jEquipoUnoOcho, jEquipoUnoNueve, jEquipoUnoDiez, jEquipoUnoOnce, jEquipoDosUno, jEquipoDosDos, jEquipoDosTres, jEquipoDosCuatro, jEquipoDosCinco, jEquipoDosSeis, jEquipoDosSiete, jEquipoDosOcho, jEquipoDosNueve, jEquipoDosDiez, jEquipoDosOnce];
        const camposE = [jEquipoUnoUnoE, jEquipoUnoDosE, jEquipoUnoTresE, jEquipoUnoCuatroE, jEquipoUnoCincoE, jEquipoUnoSeisE, jEquipoUnoSieteE, jEquipoUnoOchoE, jEquipoUnoNueveE, jEquipoUnoDiezE, jEquipoUnoOnceE, jEquipoDosUnoE, jEquipoDosDosE, jEquipoDosTresE, jEquipoDosCuatroE, jEquipoDosCincoE, jEquipoDosSeisE, jEquipoDosSieteE, jEquipoDosOchoE, jEquipoDosNueveE, jEquipoDosDiezE, jEquipoDosOnceE];
        const descriptions = document.querySelectorAll('.descripcion'); // Selecciona todas las descripciones
        const imgVar = document.querySelector('.img-var');
        const imgBloqueo = document.querySelector('.img-bloqueoVar');
        const tituloJugadores = document.querySelector('.tituloJugadores');
        const jugadoresDentro = document.querySelector('.jugadoresDentro-deportes');
        let tiempoRestante = 10;  // Tiempo inicial para cada jugador en segundos
        let campoActualIndex = 0;  // Índice del campo que está siendo habilitado actualmente
        let habilitarCampoTemIniciado = false; // Bandera para controlar la ejecución

        function Descripcion() {
            const timerElement = document.querySelector('.timer-deportes');
            const descriptions = document.querySelectorAll('.descripcion');
            let currentIndex = 0; // Índice para llevar el seguimiento de la descripción actual
            let esperandoActivo = false; // Bandera para saber si estamos en estado "Esperando"
        
            function updateDescriptions() {
                if (timerElement.textContent.includes("Esperando")) {
                    // Si "Esperando" aparece y aún no hemos mostrado la descripción actual
                    if (!esperandoActivo) {
                        esperandoActivo = true; // Activar bandera para indicar que estamos mostrando "Esperando"
                        // Mostrar la descripción actual y ocultar las demás
                        descriptions.forEach((desc, index) => {
                            desc.style.display = index === currentIndex ? 'block' : 'none';
                            desc.style.opacity = index === currentIndex ? '1' : '0';
                        });
                        console.log(`Mostrando descripción: ${currentIndex + 1}`);
                    }
                } else {
                    // Si "Esperando" desaparece, ocultar todas las descripciones y preparar el siguiente índice
                    if (esperandoActivo) {
                        esperandoActivo = false; // Desactivar bandera porque "Esperando" ha desaparecido
                        descriptions.forEach((desc) => {
                            desc.style.opacity = '0';
                        });
                        // Avanzar al siguiente índice
                        currentIndex = (currentIndex + 1) % descriptions.length;
                        console.log("Ocultando todas las descripciones");
                    }
                }
            }
        
            // Configurar el MutationObserver para observar cambios en el contenido de `timerElement`
            const observer = new MutationObserver(updateDescriptions);
        
            // Iniciar la observación de `timerElement`
            observer.observe(timerElement, { characterData: true, childList: true, subtree: true });
        
            // Ejecutar la función inicialmente para establecer el estado correcto
            updateDescriptions();
        }
        
        // Llamar a la función
        Descripcion();        

    // Función para habilitar y deshabilitar campos con temporizador de 9 segundos y un retraso de 5 segundos entre cada campo
    function Temporizador() {
        if (habilitarCampoTemIniciado) return;
        habilitarCampoTemIniciado = true;

        const TIEMPO_ESPERA = 7;  // 5 segundos de espera
        const TIEMPO_ACTIVO = 15; // 10 segundos activo
        let tiempoEspera = TIEMPO_ESPERA; // Contador para tiempo de espera

        if (campoActualIndex >= campos.length) {
            habilitarCampoTemIniciado = false;
            return;
        }

        // Contador para los 5 segundos de espera
        const esperaInterval = setInterval(() => {

            // Verifica si se cumple la condición para detener el temporizador
            if (modalText.textContent === '¡Ganaste!' || modalText.textContent === 'Finaliza 1º Ronda') {
                clearInterval(esperaInterval);
                habilitarCampoTemIniciado = false; // Restablece el estado
                return;
            }

            timerElement.textContent = `Esperando campo: ${tiempoEspera}s`;
            console.log(`Tiempo de espera: ${tiempoEspera}`);
            tiempoEspera--;

            if (tiempoEspera < 0) {
                clearInterval(esperaInterval);
                activarCampo();
            }
        }, 1000);

        function activarCampo() {
            const campoActual = campos[campoActualIndex];
            
            // Activar el campo
            campoActual.removeAttribute('disabled');
            campoActual.classList.add('habilitado');
            tiempoRestante = TIEMPO_ACTIVO;

            // Temporizador para los 10 segundos activos
            const intervalId = setInterval(() => {

                // Verifica si se cumple la condición para detener el temporizador
                if (modalText.textContent === '¡Ganaste!' || modalText.textContent === 'Finaliza 1º Ronda') {
                    clearInterval(intervalId);
                    habilitarCampoTemIniciado = false; // Restablece el estado
                    return;
                }

                timerElement.textContent = `Tiempo para responder: ${tiempoRestante}s`;
                console.log(`Tiempo restante: ${tiempoRestante}`);
                tiempoRestante--;

                if (tiempoRestante < 0) {
                    clearInterval(intervalId);
                    
                    // Desactivar campo
                    campoActual.setAttribute('disabled', true);
                    campoActual.classList.remove('habilitado');
                    
                    // Guardar respuesta
                    const respuesta = campoActual.value;
                    console.log(`Respuesta guardada: ${respuesta}`);
                    
                    campoActualIndex++;
                    tiempoEspera = TIEMPO_ESPERA; // Reiniciar tiempo de espera

                    // Iniciar siguiente ciclo si la condición no se cumple
                    if (!(modalText.textContent === '¡Ganaste!' || modalText.textContent === 'Finaliza 1º Ronda')) {
                        setTimeout(() => {
                            habilitarCampoTemIniciado = false;
                            Temporizador();
                        }, 0);
                    }
                }
            }, 1000);
        }
    }
    // Iniciar la habilitación de campos desde el primero
    Temporizador();
                
        let JugadoresCorrectos = 0; // Contador de jugadores correcto
        let IntentosFallidos = 0;
    
        // Configuración de arrastrar y soltar en cada campo
        campos.forEach(colorGeneraljugador => {
            colorGeneraljugador.addEventListener('dragover', (event) => {
                event.preventDefault();
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

        // Función para mostrar el modal de alerta
        function mostrarModalAlerta() {
            const modal = document.getElementById('modalAlerta');
            modal.style.display = 'block'; // Muestra el modal

            // Oculta el modal después de 2 segundos
            setTimeout(() => {
                modal.style.display = 'none';
            }, 2000);
        }

        // Función para mostrar el segundo modal de alerta
        function mostrarModalAlerta2() {
            const modal2 = document.getElementById('modalAlerta2');
            modal2.style.display = 'block'; // Muestra el segundo modal

            // Oculta el segundo modal después de 2 segundos
            setTimeout(() => {
                modal2.style.display = 'none';
            }, 2000);
        }

            colorGeneraljugador.addEventListener('drop', (event) => {
                event.preventDefault();
                const objetoId = event.dataTransfer.getData('text');
                const objeto = document.getElementById(objetoId);
                // Verificar si el campo está habilitado antes de procesar el drop
                if (!colorGeneraljugador.classList.contains('invisible')) {
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
                        colorGeneraljugador.appendChild(objeto); // Añadir objeto a la caja
                        objeto.remove(); // Eliminar el objeto del DOM
                        colorGeneraljugador.style.opacity = '1' // Añadir clase invisible
                        JugadoresCorrectos++;
                        if (tiempo > 0) {
                            if (JugadoresCorrectos === 22) {
                                showModal(true); // Ganaste si los jugadores están en posición correcta y aún hay tiempo
                                clearInterval(intervalo);
                            }
                        }

                        const index = campos.indexOf(colorGeneraljugador);
                        if (index !== -1 && camposE[index]) {
                            camposE[index].style.opacity = '0'; // Elimina solo el elemento de camposE que coincide con el índice
                        }

                        let puntosElemento = document.querySelector('#puntos');
                        let puntos = parseInt(puntosElemento.textContent) || 0; // Obtener el valor numérico actual
                        puntos++; // Incrementar puntos
                        puntosElemento.textContent = puntos; // Actualizar el contenido de texto en el DOM
                        verificarPuntos(puntos);               

                        imgVar.addEventListener('click', function() {
                            ApereceJugadores();
                        })
                        imgBloqueo.addEventListener('click', function() {
                            ApereceJugadores();
                        });

                        if(puntos > 2) {
                            imgBloqueo.style.opacity = '1'; 
                            imgBloqueo.style.cursor = 'pointer';
                        } else {
                            imgBloqueo.style.opacity = '0.5';
                        }

                        if(puntos > 5) {
                            imgVar.style.opacity = '1';
                            imgVar.style.cursor = 'pointer';
                        } else {
                            imgVar.style.opacity = '0.5';
                        }
                        function ApereceJugadores() {
                            if (imgVar.style.opacity == '1' || imgBloqueo.style.opacity == '1') {
                                tituloJugadores.style.opacity = '1';
                                tituloJugadores.style.cursor = 'pointer';
                                jugadoresDentro.style.opacity = '1';
                            } else {
                                tituloJugadores.style.opacity = '0';
                                tituloJugadores.style.cursor = 'not-allowed';
                                jugadoresDentro.style.opacity = '0';
                            }
                            
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
                        }
                    } else {
                        mostrarModalAlerta();
                        IntentosFallidos++;
                    }
                }else {
                    mostrarModalAlerta2();
                }   
                colorGeneraljugador.classList.remove('cancha-hover'); // Quitar estilo de hover
            });
        });
        const timerElement = document.querySelector('.timer-deportes');
        let campoIndex = 0; // Índice para llevar el seguimiento del campo actual
        let tiempoActivo = false; // Estado que indica si el tiempo está activo o no

        function actualizarEstadoCampo() {
            if (timerElement.textContent.includes("Tiempo")) {
                // Si "Tiempo" está presente y aún no se ha activado el campo actual
                if (!tiempoActivo) {
                    tiempoActivo = true; // Marcamos como activo
                    // Habilitamos el campo actual
                    campos[campoIndex].classList.remove('invisible');
                    camposE[campoIndex].style.opacity = '1';
                    console.log(`Habilitado: ${campos[campoIndex].id}`);
                }
            } else {
                // Si "Tiempo" no está presente y el tiempo estaba activo
                if (tiempoActivo) {
                    tiempoActivo = false; // Marcamos como inactivo
                    // Deshabilitamos el campo actual
                    campos[campoIndex].classList.add('invisible');
        
                    // Verifica si el campo no fue arrastrado y ajusta su opacidad
                    if (camposE[campoIndex].style.opacity === '1') {
                        camposE[campoIndex].style.opacity = '0.5'; // Indica visualmente que está deshabilitado
                    }
                    console.log(`Deshabilitado: ${campos[campoIndex].id}`);
        
                    // Pasamos al siguiente campo
                    campoIndex = (campoIndex + 1) % campos.length;
                }
            }
        }
        

        // Configurar el MutationObserver para observar cambios en el contenido de `timerElement`
        const observer = new MutationObserver(actualizarEstadoCampo);

        // Iniciar la observación de `timerElement`
        observer.observe(timerElement, { characterData: true, childList: true, subtree: true });

        // Ejecutar la función inicialmente para establecer el estado correcto
        actualizarEstadoCampo();

        const objetos = document.querySelectorAll('[draggable="true"]');

        // Función para habilitar el drag
        function habilitarDrag(elemento) {
            elemento.setAttribute('draggable', 'true');
            elemento.style.cursor = 'grab';
            elemento.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text', event.target.id);
            });
        }

        // Función para deshabilitar el drag
        function deshabilitarDrag(elemento) {
            elemento.setAttribute('draggable', 'false');
            elemento.style.cursor = 'not-allowed';
        }

        // Inicializar los elementos
        objetos.forEach(objeto => {
            // Función que maneja el ciclo de habilitación/deshabilitación
            function cicloDeArrastre() {
                const timerElement = document.querySelector('.timer-deportes');
                if (timerElement.textContent.includes("Esperando")) {
                    deshabilitarDrag(objeto);
                } else {
                    habilitarDrag(objeto);
                }
            }

            
        // Verificar el estado de "timerElement" cada segundo
        setInterval(cicloDeArrastre, 100);
        });


     // Inicializamos el tiempo en 4 minutos (240 segundos)
    let tiempo = 8.8 * 60; 
    displayContador = document.getElementById("contador");

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
        showModal(false);
        clearInterval(intervalo);
    }
    }
    // Intervalo que actualiza el contador cada segundo
    const intervalo = setInterval(actualizarContador, 1000);
    // Función que se ejecuta cuando el contador llega a 0
    function showModal(isVictoria = false) {
        const modalContainer = document.getElementById('modalContainer');
        const modal = document.getElementById('modal');
        const modalText = document.getElementById('modalText');
        const timerElement = document.querySelector('.timer-deportes');

        // Cambiar el texto según la condición
        modalText.textContent = isVictoria ? '¡Ganaste!' : 'Finaliza 1º Ronda';

        // Aplicar efectos de opacidad en función del texto del modal
        if ((modalText.textContent === 'Finaliza 1º Ronda' || modalText.textContent === '¡Ganaste!') && timerElement) {
            const imgVar = document.querySelector('.img-var');
            const imgBloqueo = document.querySelector('.img-bloqueoVar');
            imgBloqueo.style.opacity = '0.5';
            imgVar.style.opacity = '0.5';
        }

        // Mostrar el contenedor del primer modal
        modalContainer.classList.add('modal-show');

        // Animar la entrada del primer modal
        setTimeout(() => {
            modal.classList.add('modal-animate-in');
        }, 100);

        // Después de 3 segundos, animar la salida del primer modal
        setTimeout(() => {
            modal.classList.add('modal-animate-out');
            modal.classList.remove('modal-animate-in');
            
            // Ocultar el contenedor del primer modal después de la animación
            setTimeout(() => {
                modalContainer.classList.remove('modal-show');
                modal.classList.remove('modal-animate-out');

                // Si la condición de victoria se cumple, mostrar el segundo modal después de 5 segundos
            if (modalText.textContent === '¡Ganaste!' && timerElement) {
                setTimeout(() => {
                    showNextModal();  // Mostrar el segundo modal
                }, 3000);
            }

            // CAMBIO AQUÍ: Agregar esta condición
            if (modalText.textContent === 'Finaliza 1º Ronda' && timerElement) {
                iniciarSegundaRonda(); // Llamar a la nueva función
            }
            
            }, 500);
        }, 3000);
    }

    // Función para mostrar el siguiente modal sin transiciones
    function showNextModal() {
        const nextModalContainer = document.getElementById('nextModalContainerGanaste');
        const correctosElement = document.getElementById('correctos');
        const incorrectosElement = document.getElementById('incorrectos');

        correctosElement.textContent = JugadoresCorrectos;
        incorrectosElement.textContent = IntentosFallidos;
        
        // Mostrar el siguiente modal inmediatamente sin animación
        nextModalContainer.style.display = 'flex';

         // Configurar redirección al cerrar el segundo modal
        setTimeout(volverASala, 3000000);  // Redirigir después de 3 segundos
    }

    // Función para cerrar el segundo modal y redirigir
    function volverASala() {
        const nextModalContainer = document.getElementById('nextModalContainerGanaste');
        nextModalContainer.style.display = 'none';
        
        // Redirigir al usuario a otra sección
        window.location.href = "ruta-del-apartado.html"; // Cambia por la URL que necesites
    }
}, 3500);

const originalHTML = document.body.innerHTML;

// 2. Agregar esta nueva función:
function iniciarSegundaRonda() {
    document.body.innerHTML = originalHTML;
  
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

    // Lista de campos en el orden de activación
    const campos = [jEquipoUnoUno, jEquipoUnoDos, jEquipoUnoTres, jEquipoUnoCuatro, jEquipoUnoCinco, jEquipoUnoSeis, jEquipoUnoSiete, jEquipoUnoOcho, jEquipoUnoNueve, jEquipoUnoDiez, jEquipoUnoOnce, jEquipoDosUno, jEquipoDosDos, jEquipoDosTres, jEquipoDosCuatro, jEquipoDosCinco, jEquipoDosSeis, jEquipoDosSiete, jEquipoDosOcho, jEquipoDosNueve, jEquipoDosDiez, jEquipoDosOnce];
    const camposE = [jEquipoUnoUnoE, jEquipoUnoDosE, jEquipoUnoTresE, jEquipoUnoCuatroE, jEquipoUnoCincoE, jEquipoUnoSeisE, jEquipoUnoSieteE, jEquipoUnoOchoE, jEquipoUnoNueveE, jEquipoUnoDiezE, jEquipoUnoOnceE, jEquipoDosUnoE, jEquipoDosDosE, jEquipoDosTresE, jEquipoDosCuatroE, jEquipoDosCincoE, jEquipoDosSeisE, jEquipoDosSieteE, jEquipoDosOchoE, jEquipoDosNueveE, jEquipoDosDiezE, jEquipoDosOnceE];
    let tiempoRestante = 10;  // Tiempo inicial para cada jugador en segundos
    let campoActualIndex = 0;  // Índice del campo que está siendo habilitado actualmente
    let habilitarCampoTemIniciado = false; // Bandera para controlar la ejecución

    function Descripcion() {
        const timerElement = document.querySelector('.timer-deportes');
        const descriptions = document.querySelectorAll('.descripcion');
        let currentIndex = 0; // Índice para llevar el seguimiento de la descripción actual
        let esperandoActivo = false; // Bandera para saber si estamos en estado "Esperando"
    
        function updateDescriptions() {
            if (timerElement.textContent.includes("Esperando")) {
                // Si "Esperando" aparece y aún no hemos mostrado la descripción actual
                if (!esperandoActivo) {
                    esperandoActivo = true; // Activar bandera para indicar que estamos mostrando "Esperando"
                    // Mostrar la descripción actual y ocultar las demás
                    descriptions.forEach((desc, index) => {
                        desc.style.display = index === currentIndex ? 'block' : 'none';
                        desc.style.opacity = index === currentIndex ? '1' : '0';
                    });
                    console.log(`Mostrando descripción: ${currentIndex + 1}`);
                }
            } else {
                // Si "Esperando" desaparece, ocultar todas las descripciones y preparar el siguiente índice
                if (esperandoActivo) {
                    esperandoActivo = false; // Desactivar bandera porque "Esperando" ha desaparecido
                    descriptions.forEach((desc) => {
                        desc.style.opacity = '0';
                    });
                    // Avanzar al siguiente índice
                    currentIndex = (currentIndex + 1) % descriptions.length;
                    console.log("Ocultando todas las descripciones");
                }
            }
        }
    
        // Configurar el MutationObserver para observar cambios en el contenido de `timerElement`
        const observer = new MutationObserver(updateDescriptions);
    
        // Iniciar la observación de `timerElement`
        observer.observe(timerElement, { characterData: true, childList: true, subtree: true });
    
        // Ejecutar la función inicialmente para establecer el estado correcto
        updateDescriptions();
    }
    
    // Llamar a la función
    Descripcion();        

    // Función para habilitar y deshabilitar campos con temporizador de 9 segundos y un retraso de 5 segundos entre cada campo
    function Temporizador() {
        if (habilitarCampoTemIniciado) return;
        habilitarCampoTemIniciado = true;

        const TIEMPO_ESPERA = 5;  // 5 segundos de espera
        const TIEMPO_ACTIVO = 10; // 10 segundos activo
        let tiempoEspera = TIEMPO_ESPERA; // Contador para tiempo de espera

        if (campoActualIndex >= campos.length) {
            habilitarCampoTemIniciado = false;
            return;
        }

        // Contador para los 5 segundos de espera
        const esperaInterval = setInterval(() => {

            // Verifica si se cumple la condición para detener el temporizador
            if (modalText.textContent === '¡Ganaste!' || modalText.textContent === 'Se acabo el tiempo...') {
                clearInterval(esperaInterval);
                habilitarCampoTemIniciado = false; // Restablece el estado
                return;
            }

            timerElement.textContent = `Esperando campo: ${tiempoEspera}s`;
            console.log(`Tiempo de espera: ${tiempoEspera}`);
            tiempoEspera--;

            if (tiempoEspera < 0) {
                clearInterval(esperaInterval);
                activarCampo();
            }
        }, 1000);

        function activarCampo() {
            const campoActual = campos[campoActualIndex];
            
            // Activar el campo
            campoActual.removeAttribute('disabled');
            campoActual.classList.add('habilitado');
            tiempoRestante = TIEMPO_ACTIVO;

            // Temporizador para los 10 segundos activos
            const intervalId = setInterval(() => {

                // Verifica si se cumple la condición para detener el temporizador
                if (modalText.textContent === '¡Ganaste!' || modalText.textContent === 'Se acabo el tiempo...') {
                    clearInterval(intervalId);
                    habilitarCampoTemIniciado = false; // Restablece el estado
                    return;
                }

                timerElement.textContent = `Tiempo para responder: ${tiempoRestante}s`;
                console.log(`Tiempo restante: ${tiempoRestante}`);
                tiempoRestante--;

                if (tiempoRestante < 0) {
                    clearInterval(intervalId);
                    
                    // Desactivar campo
                    campoActual.setAttribute('disabled', true);
                    campoActual.classList.remove('habilitado');
                    
                    // Guardar respuesta
                    const respuesta = campoActual.value;
                    console.log(`Respuesta guardada: ${respuesta}`);
                    
                    campoActualIndex++;
                    tiempoEspera = TIEMPO_ESPERA; // Reiniciar tiempo de espera

                    // Iniciar siguiente ciclo si la condición no se cumple
                    if (!(modalText.textContent === '¡Ganaste!' || modalText.textContent === 'Se acabo el tiempo...')) {
                        setTimeout(() => {
                            habilitarCampoTemIniciado = false;
                            Temporizador();
                        }, 0);
                    }
                }
            }, 1000);
        }
    }
    // Iniciar la habilitación de campos desde el primero
    Temporizador();
            
    let JugadoresCorrectos = 0; // Contador de jugadores correcto
    let IntentosFallidos = 0;

    // Configuración de arrastrar y soltar en cada campo
    campos.forEach(colorGeneraljugador => {
        colorGeneraljugador.addEventListener('dragover', (event) => {
            event.preventDefault();
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

    // Función para mostrar el modal de alerta
    function mostrarModalAlerta() {
        const modal = document.getElementById('modalAlerta');
        modal.style.display = 'block'; // Muestra el modal

        // Oculta el modal después de 2 segundos
        setTimeout(() => {
            modal.style.display = 'none';
        }, 2000);
    }

    // Función para mostrar el segundo modal de alerta
    function mostrarModalAlerta2() {
        const modal2 = document.getElementById('modalAlerta2');
        modal2.style.display = 'block'; // Muestra el segundo modal

        // Oculta el segundo modal después de 2 segundos
        setTimeout(() => {
            modal2.style.display = 'none';
        }, 2000);
    }

        colorGeneraljugador.addEventListener('drop', (event) => {
            event.preventDefault();
            const objetoId = event.dataTransfer.getData('text');
            const objeto = document.getElementById(objetoId);
            // Verificar si el campo está habilitado antes de procesar el drop
            if (!colorGeneraljugador.classList.contains('invisible')) {
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
                    colorGeneraljugador.appendChild(objeto); // Añadir objeto a la caja
                    objeto.remove(); // Eliminar el objeto del DOM
                    colorGeneraljugador.style.opacity = '1' // Añadir clase invisible
                    JugadoresCorrectos++;
                    if (tiempo > 0) {
                        if (JugadoresCorrectos === 22) {
                            showModal(true); // Ganaste si los jugadores están en posición correcta y aún hay tiempo
                            clearInterval(intervalo);
                        }
                    }

                    const index = campos.indexOf(colorGeneraljugador);
                    if (index !== -1 && camposE[index]) {
                        camposE[index].style.opacity = '0'; // Elimina solo el elemento de camposE que coincide con el índice
                    }

                    let puntosElemento = document.querySelector('#puntos');
                    let puntos = parseInt(puntosElemento.textContent) || 0; // Obtener el valor numérico actual
                    puntos++; // Incrementar puntos
                    puntosElemento.textContent = puntos; // Actualizar el contenido de texto en el DOM
                    verificarPuntos(puntos);
                } else {
                    mostrarModalAlerta();
                    IntentosFallidos++;
                }
            }else {
                mostrarModalAlerta2();
            }   
            colorGeneraljugador.classList.remove('cancha-hover'); // Quitar estilo de hover
        });
    });
    const timerElement = document.querySelector('.timer-deportes');
    let campoIndex = 0; // Índice para llevar el seguimiento del campo actual
    let tiempoActivo = false; // Estado que indica si el tiempo está activo o no

    function actualizarEstadoCampo() {
        if (timerElement.textContent.includes("Tiempo")) {
            // Si "Tiempo" está presente y aún no se ha activado el campo actual
            if (!tiempoActivo) {
                tiempoActivo = true; // Marcamos como activo
                // Habilitamos el campo actual
                campos[campoIndex].classList.remove('invisible');
                camposE[campoIndex].style.opacity = '1';
                console.log(`Habilitado: ${campos[campoIndex].id}`);
            }
        } else {
            // Si "Tiempo" no está presente y el tiempo estaba activo
            if (tiempoActivo) {
                tiempoActivo = false; // Marcamos como inactivo
                // Deshabilitamos el campo actual
                campos[campoIndex].classList.add('invisible');
    
                // Verifica si el campo no fue arrastrado y ajusta su opacidad
                if (camposE[campoIndex].style.opacity === '1') {
                    camposE[campoIndex].style.opacity = '0.5'; // Indica visualmente que está deshabilitado
                }
                console.log(`Deshabilitado: ${campos[campoIndex].id}`);
    
                // Pasamos al siguiente campo
                campoIndex = (campoIndex + 1) % campos.length;
            }
        }
    }
    

    // Configurar el MutationObserver para observar cambios en el contenido de `timerElement`
    const observer = new MutationObserver(actualizarEstadoCampo);

    // Iniciar la observación de `timerElement`
    observer.observe(timerElement, { characterData: true, childList: true, subtree: true });

    // Ejecutar la función inicialmente para establecer el estado correcto
    actualizarEstadoCampo();

    const objetos = document.querySelectorAll('[draggable="true"]');

    // Función para habilitar el drag
    function habilitarDrag(elemento) {
        elemento.setAttribute('draggable', 'true');
        elemento.style.cursor = 'grab';
        elemento.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text', event.target.id);
        });
    }

    // Función para deshabilitar el drag
    function deshabilitarDrag(elemento) {
        elemento.setAttribute('draggable', 'false');
        elemento.style.cursor = 'not-allowed';
    }

    // Inicializar los elementos
    objetos.forEach(objeto => {
        // Función que maneja el ciclo de habilitación/deshabilitación
        function cicloDeArrastre() {
            const timerElement = document.querySelector('.timer-deportes');
            if (timerElement.textContent.includes("Esperando")) {
                deshabilitarDrag(objeto);
            } else {
                habilitarDrag(objeto);
            }
        }

        
    // Verificar el estado de "timerElement" cada segundo
    setInterval(cicloDeArrastre, 100);
    });


 // Inicializamos el tiempo en 4 minutos (240 segundos)
    let tiempo = 6.3 * 60; 
    displayContador = document.getElementById("contador");

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
        showModal(false);
        clearInterval(intervalo);
    }
    }
    // Intervalo que actualiza el contador cada segundo
    const intervalo = setInterval(actualizarContador, 1000);
    // Función que se ejecuta cuando el contador llega a 0
    function showModal(isVictoria = false) {
        const modalContainer = document.getElementById('modalContainer');
        const modal = document.getElementById('modal');
        const modalText = document.getElementById('modalText');
        const timerElement = document.querySelector('.timer-deportes');

        // Cambiar el texto según la condición
        modalText.textContent = isVictoria ? '¡Ganaste!' : 'Se acabo el tiempo...';

        // Aplicar efectos de opacidad en función del texto del modal
        if ((modalText.textContent === 'Se acabo el tiempo...' || modalText.textContent === '¡Ganaste!') && timerElement) {
            const imgVar = document.querySelector('.img-var');
            const imgBloqueo = document.querySelector('.img-bloqueoVar');
            imgBloqueo.style.opacity = '0.5';
            imgVar.style.opacity = '0.5';
        }

        // Mostrar el contenedor del primer modal
        modalContainer.classList.add('modal-show');

        // Animar la entrada del primer modal
        setTimeout(() => {
            modal.classList.add('modal-animate-in');
        }, 100);

        // Después de 3 segundos, animar la salida del primer modal
        setTimeout(() => {
            modal.classList.add('modal-animate-out');
            modal.classList.remove('modal-animate-in');
            
            // Ocultar el contenedor del primer modal después de la animación
            setTimeout(() => {
                modalContainer.classList.remove('modal-show');
                modal.classList.remove('modal-animate-out');

                // Si la condición de victoria se cumple, mostrar el segundo modal después de 5 segundos
            if (modalText.textContent === '¡Ganaste!' && timerElement) {
                setTimeout(() => {
                    showNextModal();  // Mostrar el segundo modal
                }, 3000);
            }
            if (modalText.textContent === 'Se acabo el tiempo...' && timerElement) {
                setTimeout(() => {
                    showNextModalPerder();  // Mostrar el segundo modal
                }, 3000);
            }
            }, 500);
        }, 3000);
    }

    // Función para mostrar el siguiente modal sin transiciones
    function showNextModal() {
        const nextModalContainer = document.getElementById('nextModalContainerGanaste');
        const correctosElement = document.getElementById('correctos');
        const incorrectosElement = document.getElementById('incorrectos');

        correctosElement.textContent = JugadoresCorrectos;
        incorrectosElement.textContent = IntentosFallidos;
        
        // Mostrar el siguiente modal inmediatamente sin animación
        nextModalContainer.style.display = 'flex';

        // Configurar redirección al cerrar el segundo modal
        setTimeout(volverASala, 3000);  // Redirigir después de 3 segundos
    }

    // Función para mostrar el siguiente modal sin transiciones
    function showNextModalPerder() {
        const nextModalContainer = document.getElementById('nextModalContainerPerdiste');
        const correctosElement = document.getElementById('correctos2');
        const incorrectosElement = document.getElementById('incorrectos2');

        correctosElement.textContent = JugadoresCorrectos;
        incorrectosElement.textContent = IntentosFallidos;
        
        // Mostrar el siguiente modal inmediatamente sin animación
        nextModalContainer.style.display = 'flex';

        // Configurar redirección al cerrar el segundo modal
        setTimeout(volverASala, 300000);  // Redirigir después de 3 segundos
    }

    // Función para cerrar el segundo modal y redirigir
    function volverASala() {
        const nextModalContainer = document.getElementById('nextModalContainerGanaste');
        nextModalContainer.style.display = 'none';
        
        // Redirigir al usuario a otra sección
        window.location.href = "ruta-del-apartado.html"; // Cambia por la URL que necesites
    }
}