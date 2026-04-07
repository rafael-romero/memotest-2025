describe("Memotest de Pokemon", () => {
  beforeEach(() => {
    cy.visit("http://localhost:81");
    });
  
  describe("Configuracion inicial", () => {
    it("deberia verificar que el tablero existe y esta desactivado", () => {
      cy.getByData("tablero").should("exist").and("have.class", "desactivado");
    });
  });

  describe("Interaccion del juego", () => {
    beforeEach(() => {
      cy.getByData("iniciar-btn").click();
    });

    it("deberia verificar que el tablero ya este activado", () => {
      cy.getByData("tablero").should("not.have.class", "desactivado");
    });

    it("deberia mostrar un mensaje de exito al encontrar una pareja y sumar un intento", () => {
      cy.getByData("texto-intentos").should("contain", "0");
      cy.getCard("pikachu").eq(0).click();
      cy.getCard("pikachu").eq(1).click();
      cy.getByData("texto-intentos").should("contain", "1");
      cy.contains("Bien hecho son iguales!!!").should("be.visible");
      cy.getCard("pikachu")
        .should("have.length", 2)
        .and("have.class", "deshabilitada")
        .and("have.class", "destapada");
    });

    it("deberia volver a tapar las cartas si no son parejas y mostrar un mensaje de fallo, tambien sumar un intento", () => {
      cy.getByData("texto-intentos").should("contain", "0");
      cy.getCard("pikachu").first().click();
      cy.getCard("charmander").first().click();
      cy.getByData("texto-intentos").should("contain", "1");
      cy.contains("Mala suerte NO son iguales!!!").should("be.visible");

      cy.getCard("pikachu").first().should("have.class", "destapada");
      cy.getCard("charmander").first().should("have.class", "destapada");

      cy.getCard("pikachu")
        .first()
        .should("not.have.class", "destapada", { timeout: 2000 });
      cy.getCard("charmander")
        .first()
        .should("not.have.class", "destapada", { timeout: 2000 });

      cy.contains("Mala suerte NO son iguales!!!").should("not.exist");
    });

    it("deberia resolver el juego al encontrar todas las parejas, mostrar el estado final de victoria y el boton de jugar de nuevo", () => {
      cy.get("[data-carta]").then(($cartas) => {
        const parejas = {};
        $cartas.each((index, carta) => {
          const pokemon = carta.getAttribute("data-carta");
          if (!parejas[pokemon]) {
            parejas[pokemon] = [];
          }
          parejas[pokemon].push(index);
        });
        Object.keys(parejas).forEach((pokemon) => {
          const [indice1, indice2] = parejas[pokemon];

          cy.get("[data-carta]").eq(indice1).click();
          cy.get("[data-carta]").eq(indice2).click();

          cy.contains("Bien hecho son iguales!!!").should("be.visible");
        });
      });

      cy.contains(/GANASTE en \d+ intentos!!!/i).should("be.visible");
      cy.getByData("iniciar-btn")
        .should("be.visible")
        .and("contain", "Jugamos de nuevo?");
      cy.getByData("texto-intentos").should("not.be.visible");
    });
  });
});

