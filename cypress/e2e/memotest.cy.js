describe('Inicio del juego', () => {
  beforeEach(() => {
    cy.visit("http://localhost:81");
  })

  it("deberia verificar que el tablero existe", () => {
    cy.getByData('tablero').should('exist');
  })

  it('Verifica que el juego carga y el boton de inicio funciona', () => {
    cy.getByData("iniciar-btn").click();
    cy.getByData("tablero").should('not.have.class', 'desactivado');
  })
})
