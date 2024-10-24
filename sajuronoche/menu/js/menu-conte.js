const enlinea = document.getElementById('en-linea');
const ofline = document.getElementById('ofline');

enlinea.addEventListener('click', () => {
    ofline.style.display = 'grid'
    enlinea.style.display = 'none'
} );
ofline.addEventListener('click', () => {
    ofline.style.display = 'none'
    enlinea.style.display = 'grid'
} );
