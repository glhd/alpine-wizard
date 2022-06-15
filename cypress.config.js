const { defineConfig } = require("cypress");

module.exports = defineConfig({
  screenshotOnRunFailure: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
