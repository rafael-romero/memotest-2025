let intentos = 0;
let cantidadDeTarjetas = 12;
let hayUnaTarjetaDestapada = false;
let cartaDestapada = {
  nombre: "",
  numero: "",
};

let baraja = [
  "bellsprout",
  "caterpie",
  "charmander",
  "chikorita",
  "dratini",
  "eeveee",
];

function reiniciarContadores() {
  intentos = 0;
  cantidadDeTarjetas = 12;
  baraja = [
    "bellsprout",
    "caterpie",
    "charmander",
    "chikorita",
    "dratini",
    "eeveee",
  ];
}

function reiniciarTarjetaDestapada() {
  hayUnaTarjetaDestapada = false;
  cartaDestapada.nombre = "";
  cartaDestapada.numero = "";
}

function quitarClase(elemento, clase) {
  elemento.classList.remove(clase);
}

function agregarClase(elemento, clase) {
  elemento.classList.add(clase);
}

function ocultarBotonIniciar($botonIniciar) {
  if ($botonIniciar) {
    agregarClase($botonIniciar, "ocultar");
  }
}

function crearBarajaDoble(baraja) {
  return baraja.flatMap((carta) => [carta, carta]);
}

function mezclarBaraja(baraja) {
  for (let i = baraja.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [baraja[i], baraja[j]] = [baraja[j], baraja[i]];
  }
  return baraja;
}

function asignarImagenACadaTarjeta(barajaMezclada) {
  const $tarjetas = document.querySelectorAll(".tarjeta-frontal");
  $tarjetas.forEach(($tarjeta, index) => {
    const carta = barajaMezclada[index];
    const $imagen = document.createElement("img");
    $imagen.src = `./img/${carta}.png`;
    $imagen.classList.add("imagen-carta");
    $tarjeta.setAttribute("data-carta", carta);
    $tarjeta.setAttribute("data-numero-de-carta", index + 1);
    $tarjeta.appendChild($imagen);
  });
}

function borrarImagenesDeTarjetas() {
  const $tarjetas = document.querySelectorAll(".tarjeta-frontal");
  $tarjetas.forEach((tarjeta) => {
    const $imagen = tarjeta.querySelector(".imagen-carta");
    if ($imagen) {
      tarjeta.removeChild($imagen);
      tarjeta.removeAttribute("data-carta");
      tarjeta.removeAttribute("data-numero-de-carta");
    }
  });
}

function taparTodasLasTarjetas() {
  const $tarjetas = document.querySelectorAll(".carta");
  $tarjetas.forEach((tarjeta) => {
    quitarClase(tarjeta, "destapada");
    quitarClase(tarjeta, "deshabilitada");
  });
}

function activarTablero() {
  const $tablero = document.querySelector("#tablero");
  quitarClase($tablero, "desactivado");
}

function desactivarTablero() {
  const $tablero = document.querySelector("#tablero");
  agregarClase($tablero, "desactivado");
}

function mostrarMensaje(elemento, mensaje) {
  const dosSegundos = 2000;
  const $elemento = document.querySelector(`${elemento}`);
  $elemento.textContent = mensaje;
  setTimeout(() => {
    $elemento.textContent = "";
  }, dosSegundos);
}

const $botonIniciar = document.querySelector("#iniciar-btn");
$botonIniciar.addEventListener("click", () => {
  reiniciarContadores();
  reiniciarTarjetaDestapada();
  borrarImagenesDeTarjetas();
  taparTodasLasTarjetas();
  ocultarBotonIniciar($botonIniciar);
  const barajaDoble = crearBarajaDoble(baraja);
  const barajaMezclada = mezclarBaraja(barajaDoble);
  asignarImagenACadaTarjeta(barajaMezclada);
  mostrarMensaje("#mensaje", "Bienvenido, juguemos!!!");
  activarTablero();
});

function actualizarIntentos(intentos) {
  const $contadorIntentos = document.querySelector("#intentos");
  $contadorIntentos.textContent = intentos;
}

function jugarNuevamente() {
  $botonIniciar.textContent = "Jugamos de nuevo?";
  quitarClase($botonIniciar, "ocultar");
}

const $cartas = document.querySelectorAll(".carta");
$cartas.forEach((carta) => {
  carta.addEventListener("click", (event) => {
    const tarjeta = event.currentTarget;
    const hijoDeTarjeta = tarjeta.firstElementChild;
    const nombreDeLaCarta = hijoDeTarjeta.getAttribute("data-carta");
    const numeroDeLaCarta = hijoDeTarjeta.getAttribute("data-numero-de-carta");
    const dosSegundos = 2000;
    if (!hayUnaTarjetaDestapada) {
      cartaDestapada.nombre = nombreDeLaCarta;
      cartaDestapada.numero = numeroDeLaCarta;
      agregarClase(tarjeta, "destapada");
      agregarClase(tarjeta, "deshabilitada");
      hayUnaTarjetaDestapada = true;
      return;
    } else {
      agregarClase(tarjeta, "destapada");
      agregarClase(tarjeta, "deshabilitada");
      desactivarTablero();
      if (cartaDestapada.nombre === nombreDeLaCarta) {
        reiniciarTarjetaDestapada();
        intentos++;
        actualizarIntentos(intentos);
        cantidadDeTarjetas -= 2;
        mostrarMensaje("#mensaje", "Bien hecho son iguales!!!");
        if (0 === cantidadDeTarjetas) {
          setTimeout(() => {
            mostrarMensaje(
              "#mensaje",
              `Lo conseguiste, GANASTE en ${intentos} intentos!!!`
            );
          }, dosSegundos);
          setTimeout(jugarNuevamente, dosSegundos + 1000);
        } else {
          setTimeout(activarTablero, dosSegundos);
        }
      } else {
        intentos++;
        actualizarIntentos(intentos);
        mostrarMensaje("#mensaje", "Mala suerte NO son iguales!!!");
        setTimeout(() => {
          quitarClase(tarjeta, "destapada");
          quitarClase(tarjeta, "deshabilitada");
          const $tarjetaDestapada = document.querySelector(
            `[data-numero-de-carta="${cartaDestapada.numero}"]`
          );
          const $papaTarjetaDestapada = $tarjetaDestapada.parentElement;
          quitarClase($papaTarjetaDestapada, "destapada");
          quitarClase($papaTarjetaDestapada, "deshabilitada");
          activarTablero();
        }, dosSegundos);
        setTimeout(reiniciarTarjetaDestapada, dosSegundos);
      }
    }
  });
});
