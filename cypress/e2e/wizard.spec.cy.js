describe('x-wizard', () => {
	it('progresses through steps', () => {
		cy.visit(`${ __dirname }/wizard.html`);
		
		// Initial state
		cy.get('#back-button').should('be.disabled');
		cy.get('#forward-button').should('not.be.disabled');
		cy.get('#intro-step').should('be.visible');
		cy.get('#age-step').should('not.be.visible');
		cy.get('#coppa-step').should('not.be.visible');
		cy.get('#name-step').should('not.be.visible');
		
		// Forward from intro
		cy.get('#forward-button').click();
		cy.get('#back-button').should('not.be.disabled');
		cy.get('#intro-step').should('not.be.visible');
		cy.get('#age-step').should('be.visible');
		cy.get('#coppa-step').should('not.be.visible');
		cy.get('#name-step').should('not.be.visible');
		cy.get('#forward-button').should('be.disabled');
		
		// Enter age > 13
		cy.get('#age-input').type('14');
		cy.get('#forward-button').should('not.be.disabled').click();
		cy.get('#back-button').should('not.be.disabled');
		cy.get('#intro-step').should('not.be.visible');
		cy.get('#age-step').should('not.be.visible');
		cy.get('#coppa-step').should('not.be.visible');
		cy.get('#name-step').should('be.visible');
		cy.get('#forward-button').should('not.be.visible').should('be.disabled');
		cy.get('#submit-button').should('be.visible').should('be.disabled');
		
		// Enter name
		cy.get('#name-input').type('Chris');
		cy.get('#back-button').should('be.visible').should('not.be.disabled');
		cy.get('#forward-button').should('not.be.visible').should('be.disabled');
		cy.get('#submit-button').should('be.visible').should('not.be.disabled');
		
		// Go back to age
		cy.get('#back-button').should('be.visible').should('not.be.disabled').click();
		cy.get('#back-button').should('be.visible').should('not.be.disabled');
		cy.get('#intro-step').should('not.be.visible');
		cy.get('#age-step').should('be.visible');
		cy.get('#coppa-step').should('not.be.visible');
		cy.get('#name-step').should('not.be.visible');
		
		// Enter age < 13
		cy.get('#age-input').type('{backspace}2');
		cy.get('#forward-button').should('not.be.disabled').click();
		cy.get('#intro-step').should('not.be.visible');
		cy.get('#age-step').should('not.be.visible');
		cy.get('#coppa-step').should('be.visible');
		cy.get('#name-step').should('not.be.visible');
		cy.get('#back-button').should('be.visible').should('not.be.disabled');
		cy.get('#forward-button').should('be.visible').should('be.disabled');
		
		// Check COPPA box
		cy.get('#coppa-input').click();
		cy.get('#back-button').should('be.visible').should('not.be.disabled');
		cy.get('#forward-button').should('be.visible').should('not.be.disabled').click();
		
		// Should be at end
		cy.get('#back-button').should('not.be.disabled');
		cy.get('#intro-step').should('not.be.visible');
		cy.get('#age-step').should('not.be.visible');
		cy.get('#coppa-step').should('not.be.visible');
		cy.get('#name-step').should('be.visible');
		cy.get('#forward-button').should('not.be.visible').should('be.disabled');
		cy.get('#submit-button').should('be.visible').should('not.be.disabled');
	});
});
