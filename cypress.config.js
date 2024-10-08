const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

async function setupNodeEvents(on, config) {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await preprocessor.addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin.default(config)],
    })
  );
  allureWriter(on, config);

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

module.exports = defineConfig({
  retries: {            // for flaky tests .. based on the run/open mode it will GLOBALLY try to run test 2 or 3 times
    runMode: 0,
    openMode: 0,
  },
  e2e: {
    setupNodeEvents,
    specPattern: "cypress/e2e/features/*.feature",
    baseUrl: "https://www.kiwi.com/en",
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
  //  testIsolation: false,
    env: {
      allureReuseAfterSpec: true,
     // viewportWidth: 1200,
      //viewportHeight: 700
    },
  },
  video:true,
  screenshotOnRunFailure:true,
  projectId: "dids8c",
  reporter: "cypress-mochawesome-reporter",
  reporterOptions:{
    charts: true, 
    reportPageTitle: 'Kiwi search feature tests',
  }
});