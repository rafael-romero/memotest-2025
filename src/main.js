let intentos = 0;
let cantidadDeTarjetas = 12;
let hayUnaTarjetaDestapada = false;
let cartaDestapada = {
  nombre: "",
  numero: "",
  elemento: null,
};
let parejasEncontradas = 0;

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
  parejasEncontradas = 0;
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
  cartaDestapada.elemento = null;
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
  const $cartas = document.querySelectorAll(".carta");
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
    $carta.setAttribute("data-numero-de-carta", index + 1);
  });
}

function borrarImagenesDeTarjetas() {
  const $cartas = document.querySelectorAll(".carta");
  $cartas.forEach(($carta) => {
    const $tarjetaFrontal = $carta.querySelector(".tarjeta-frontal");
    const $imagen = $tarjetaFrontal.querySelector(".imagen-carta");
    if ($imagen) {
      $tarjetaFrontal.removeChild($imagen);
    }
    $carta.removeAttribute("data-carta");
    $carta.removeAttribute("data-numero-de-carta");
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
  intentos = 0; 
  actualizarIntentos(intentos); 
}

const $cartas = document.querySelectorAll(".carta");
$cartas.forEach((carta) => {
  carta.addEventListener("click", (event) => {
    const $cartaClickeada = event.currentTarget;
    const nombreDeLaCarta = $cartaClickeada.dataset.carta;
    const numeroDeLaCarta = $cartaClickeada.dataset.numeroDeCarta;
    const tiempoEsperaVolteo = 1000;
    if (
      $cartaClickeada.classList.contains("destapada") ||
      $cartaClickeada.classList.contains("deshabilitada")
    ) {
      return;
    }
    agregarClase($cartaClickeada, "destapada");

    if (!hayUnaTarjetaDestapada) {
      cartaDestapada.nombre = nombreDeLaCarta;
      cartaDestapada.numero = numeroDeLaCarta;
      cartaDestapada.elemento = $cartaClickeada;
      agregarClase($cartaClickeada, "deshabilitada");
      hayUnaTarjetaDestapada = true;
      return;
    } else {
      agregarClase($cartaClickeada, "deshabilitada");
      desactivarTablero();
      if (cartaDestapada.nombre === nombreDeLaCarta) {
        parejasEncontradas++;
        mostrarMensaje("#mensaje", "Bien hecho son iguales!!!");
        reiniciarTarjetaDestapada();
        // intentos++;
        // actualizarIntentos(intentos);
        // cantidadDeTarjetas -= 2;
        // if (0 === cantidadDeTarjetas)
        if (parejasEncontradas * 2 === cantidadDeTarjetas) {
          setTimeout(() => {
            mostrarMensaje(
              "#mensaje",
              `Lo conseguiste, GANASTE en ${intentos} intentos!!!`
            );
          }, tiempoEsperaVolteo);
          setTimeout(jugarNuevamente, tiempoEsperaVolteo + 1000);
        } else {
          setTimeout(activarTablero, tiempoEsperaVolteo);
        }
      } else {
        // intentos++;
        // actualizarIntentos(intentos);
        mostrarMensaje("#mensaje", "Mala suerte NO son iguales!!!");
        setTimeout(() => {
          quitarClase($cartaClickeada, "destapada");
          quitarClase($cartaClickeada, "deshabilitada");

          // const $primeraCartaDestapada = document.querySelector(
          //   `.carta[data-numero-de-carta="${cartaDestapada.numero}"]`
          // );

          if (cartaDestapada.elemento) {
            quitarClase(cartaDestapada.elemento, "destapada");
            quitarClase(cartaDestapada.elemento, "deshabilitada");
          }
          activarTablero();
          reiniciarTarjetaDestapada();
        }, tiempoEsperaVolteo);
      }
      intentos++;
      actualizarIntentos(intentos);
    }
  });
});
