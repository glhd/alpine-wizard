const wizards = new WeakMap();
let Validator = null;

const wizard = (Alpine) => {
	Alpine.directive('wizard', (el, { value, expression, modifiers }, { Alpine, evaluate, cleanup }) => {
		const wizard = getWizard(el, Alpine);
		const step = wizard.getStep(el);
		
		// Register cleanup function
		cleanup(() => step.cleanup());
		
		// Helper to check expression either as plain JS or validation rules
		const evaluateCheck = () => modifiers.includes('rules')
			? evaluateAsRules(Alpine.$data(el), expression, evaluate)
			: [!!evaluate(expression), {}];
		
		Alpine.effect(() => {
			// x-wizard:step
			if ('' !== expression && 'step' === value) {
				const [passes, errors] = evaluateCheck();
				step.is_complete = passes;
				step.errors = errors;
			}
			
			// x-wizard:if
			if ('if' === value) {
				step.is_applicable = evaluateCheck()[0]; // We won't track errors for "if"
			}
			
			// x-wizard:title
			if ('title' === value) {
				if (modifiers.includes('dynamic')) {
					step.title = `${ evaluate(expression) }`;
				} else {
					step.title = expression;
				}
			}
		});
	});
	
	Alpine.magic('wizard', (el, { Alpine }) => {
		return getWizard(el, Alpine);
	});
};

wizard.setValidator = (implementation) => {
	Validator = implementation;
};

const evaluateAsRules = ($data, expression, evaluate) => {
	if (null === Validator) {
		throw 'The "validatorjs" package is required to use the ".rules" modifier. See <https://github.com/mikeerickson/validatorjs>';
	}
	
	// Reactive proxies cause problems with validation, so we need to build our own object
	const data = Object.getOwnPropertyNames($data)
		.reduce((data, key) => ({ ...data, [key]: $data[key] }), {});
	
	const validator = new Validator(data, evaluate(expression));
	
	return [validator.passes(), validator.errors.all()];
};

const getWizard = (el, Alpine) => {
	const root = Alpine.closestRoot(el);
	
	if (!wizards.has(root)) {
		wizards.set(root, initWizardRoot(Alpine));
	}
	
	return wizards.get(root);
};

const initWizardRoot = (Alpine) => {
	return Alpine.reactive({
		steps: [],
		current_index: 0,
		current() {
			return this.steps[this.current_index] || { el: null, title: null };
		},
		next() {
			return this.steps[this.nextIndex()] || { el: null, title: null };
		},
		previous() {
			return this.steps[this.previousIndex()] || { el: null, title: null };
		},
		previousIndex() {
			return findNextIndex(this.steps, this.current_index, -1);
		},
		nextIndex() {
			return findNextIndex(this.steps, this.current_index, 1);
		},
		isFirst() {
			return null === this.previousIndex();
		},
		isNotFirst() {
			return !this.isFirst();
		},
		isLast() {
			return null === this.nextIndex();
		},
		isNotLast() {
			return !this.isLast();
		},
		isComplete() {
			return this.current().is_complete
				&& null === this.nextIndex();
		},
		isNotComplete() {
			return !this.isComplete();
		},
		canGoForward() {
			return this.current().is_complete
				&& null !== this.nextIndex();
		},
		cannotGoForward() {
			return !this.canGoForward();
		},
		forward() {
			this.goto(this.nextIndex());
		},
		canGoBack() {
			return null !== this.previousIndex();
		},
		cannotGoBack() {
			return !this.canGoBack();
		},
		back() {
			this.goto(this.previousIndex());
		},
		goto(index) {
			if (null !== index && undefined !== this.steps[index]) {
				this.current_index = index;
			}
			
			return this.current();
		},
		getStep(el) {
			let step = this.steps.find((step) => step.el === el);
			
			if (!step) {
				// Enable the step visibility logic
				el.setAttribute('x-show', '$wizard.current().el === $el');
				
				step = Alpine.reactive({
					el,
					title: '',
					is_applicable: true,
					is_complete: true,
					errors: {},
					cleanup: () => {
						this.steps = this.steps.filter(step => step.el === el);
					},
				});
				
				this.steps.push(step);
			}
			
			return step;
		},
	});
};

const findNextIndex = (steps, current, direction = 1) => {
	for (let index = current + direction; index >= 0 && index < steps.length; index += direction) {
		if (steps[index] && steps[index].is_applicable) {
			return index;
		}
	}
	
	return null;
};

export default wizard;
