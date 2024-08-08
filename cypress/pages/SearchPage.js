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
 landingSearchButton = '//button[@data-test="LandingSearchButton"]';
 acceptButton = '//button[@data-test="CookiesPopup-Accept"]';

  visitSearchPage() {
  cy.visit("/");
  }
  
  acceptModals() {
  cy.on('window:alert',()=>{true});
  cy.get('body').then((body) =>{

if(body.find('section#cookie_consent').length) {

  cy.xpath(this.acceptButton)
  .should('be.visible')
  .click({ force: true }); 
  cy.wait(1000); 
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
  .type(departure)
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
      cy.wrap(cards).find('div[data-test="PlacePickerInputPlace-close"]').click();
        cy.xpath(this.outOfSearchScope).click();
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
    cy.wrap(cards).find('div[data-test="PlacePickerInputPlace-close"]').click();
      cy.xpath(this.outOfSearchScope).click();
   }
   else {
    cy.log('Empty')
   }
  })
}

openSearchInTheSameTab () {
   //  to locate the element with href attribute
 cy.xpath(this.searchButton)
 .invoke('attr', 'href')
 .then((url) => {
    // to intercept the window open event
    cy.window().then((win) => {
      cy.stub(win, 'open').callsFake((newUrl) => {
        // to change the location of the current window to the new URL     
        win.location.href = newUrl;
      });

      //  to use the extracted URL to open it in the same window
      win.location.href = url;
    });
  });
}

openDatePicker () {
 //For departure date
 cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]').scrollIntoView() // scroll the element into view
 cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]').should('be.visible');
 cy.contains('Book cheap flights other sites simply can’t find')
   .should('be.visible'); // for checking that page is stable ...because on this poit it fails !!!!!!!!
 
 cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]', { timeout: 10000 }).should('exist');
 cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]', { timeout: 10000 }).click({ force: true });
 cy.xpath('//div[@data-test="NewDatePickerOpen"]').should('be.visible');
}

addDepartureDate (depDay, depMonth, depYear) {
let nextMonthButton = cy.xpath(`//button[@data-test='CalendarMoveNextButton']`);

//Click into departure date input
cy.xpath('(//div[@data-test="DateValue"])[1]').scrollIntoView().click({force:true})

cy.xpath(`(//div[@data-test="NewDatePickerOpen"] //button[@data-test='DatepickerMonthButton'])[1]`).then((text) => {
  let actualDate = text.text();
  let correctDepMonth = false;

  if (actualDate.includes(depMonth) && actualDate.includes(depYear)) {
    cy.xpath(`(//div[@data-test="CalendarContainer"])[1] //div[@data-test="DayDateTypography"][text()='${depDay}']`).should('be.visible').click();
  } else {
    const checkMonthAndClick = (index) => {
      if (index > 11 || correctDepMonth) return;
      cy.xpath(`(//div[@data-test="NewDatePickerOpen"] //button[@data-test='DatepickerMonthButton'])[1]`).then((text) => {
        actualDate = text.text();
        if (actualDate.includes(depMonth) && actualDate.includes(depYear)) {
          correctDepMonth = true;
          cy.xpath(`(//div[@data-test="CalendarContainer"])[1] //div[@data-test="DayDateTypography"][text()='${depDay}']`)
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
        } else {
          nextMonthButton.click();
          cy.wait(1000);
          checkMonthAndClick(index + 1);
        }
      });
    };
    checkMonthAndClick(0);
  }
});
}

addArrivalDate (arrDay, arrMonth, arrYear) {
  let nextMonthButton = cy.xpath(`//button[@data-test='CalendarMoveNextButton']`);
//Click into arrival date input
cy.xpath('(//div[@data-test="DateValue"])[2]').scrollIntoView().click({force:true})

 //For arrival date
 cy.xpath(`(//div[@data-test="NewDatePickerOpen"] //button[@data-test='DatepickerMonthButton'])[1]`).then((text) => {
  let actualDate = text.text();
  let correctArrMonth = false;
  if (actualDate.includes(arrMonth) && actualDate.includes(arrYear)) {
    cy.xpath(`(//div[@data-test="CalendarContainer"])[1] //div[@data-test="DayDateTypography"][text()='${arrDay}']`).should('be.visible').click();
  } else {
    const checkMonthAndClick = (index) => {
      if (index > 11 || correctArrMonth) return;
      cy.xpath(`(//div[@data-test="NewDatePickerOpen"] //button[@data-test='DatepickerMonthButton'])[1]`).then((text) => {
        actualDate = text.text();
        if (actualDate.includes(arrMonth) && actualDate.includes(arrYear)) {
          correctArrMonth = true;
          cy.xpath(`(//div[@data-test="CalendarContainer"])[1] //div[@data-test="DayDateTypography"][text()='${arrDay}']`)
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
        } else {
          nextMonthButton.click();
          cy.wait(1000);
          checkMonthAndClick(index + 1);
        }
      });
    };
    checkMonthAndClick(0);
  }
});

}

getCorrectMonth (month) {
  let nameOfTheMonth;
  const monthArr = [{num:1, name: 'Januar', abbr:'Jan'}, 
                    {num:2, name:'Februar', abbr: 'Feb'},
                    {num:3, name:'March', abbr:'Mar'},
                    {num:4, name:'April',abbr:'Apr'}, 
                    {num:5, name: 'May', abbr: 'May'}, 
                    {num:6, name: 'June', abbr: 'Jun'}, 
                    {num:7, name:'Juli', abbr: 'Jul'},
                    {num:8, name: 'August', abbr:'Aug'},
                    {num:9, name: 'September', abbr:'Sept'},
                    {num:10, name: 'October', abbr: 'Oct'},
                    {num:11, name: 'Novermber', abbr: 'Nov'},
                    {num:12, name:'December', abbr: 'Dec'}
                  ]

      monthArr.forEach((item)=>{
        if (month === item.num) {
          nameOfTheMonth = item
        }
      })
      return nameOfTheMonth
}}

export const MainSearch = new SearchPage();
