document.addEventListener('DOMContentLoaded', function() {
    const statusSwitch = document.getElementById('statusSwitch');

    // Cargar el estado inicial
    const savedStatus = localStorage.getItem('playerStatus');
    statusSwitch.checked = savedStatus === 'ON';

    statusSwitch.addEventListener('change', function() {
        const newStatus = this.checked ? 'ON' : 'OFF';
        localStorage.setItem('playerStatus', newStatus);
    });
});