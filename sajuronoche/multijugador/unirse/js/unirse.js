const socket =  new WebSocket('ws://localhost:8080')

socket.onopen = () => {
    console.log('conectado al servidor');
};


const unirseSalaBtn = document.getElementById('unirse-sala')
if(unirseSalaBtn){
    unirseSalaBtn.addEventListener('click', async () =>{
        const codigoSalaInput = document.getElementById('codigo-sala-input')
        const codigoSala = codigoSalaInput.value;
        console.log('codigo ingresado: ', codigoSala)

        const usuarioId = sessionStorage.getItem('usuarioId')
    })

}