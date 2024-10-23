const puzzlePieces = document.querySelectorAll('.puzzle-piece');
let currentPieceIndex = 0;

// Función para mostrar las piezas del rompecabezas
function showPiece() {
  if (currentPieceIndex < puzzlePieces.length) {
    puzzlePieces[currentPieceIndex].style.display = 'block'; // Muestra la pieza
    puzzlePieces[currentPieceIndex].style.opacity = 1; // Asegura que sea visible
    currentPieceIndex++;
  } else {
    clearInterval(intervalId); // Detiene el intervalo después de mostrar todas las piezas
    window.location.href = '../menu/amigos-suge.html'
  }
}

const intervalId = setInterval(showPiece, 1200);