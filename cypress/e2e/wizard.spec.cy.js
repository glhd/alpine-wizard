describe('x-wizard', () => {
	it('progresses through steps', () => {
		const html = `
			<div x-data="{ name: '', age: 0, coppa: false }">
				<div x-wizard:step id="intro-step">
					Introduction
				</div>
				<div x-wizard:step="age > 0" id="age-step">
					Your age: <input id="age-input" x-model.number="age" />
				</div>
				<div x-wizard:if="age < 13" x-wizard:step="coppa === true" id="coppa-step">
					<input type="checkbox" id="coppa-input" x-model="coppa" />
					Parent or guardian consent
				</div>
				<div x-wizard:step="'' !== name.trim()" id="name-step">
					Your name: <input id="name-input" x-model="name" />
				</div>
				
				<button 
					id="back-button"
					@click="$wizard.back()" 
					:disabled="$wizard.cannotGoBack()"
				>
					Back
				</button>
				<button 
					id="forward-button"
					@click="$wizard.forward()" 
					:disabled="$wizard.cannotGoForward()"
					x-show="$wizard.isNotLast()"
				>
					Forward
				</button>
				<button 
					id="submit-button"
					:disabled="$wizard.isNotComplete()"
					x-show="$wizard.isLast()"
					type="submit"
				>
					Submit
				</button>
			</div>
		`;
		cy.alpine(html, (cy) => {
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
});
