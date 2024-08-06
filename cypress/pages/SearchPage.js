class SearchPage {
  //Departure
 placePickerInput_origin = `//div[@data-test="PlacePickerInput-origin"]`;
 pickerCloseButton = '//div[@data-test="PlacePickerInput-origin"]//div[@data-test="PlacePickerInputPlace-close"]';
 searchFieldDepInput = "(//div[@class='relative']//input[@data-test='SearchField-input'])[1]";
 deaparturePicker = '//div[@data-test="PlacePickerInput-origin"]//div[@data-test="PlacePickerInputPlace"]';

 //Arrival
 placePickerInput_destination = '//div[@data-test="PlacePickerInput-destination"]';
 pickerClaseButton = '//div[@data-test="PlacePickerInput-destination"] //div[@data-test="PlacePickerInputPlace-close"]';
 searchFieldArrInput = "(//div[@class='relative'] //input[@data-test='SearchField-input'])[2]";
 arrivalPicker ='//div[@data-test="PlacePickerInputPlace"]';
 


 //Main
 outOfSearchScope = `//div[@data-test="Footer-Claim"]`;
 searchButton = '//a[@data-test="LandingSearchButton"]';
 acceptButton = '//button[@data-test="CookiesPopup-Accept"]';

 


  visitSearchPage() {
    cy.visit("/");
  }
  
  acceptModals() {
    cy.on('window:alert',()=>{true});
cy.get('body').then((body) =>{
  //cy.log(body.find('section#cookie_consent').length > 0);
if(body.find('section#cookie_consent').length) {

  cy.xpath(this.acceptButton)
  .should('be.visible')
  .click({ force: true }); // Click on the accept button, force click if necessary
  cy.wait(1000); // I can adjust the wait time 
}
})
 }

 clearAllData(){
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();
 }
 
 addDeparture (departure, name) {
    let addDepartureItem = `//div[@data-test="PlacepickerModalOpened-origin"]//div[text()='${name}']`;
    
  cy.xpath(this.searchFieldDepInput)
  .type(departure) // Adding a delay to simulate user typing
  .should('have.value', departure);

  cy.xpath(addDepartureItem).should('exist').should('be.visible').click();
   cy.xpath(this.searchFieldDepInput).clear();
   cy.xpath(this.outOfSearchScope).click();
  
 }


 addArrival(arrival, name) {
  let addArrivalItem = `//div[@data-test="PlacepickerModalOpened-destination"]//div[text()="${name}"]`;
  cy.xpath(this.searchFieldArrInput)
  .type(arrival)
  .should('have.value', arrival);

  cy.xpath(this.searchFieldArrInput).click();
  cy.xpath(addArrivalItem).should('exist');
  cy.xpath(addArrivalItem).should('be.visible').click();
  cy.xpath(this.searchFieldArrInput).clear();
 }



 clearDepartureInput() {
    cy.get("div[data-test='PlacePickerInput-origin']").scrollIntoView().children()
    .then((cards)=>{
     if(cards.length > 2) {
      cy.log(cards.length)
      cy.wrap(cards).find('div[data-test="PlacePickerInputPlace-close"]').click();
        cy.xpath(this.outOfSearchScope).click();
        cy.log('click')
     }
     else {
      cy.log('Empty')
     }
    })
 }

 clearArrivalInput() {
  cy.get('div[data-test="PlacePickerInput-destination"]').scrollIntoView().children()
  .then((cards)=>{
   if(cards.length > 2) {
    cy.log(cards.length)
    cy.wrap(cards).find('div[data-test="PlacePickerInputPlace-close"]').click();
      cy.xpath(this.outOfSearchScope).click();
      cy.log('click')
   }
   else {
    cy.log('Empty')
   }
  })
}

openSearchInTheSameTab () {
   // Step 1: Locate the element and get the href attribute
 cy.xpath(this.searchButton)
 .invoke('attr', 'href')
 .then((url) => {
    // Step 2: Intercept the window open event
    cy.window().then((win) => {
      cy.stub(win, 'open').callsFake((newUrl) => {
        // Change the location of the current window to the new URL     
        win.location.href = newUrl;
      });

      // Step 3: Use the extracted URL to open it in the same window
      win.location.href = url;
    });
  });
}


}

export const MainSearch = new SearchPage();
