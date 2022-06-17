describe('progress helper', () => {
	it('it computes progress as expected', () => {
		cy.visit(`${ __dirname }/progress.html`);
		
		const back = () => cy.get('#back-button').click();
		const forward = () => cy.get('#forward-button').click();
		
		const expectProgress = (
			current, 
			total, 
			complete, 
			incomplete, 
			percentage, 
			percentage_int, 
			percentage_float
		) => Object.entries({ current, total, complete, incomplete, percentage, percentage_int, percentage_float })
				.forEach(([key, expected]) => cy.get(`#${ key }`).contains(`${ expected }`));
		
		// Start
		expectProgress(1, 3, 0, 3, '0%', 0, 0);
		
		cy.get('#checked-input').click();
		expectProgress(1, 3, 1, 2, '33%', 33, 0.33);
		
		// Progress to end
		forward();
		expectProgress(2, 3, 2, 1, '66%', 66, 0.66);
		
		forward();
		expectProgress(3, 3, 3, 0, '100%', 100, 1);
		
		// Go back to beginning
		back();
		expectProgress(2, 3, 2, 1, '66%', 66, 0.66);
		
		back();
		expectProgress(1, 3, 1, 2, '33%', 33, 0.33);
		
		cy.get('#checked-input').click();
		expectProgress(1, 3, 0, 3, '0%', 0, 0);
		
		// Progress to end a second time
		cy.get('#checked-input').click();
		expectProgress(1, 3, 1, 2, '33%', 33, 0.33);
		
		forward();
		expectProgress(2, 3, 2, 1, '66%', 66, 0.66);
		
		forward();
		expectProgress(3, 3, 3, 0, '100%', 100, 1);
	});
});
