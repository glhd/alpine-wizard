import wizard from '../src/wizard.js';

document.addEventListener('alpine:init', () => {
	if (window.Validator) {
		wizard.setValidator(window.Validator);
	}
	
	window.Alpine.plugin(wizard);
});
