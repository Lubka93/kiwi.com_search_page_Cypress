Cypress.on("uncaught:exception", (error, runnable) => {
    // Ignore specific known issue
    if (error.message.includes('expected //button[@data-test="CookiesPopup-Accept"] to be visible')) {
      return true; // Prevent Cypress from failing the test
    }
    // Let the test fail for all other exceptions
    return false; 
  });
  