        const formulario = document.getElementById('registro-form');
        const inputs = document.querySelectorAll('#registro-form input');

        const palabrasProhibidas = [
            'admin', 'root', 'administrador', 'idiota', 'imbecil', 'estupido',
            'pendejo', 'tonto', 'bobo', 'puto', 'mierda', 'cabron', 'maricon',
            'polla', 'coño', 'hijueputa', 'malparido', 'gonorrea', 'carechimba',
            'carepicha', 'caremonda', 'fuck', 'shit', 'bitch', 'asshole', 
            'bastard', 'huevon', 'boludo', 'pelotudo', 'gilipolla'
        ];

        const expresiones = {
            usuario: /^[a-zA-Z0-9\_\-]{4,8}$/, // Letras, números, guion y guion bajo entre 4 y 8 caracteres
            password: /^.{4,}$/, // Mínimo 4 caracteres
        };

        const campos = {
            usuario: false,
            password: false
        };

        function normalizarTexto(texto) {
            return texto.toLowerCase()
                .replace(/[áàäâ]/g, 'a')
                .replace(/[éèëê]/g, 'e')
                .replace(/[íìïî]/g, 'i')
                .replace(/[óòöô]/g, 'o')
                .replace(/[úùüû]/g, 'u')
                .replace(/[^a-z0-9]/g, ''); // Eliminar caracteres especiales
        }

        function contienePalabraProhibida(texto) {
            const textoNormalizado = normalizarTexto(texto);
            return palabrasProhibidas.some(palabra => textoNormalizado.includes(palabra));
        }

        const validarFormulario = (e) => {
            switch (e.target.name) {
                case "usuario":
                    validarUsuario(e.target);
                    break;
                case "password":
                    validarCampo(expresiones.password, e.target, 'password');
                    break;
            }
        };

        const validarUsuario = (input) => {
            const usuario = input.value.toLowerCase();

            // Validar si el formato del usuario es correcto
            if (!expresiones.usuario.test(input.value)) {
                input.classList.add('input-error');
                input.classList.remove('input-success');
                campos.usuario = false;
                return;
            }

            // Verificar si contiene palabras prohibidas
            if (contienePalabraProhibida(usuario)) {
                input.classList.add('input-error'); // Cambiar borde a rojo
                input.classList.remove('input-success');
                campos.usuario = false;
                return;
            }

            // Si pasa ambas validaciones
            input.classList.remove('input-error');
            input.classList.add('input-success');
            campos.usuario = true;
        };

        const validarCampo = (expresion, input, campo) => {
            if (expresion.test(input.value)) {
                input.classList.remove('input-error');
                input.classList.add('input-success');
                campos[campo] = true;
            } else {
                input.classList.add('input-error');
                input.classList.remove('input-success');
                campos[campo] = false;
            }
        };

        inputs.forEach((input) => {
            input.addEventListener('keyup', validarFormulario);
            input.addEventListener('blur', validarFormulario);
        });

        formulario.addEventListener('submit', (e) => {
            e.preventDefault();

            if (campos.usuario && campos.password) {
                formulario.submit();
            } else {
                alert('Por favor completa todos los campos correctamente.');
            }
        });
