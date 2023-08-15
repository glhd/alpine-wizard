class AlpineWizardStep {
	/** @type {HTMLElement} */ el;
	/** @type {string} */ title;
	/** @type {boolean} */ is_applicable;
	/** @type {boolean} */ is_complete;
}

class AlpineWizardProgress {
	/** @type {number} */ current;
	/** @type {number} */ total;
	/** @type {number} */ complete;
	/** @type {number} */ incomplete;
	/** @type {string} */ percentage;
	/** @type {number} */ percentage_int;
	/** @type {number} */ percentage_float;
}

class AlpineWizardMagic {
	/** @returns {AlpineWizardStep} */ current() {}
	/** @returns {AlpineWizardStep|null} */ next() {}
	/** @returns {AlpineWizardStep|null} */ previous() {}
	/** @returns {AlpineWizardProgress} */ progress() {}
	/** @returns {boolean} */ isFirst() {}
	/** @returns {boolean} */ isNotFirst() {}
	/** @returns {boolean} */ isLast() {}
	/** @returns {boolean} */ isNotLast() {}
	/** @returns {boolean} */ isComplete() {}
	/** @returns {boolean} */ isNotComplete() {}
	/** @returns {boolean} */ isIncomplete() {}
	/** @returns {boolean} */ canGoForward() {}
	/** @returns {boolean} */ cannotGoForward() {}
	/** @returns {boolean} */ canGoBack() {}
	/** @returns {boolean} */ cannotGoBack() {}
	/** @returns {void} */ forward() {}
	/** @returns {void} */ back() {}
}

/**
 * @global 
 * @type {AlpineWizardMagic} 
 */
var $wizard;
