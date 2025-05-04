function eliminarSubtituloYBotonIniciar($botonIniciar){
  const $subtitulo = document.querySelector("#subtitulo");
  if ($subtitulo) {
    $subtitulo.classList.add("ocultar");
  }
  if ($botonIniciar) {
    $botonIniciar.classList.add("ocultar");
  }
}


const $botonIniciar = document.querySelector("#iniciar-btn");
$botonIniciar.addEventListener("click", () => {
  eliminarSubtituloYBotonIniciar($botonIniciar);
  // aca deberia limpiar el tablero una vez lo haga dinamico y habilitarlo
  // crear el tablero y agregar las tarjetas al tablero
  // reiniciar las rondas y los intentos
});
