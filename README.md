# Alpine Wizard

[![Tests](https://github.com/glhd/alpine-wizard/actions/workflows/tests.yml/badge.svg)](https://github.com/glhd/alpine-wizard/actions/workflows/tests.yml)
[![npm version](https://badge.fury.io/js/@glhd%2Falpine-wizard.svg)](https://www.npmjs.com/package/@glhd/alpine-wizard)

This package provides an Alpine directive (`x-wizard`) and a magic helper (`$wizard`) that
allow you to quickly build multi-step wizards using Alpine.js (only 1.1 kB gzipped).

  - [Installation](#installation)
  - [Usage](#usage)
  - [Using Validation Rules](#validation-rules)
  - [API](#api)

![x-wizard-github](https://user-images.githubusercontent.com/21592/174309614-a7604beb-b4ca-4add-a468-28f8fcc4a48b.gif)

## Installation

### via cdn
```html
<script defer src="https://unpkg.com/@glhd/alpine-wizard@1/dist/wizard.cdn.min.js"></script>
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
	
	<!-- Steps can have logic about when they're complete. In this
	     case, you must have entered a value for "name" to continue. -->
	<div x-wizard:step="name.trim() !== ''">
		Your name: <input x-model="name" name="name" />
	</div>
	
	<!-- Here's another step that has logic about when it's complete -->
	<div x-wizard:step="age > 0">
		Your age: <input x-model="age" name="age" />
	</div>
	
	<!-- Steps can also have logic about when they apply. In this
	     case, this step is only shown if the person is under 13. -->
	<div x-wizard:if="age < 13" x-wizard:step="coppa === true">
		<label>
			<input type="checkbox" x-model="coppa" />
			I have my parent or guardian's consent
		</label>
	</div>
	
	<!-- We also expose a $wizard magic that gives lots of helper
	     functionality. Here we have the logic for a continue button -->
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
[![Try it out](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/zealous-sun-8xoswh?fontsize=14&hidenavigation=1&theme=dark)

## Validation Rules

The wizard also supports Laravel-style validation rules via the [`validatorjs`](https://github.com/mikeerickson/validatorjs)
package. If you're using the CDN version of the script, be sure to add the Validator package to the page before the
wizard plugin (if you're installing via npm or yarn this functionality is available by default):

```html
<script defer src="https://unpkg.com/validatorjs@3/src/validator.js"></script>
```

This plugin allows you to add a `.rules` modifier to steps:

```html
<div x-wizard:step.rules="{ age: 'required|numeric|min:1|max:120' }">
    Your age: <input x-model="age" name="age" />
</div>
```

See the [`validatorjs` documentation](https://github.com/mikeerickson/validatorjs) for a list of all
supported rules and how to configure them.

## API

### Alpine Directives

#### x-wizard:step

Use `x-wizard:step` to define each wizard step. This directive optionally accepts
a javascript expression which must return a truthy value before the step is considered
complete.

#### x-wizard:if

Use `x-wizard:if` to make a step conditional. Any steps that have `x-wizard:if` will
only show if the expression passed to the directive returns a truthy value.

#### x-wizard:title

Use `x-wizard:title` to set the step title. This is useful if you want to present the
title of the current step elsewhere in your UI. By default, this is just a plain
string, but you can generate the title dynamically by using the `.dynamic` modifier.

### Alpine Magics

#### $wizard

The `$wizard` magic provides access to the state of your current wizard. It provides
a number of useful helper functions:

  - `current()` — get the current wizard step
  - `next()` — get the next wizard step (or null if at end)
  - `previous()` — get the previous wizard step (or null if at beginning)
  - `progress()` — get current progress, a JS object:
    - `current` — the current step number (as of 1.2.0)
    - `total` — the total number of applicable steps
    - `complete` — the number of completed steps
    - `incomplete` — the number of steps still to complete
    - `percentage` — the percent complete, as a string (i.e. `"33%"`)
    - `percentage_int` — the percent complete, as an integer (i.e. `33`) (as of 1.2.0)
    - `percentage_float` — the percent complete, as an float (i.e. `0.33`) (as of 1.2.0)
  - `isFirst()` — check if we're currently on the first step
  - `isNotFirst()` — check if we're NOT currently on the first step
  - `isLast()` — check if we're on the last step
  - `isNotLast()` — check if we're NOT on the last step
  - `isComplete()` — check if we're on the last step and all steps are complete
  - `isNotComplete()`/`isIncomplete()` — check if we're not on the last step or all steps aren't complete
  - `canGoForward()` — check if we can move to the next step
  - `cannotGoForward()` — check if we CANNOT move to the next step
  - `forward()` — move to the next step if possible
  - `canGoBack()` — check if we can go to the previous step
  - `cannotGoBack()` — check if we CANNOT go to the previous step
  - `back()` — move to the previous step if possible

Each step is a plain javascript object with a few properties:

  - `el` — the DOM element associated with the step
  - `title` — the title of the step
  - `is_applicable` — whether this step applies given the current data
  - `is_complete` — whether this step is complete
