const CANTIDAD_DE_TARJETAS = 12;
const POKEMONS = [
  "bellsprout",
  "caterpie",
  "charmander",
  "chikorita",
  "dratini",
  "eeveee",
];
const dosSegundosEnMs = 2000;
let intentos = 0;
let hayUnaTarjetaDestapada = false;
let cartaDestapada = {
  nombre: "",
  numero: "",
  elemento: null,
};
let parejasEncontradas = 0;
let mensajeTimeoutId;
let barajaActual = [];
const $mensaje = document.querySelector("#mensaje");
const $contadorIntentos = document.querySelector("#intentos");
const $textoIntentos = document.querySelector("#texto-intentos");
$textoIntentos.classList.add("ocultar");
const $cartas = document.querySelectorAll(".carta");

let sonidoActivado = true;
const sonidoAcierto = new Audio("./sounds/acierto.mp3");
const sonidoError = new Audio("./sounds/error.mp3");
const sonidoComienzo = new Audio("./sounds/comienzo.mp3");
const sonidoVictoria = new Audio("./sounds/victoria.mp3");
const sonidoCortinaFondo = new Audio("./sounds/fondo_cortina.mp3");
sonidoCortinaFondo.loop = true;
sonidoCortinaFondo.volume = 0.1;

const $controlVolumenIcono = document.querySelector("#control-volumen i");
$controlVolumenIcono.addEventListener("click", () => {
  sonidoActivado = !sonidoActivado;
  if (sonidoActivado) {
    $controlVolumenIcono.classList.remove("fa-volume-mute");
    $controlVolumenIcono.classList.add("fa-volume-up");
    sonidoAcierto.muted = false;
    sonidoError.muted = false;
    sonidoComienzo.muted = false;
    sonidoVictoria.muted = false;
    sonidoCortinaFondo.muted = false;
    sonidoCortinaFondo.volume = 0.1;
    if (sonidoCortinaFondo.paused) {
      sonidoCortinaFondo.play().catch((e) => {
        console.error("Error al reproducir el sonido de fondo:", e);
      });
    }
  } else {
    $controlVolumenIcono.classList.remove("fa-volume-up");
    $controlVolumenIcono.classList.add("fa-volume-mute");
    sonidoAcierto.muted = true;
    sonidoError.muted = true;
    sonidoComienzo.muted = true;
    sonidoVictoria.muted = true;
    sonidoCortinaFondo.muted = true;
  }
});

function reiniciarContadores() {
  intentos = 0;
  parejasEncontradas = 0;
  barajaActual = [...POKEMONS];
}

function reiniciarTarjetaDestapada() {
  hayUnaTarjetaDestapada = false;
  cartaDestapada.nombre = "";
  cartaDestapada.numero = "";
  cartaDestapada.elemento = null;
}

function crearBarajaDoble(barajaActual) {
  return barajaActual.flatMap((carta) => [carta, carta]);
}

function mezclarBaraja(barajaActual) {
  for (let i = barajaActual.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [barajaActual[i], barajaActual[j]] = [barajaActual[j], barajaActual[i]];
  }
  return barajaActual;
}

function asignarImagenACadaTarjeta(barajaMezclada) {
  $cartas.forEach(($carta, index) => {
    const carta = barajaMezclada[index];
    const $tarjetaFrontal = $carta.querySelector(".tarjeta-frontal");
    let $imagen = $tarjetaFrontal.querySelector(".imagen-carta");

    if (!$imagen) {
      $imagen = document.createElement("img");
      $imagen.classList.add("imagen-carta");
      $tarjetaFrontal.appendChild($imagen);
    }

    $imagen.src = `./img/${carta}.png`;
    $imagen.alt = carta;
    $carta.setAttribute("data-carta", carta);
  });
}

function borrarImagenesDeTarjetas() {
  $cartas.forEach(($carta) => {
    const $tarjetaFrontal = $carta.querySelector(".tarjeta-frontal");
    const $imagen = $tarjetaFrontal.querySelector(".imagen-carta");
    if ($imagen) {
      $tarjetaFrontal.removeChild($imagen);
    }
    $carta.removeAttribute("data-carta");
  });
}

function taparTodasLasTarjetas() {
  const $tarjetas = document.querySelectorAll(".carta");
  $tarjetas.forEach((tarjeta) => {
    tarjeta.classList.remove("destapada", "deshabilitada");
  });
}

function activarTablero() {
  const $tablero = document.querySelector("#tablero");
  $tablero.classList.remove("desactivado");
}

function desactivarTablero() {
  const $tablero = document.querySelector("#tablero");
  $tablero.classList.add("desactivado");
}

function actualizarMensajeTemporal(mensaje) {
  clearTimeout(mensajeTimeoutId);
  $mensaje.textContent = mensaje;
  $mensaje.style.visibility = "visible";
  mensajeTimeoutId = setTimeout(() => {
    $mensaje.textContent = "";
    $mensaje.style.visibility = "hidden";
  }, dosSegundosEnMs);
}

function iniciarNuevoJuego() {
  reiniciarContadores();
  reiniciarTarjetaDestapada();
  borrarImagenesDeTarjetas();
  taparTodasLasTarjetas();
  $botonIniciar.classList.add("ocultar");
  $textoIntentos.classList.remove("ocultar");
  const barajaDoble = crearBarajaDoble(barajaActual);
  const barajaMezclada = mezclarBaraja(barajaDoble);
  asignarImagenACadaTarjeta(barajaMezclada);
  actualizarMensajeTemporal("Bienvenido, juguemos!!!");
  setTimeout(activarTablero, dosSegundosEnMs * 1.5);
  sonidoComienzo.play();
  setTimeout(() => {
    sonidoCortinaFondo.play().catch((e) => {
      console.error("Error al reproducir el sonido de fondo:", e);
    });
  }, dosSegundosEnMs * 2);
}

const $botonIniciar = document.querySelector("#iniciar-btn");
$botonIniciar.addEventListener("click", iniciarNuevoJuego);

function actualizarIntentos() {
  $contadorIntentos.textContent = intentos;
}

function jugarNuevamente() {
  $botonIniciar.textContent = "Jugamos de nuevo?";
  $botonIniciar.classList.remove("ocultar");
  intentos = 0;
  actualizarIntentos();
}

function manejarTurno($cartaClickeada) {
  const nombreDeLaCarta = $cartaClickeada.dataset.carta;
  if (
    $cartaClickeada.classList.contains("destapada") ||
    $cartaClickeada.classList.contains("deshabilitada")
  ) {
    return;
  }

  $cartaClickeada.classList.add("destapada");
  if (!hayUnaTarjetaDestapada) {
    cartaDestapada.nombre = nombreDeLaCarta;
    cartaDestapada.elemento = $cartaClickeada;

    $cartaClickeada.classList.add("deshabilitada");
    hayUnaTarjetaDestapada = true;
    return;
  } else {
    $cartaClickeada.classList.add("deshabilitada");
    desactivarTablero();
    if (cartaDestapada.nombre === nombreDeLaCarta) {
      sonidoAcierto.play();
      actualizarMensajeTemporal("Bien hecho son iguales!!!");
      parejasEncontradas++;
      reiniciarTarjetaDestapada();
      if (parejasEncontradas * 2 === CANTIDAD_DE_TARJETAS) {
        setTimeout(() => {
          sonidoVictoria.play();
          actualizarMensajeTemporal(`GANASTE en ${intentos} intentos!!!`);
          $textoIntentos.classList.add("ocultar");
        }, dosSegundosEnMs * 1.5);

        setTimeout(jugarNuevamente, dosSegundosEnMs * 2);
      } else {
        setTimeout(activarTablero, dosSegundosEnMs);
      }
    } else {
      actualizarMensajeTemporal("Mala suerte NO son iguales!!!");
      sonidoError.play();
      setTimeout(() => {
        $cartaClickeada.classList.remove("destapada", "deshabilitada");

        if (cartaDestapada.elemento) {
          cartaDestapada.elemento.classList.remove(
            "destapada",
            "deshabilitada"
          );
        }
        activarTablero();
        reiniciarTarjetaDestapada();
      }, dosSegundosEnMs);
    }
    intentos++;
    actualizarIntentos();
  }
}
$cartas.forEach((carta) => {
  carta.addEventListener("click", (event) => {
    manejarTurno(event.currentTarget);
  });
});
