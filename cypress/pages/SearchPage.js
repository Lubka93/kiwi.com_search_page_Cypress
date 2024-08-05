class SearchPage {
  //Departure
 placePickerInput_origin = `//div[@data-test="PlacePickerInput-origin"]`;
 pickerCloseButton = '//div[@data-test="PlacePickerInput-origin"]//div[@data-test="PlacePickerInputPlace-close"]';
 searchFieldDepInput = "(//div[@class='relative']//input[@data-test='SearchField-input'])[1]";
 departureAirport = 'VIE Vienna International Airport';
 addDepartureItem = `//div[@data-test="PlacepickerModalOpened-origin"] //div[text()='${this.departureAirport}']`;
 deaparturePicker = '//div[@data-test="PlacePickerInput-origin"] //div[@data-test="PlacePickerInputPlace"]';

 //Arrival
 placePickerInput_destination = '//div[@data-test="PlacePickerInput-destination"]';
 pickerClaseButton = '//div[@data-test="PlacePickerInput-destination"] //div[@data-test="PlacePickerInputPlace-close"]';
 searchFieldArrInput = "(//div[@class='relative'] //input[@data-test='SearchField-input'])[2]";
 arrivalAirport = 'OPO Porto';
 arrivalPicker ='//div[@data-test="PlacePickerInputPlace"]';
 addArrivalItem = `//div[@data-test="PlacepickerModalOpened-destination"] //div [text()='${this.arrivalAirport}']`;


 //Main
 outOfSearchScope = `//div[@data-test="Footer-Claim"]`;
 searchButton = '//a[@data-test="LandingSearchButton"]';
 acceptButton = '//button[@data-test="CookiesPopup-Accept"]';


  visitSearchPage() {
    cy.visit("/");
  }
  
  acceptModals() {

  if (cy.get('section#cookie_consent')) { 
  cy.on('window:confirm', () => true); // Intercept and accept alerts
  cy.xpath(this.acceptButton)
  .should('be.visible')
  .click({ force: true }); // Click on the accept button, force click if necessary

cy.wait(1000); // I can adjust the wait time 
 }
 }


 clearAllData(){
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();
 }
 
 addDeparture (departure) {
  cy.xpath(this.placePickerInput_origin).then((parent) => {
    // Check if the parent element has more than 2 children
    cy.wrap(parent).children().then((children) => {
      if (children.length <= 2) {
        cy.log('empty');
        cy.log(children.length);
      } else {
        // If there is more children
        cy.xpath(this.pickerCloseButton).then((elements) => {
          if (elements.length) {
            cy.wrap(elements).each((element) => {
              cy.wrap(element).click();
              cy.log('not empty');
            })}
        })}
    })
  });
   cy.xpath(this.searchFieldDepInput).type(departure);
   cy.xpath(this.addDepartureItem).click();
   cy.xpath(this.searchFieldDepInput).clear();
   cy.xpath(this.outOfSearchScope).click();
 
 }


 addArrival(arrival) {
  cy.xpath(this.placePickerInput_destination).then((parent) => {
    // Check if the parent element has more that 2 children
    cy.wrap(parent).children().then((children) => {
      if (children.length === 2) {
        cy.log('empty');
        cy.log(children.length)
     
      } else {
        // If there is more than 2 children
        cy.xpath(this.pickerClaseButton).then((elements) => {
          if (elements.length) {
            cy.wrap(elements).each((element) => {
              cy.wrap(element).click();
              cy.log('not empty');
            })}
        })}
    });
  });
  cy.xpath(this.searchFieldArrInput).type(arrival);
  cy.xpath(this.addArrivalItem).should('be.visible').click();
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
