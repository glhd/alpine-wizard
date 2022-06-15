describe('validatorjs integration', () => {
	it('it uses validatorjs when present', () => {
		cy.visit(`${__dirname}/validation.html`);
		
		// Should be incomplete to start
		cy.get('#status').contains('Incomplete');
		
		// First letter should not match "min:2" rule
		cy.get('#name').type('C');
		cy.get('#status').contains('Incomplete');
		
		// Second letter will match rule
		cy.get('#name').type('M');
		cy.get('#status').contains('Complete');
	});
	
	it('it throws an error on .rules if validatorjs is not present', (done) => {
		cy.on('uncaught:exception', (err, runnable) => {
			expect(err.message).to.include('The "validatorjs" package is required');
			done();
			return false;
		});
		
		cy.visit(`${ __dirname }/missing-validation.html`);
	});
});
