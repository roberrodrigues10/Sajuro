document.addEventListener('DOMContentLoaded', function() {
    const invitarPerfil = document.getElementById('InvitarPerfil');
    const h4Element = invitarPerfil.querySelector('h4');
    
    h4Element.addEventListener('click', function(event) {
        event.preventDefault(); // Previene cualquier comportamiento predeterminado
        
        const mensaje = "¡Únete a nuestra Juego!";
        const url = "https://Sajuro.com"; // URL real
        
        // Crear opciones de compartir con iconos
        const shareOptions = [
            { name: 'WhatsApp', icon: '📱', url: `https://wa.me/?text=${encodeURIComponent(mensaje + " " + url)}` },
            { name: 'Facebook', icon: '👍', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
            { name: 'Copiar enlace', icon: '📋', action: 'copy' } // Nueva opción para copiar enlace
        ];
        
        // Crear y mostrar el menú de compartir
        const shareMenu = document.createElement('div');
        shareMenu.style.position = 'absolute';
        shareMenu.style.background = 'linear-gradient(135deg, #c397ff, #a1eafb)'; // Degradado morado claro y celeste
        shareMenu.style.borderRadius = '3vw'; // Borde redondeado
        shareMenu.style.padding = '10px';
        shareMenu.style.zIndex = '1000';
        shareMenu.style.color = 'white'; // Texto en blanco
        
        // Añadir opciones de compartir
        shareOptions.forEach(option => {
            const link = document.createElement('a');
            link.innerHTML = `${option.icon} ${option.name}`; // Añadir icono y nombre
            link.style.display = 'block';
            link.style.padding = '10px';
            link.style.color = 'white'; // Texto en blanco
            link.style.textDecoration = 'none'; // Quitar subrayado
            link.style.cursor = 'pointer';
            
            if (option.action === 'copy') {
                // Función para copiar el enlace al portapapeles
                link.addEventListener('click', () => {
                    navigator.clipboard.writeText(url)
                        .then(() => alert('Enlace copiado al portapapeles'))
                        .catch(err => console.error('Error al copiar el enlace', err));
                });
            } else {
                link.href = option.url;
                link.target = '_blank';
            }
            
            shareMenu.appendChild(link);
        });
        
        // Posicionar el menú cerca del elemento h4
        const rect = h4Element.getBoundingClientRect();
        shareMenu.style.left = `${rect.left}px`;
        shareMenu.style.top = `${rect.bottom}px`;
        
        // Agregar el menú al cuerpo del documento
        document.body.appendChild(shareMenu);
        
        // Cerrar el menú cuando se hace clic fuera de él
        document.addEventListener('click', function closeMenu(e) {
            if (!shareMenu.contains(e.target) && e.target !== h4Element) {
                document.body.removeChild(shareMenu);
                document.removeEventListener('click', closeMenu);
            }
        });
    });
});
