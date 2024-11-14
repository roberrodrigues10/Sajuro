document.addEventListener('DOMContentLoaded', function() {
    const imgVar = document.querySelector('.img-var');
    const imgBloqueoVar = document.querySelector('.img-bloqueoVar');
  
    // Función para mostrar/ocultar el modal
    function toggleModal(target, show) {
      const modal = document.querySelector(`.modal-hover[data-target="${target}"]`);
      modal.style.display = show ? 'flex' : 'none';
    }
  
    // Escuchadores de eventos para cada elemento
    imgVar.addEventListener('mouseenter', () => {
      if (getComputedStyle(imgVar).opacity === '1') {
        toggleModal('img-var', true);
      }
    });
    imgVar.addEventListener('mouseleave', () => toggleModal('img-var', false));
  
    imgBloqueoVar.addEventListener('mouseenter', () => {
      if (getComputedStyle(imgBloqueoVar).opacity === '1') {
        toggleModal('img-bloqueoVar', true);
      }
    });
    imgBloqueoVar.addEventListener('mouseleave', () => toggleModal('img-bloqueoVar', false));
  });