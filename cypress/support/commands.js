
// See: https://on.cypress.io/custom-commands

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('alpine', (html, callback) => {
	cy.visit(`${ __dirname }/../shell.html`);
	
	cy.get('#test-root').then(([el]) => {
		el.innerHTML = html;
	});
	
	cy.window().then(window => {
		callback(cy, window, window.document);
	});
});
