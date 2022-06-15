# Alpine Wizard

[![Tests](https://github.com/glhd/alpine-wizard/actions/workflows/tests.yml/badge.svg)](https://github.com/glhd/alpine-wizard/actions/workflows/tests.yml)

> Multi-step wizard helpers for Alpine.js

## Installation

### via cdn
```html
<script src="https://unpkg.com/@glhd/alpine-wizard@1/dist/wizard.cdn.min.js"></script>
<script defer src="https://unpkg.com/alpinejs@3/dist/cdn.min.js"></script>
```

### via npm
```shell
npm install @glhd/alpine-wizard
```

### via yarn
```shell
yarn add @glhd/alpine-wizard
```

## Usage

```html
<!-- This is the data our wizard will work with. It's just plain Alpine. -->
<form x-data="{ name: '', age: 0, coppa: false }">
    
    <!-- Add steps with x-wizard:step -->
    <div x-wizard:step>
        Welcome! This step has no requirements, so we can continue
        immediately. This is useful for things like introductions.
    </div>
    
    <!-- Steps can have logic about when they're complete. In this -->
    <!-- case, you must have entered a value for "name" to continue. -->
    <div x-wizard:step="name.trim() !== ''">
        Your name: <input x-model="name" name="name" />
    </div>
	
    <!-- Here's another step that has logic about when it's complete -->
	<div x-wizard:step="age > 0">
		Your age: <input x-model="age" name="age" />
	</div>
	
    <!-- Steps can also have logic about when they apply. In this -->
    <!-- case, this step is only shown if the person is under 13. -->
	<div x-wizard:if="age < 13" x-wizard:step="coppa === true">
		<label>
			<input type="checkbox" x-model="coppa" />
			I have my parent or guardian's consent
		</label>
    </div>
	
    <!-- We also expose a $wizard magic that gives lots of helper -->
    <!-- functionality. Here we have the logic for a continue button -->
	<button
		@click="$wizard.forward()"
		:disabled="$wizard.cannotGoForward()"
		x-show="$wizard.isNotLast()"
	>
        Continue
    </button>
	
    <!-- And here's a "submit" button when they get to the end. -->
	<button
		:disabled="$wizard.isNotComplete()"
		x-show="$wizard.isLast()"
	>
        Submit
    </button>
    
</form>
```
