/// <reference types="cypress" />

context('Cart Actions', () => {
    beforeEach(() => {
      cy.visit('/');
    })

    it('Purchase items', () => {

        // Add items to the cart
        cy.get('[data-cy=add-to-cart-1]').click();
        cy.get('[data-cy=add-to-cart-2]').click();

        // Purchase the items
        cy.get('[data-cy=cart-button').click();
        cy.get('[data-cy=purchase-items').click();

        // Check the items have been purchased
        cy.get('[data-cy=badge-count]').should('have.text', '0');
        cy.get('[data-cy=recent-purchases]').click();
    })
  
  })