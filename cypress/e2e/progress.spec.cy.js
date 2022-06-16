describe('progress helper', () => {
	it('it computes progress as expected', () => {
		cy.visit(`${__dirname}/progress.html`);
		
		const back = () => cy.get('#back-button').click();
		const forward = () => cy.get('#forward-button').click();
		
		const expectProgress = (total, complete, incomplete, percentage) => {
			cy.get(`#total`).contains(`${total}`);
			cy.get(`#complete`).contains(`${complete}`);
			cy.get(`#incomplete`).contains(`${incomplete}`);
			cy.get(`#percentage`).contains(`${percentage}`);
		}
		
		// Start
		expectProgress(3, 0, 3, '0%');
		
		cy.get('#checked-input').click();
		expectProgress(3, 1, 2, '33%');
		
		// Progress to end
		forward();
		expectProgress(3, 2, 1, '66%');
		
		forward();
		expectProgress(3, 3, 0, '100%');
		
		// Go back to beginning
		back()
		expectProgress(3, 2, 1, '66%');
		
		back()
		expectProgress(3, 1, 2, '33%');
		
		cy.get('#checked-input').click();
		expectProgress(3, 0, 3, '0%');
		
		// Progress to end a second time
		cy.get('#checked-input').click();
		expectProgress(3, 1, 2, '33%');
		
		forward();
		expectProgress(3, 2, 1, '66%');
		
		forward();
		expectProgress(3, 3, 0, '100%');
	});
});
