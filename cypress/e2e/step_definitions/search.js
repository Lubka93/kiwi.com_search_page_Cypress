//Imports
import {
  Given,
  When,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";
import {MainSearch} from '@pages/SearchPage';
require('cypress-xpath');
import 'cypress-mochawesome-reporter/cucumberSupport';



//Scenario 1
Given("A web browser is at the main search page", () => {
 
 MainSearch.visitSearchPage();

 MainSearch.acceptModals();

 MainSearch.clearAllData();
//Assertions
 cy.url().should('to.be', 'https://www.kiwi.com/en/');

});

When('A user enters valid {string} airport with name {string}  and {string} airport with name {string}', (departure, depName, arrival, arrName)=>{
  MainSearch.acceptModals();    
  MainSearch.clearDepartureInput();

   //Add departure
   MainSearch.addDeparture(departure, depName);
   cy.xpath(MainSearch.outOfSearchScope).click();

  //Assertions for departure
    cy.xpath(MainSearch.deaparturePicker).then((text)=>{
     expect(text).to.contain(departure)
    })

    MainSearch.clearArrivalInput();

    //Add arrival
    MainSearch.clearArrivalInput()
    MainSearch.addArrival(arrival, arrName);
    cy.xpath(MainSearch.outOfSearchScope).click();

   //Add assertion for arrival
    cy.xpath(MainSearch.arrivalPicker).then((text)=>{
    expect(text).to.contain(arrival)
    })

   //Hitting search button
   cy.xpath('//div[text()="Search"]', {timeout:10000}).scrollIntoView().should('be.visible');

    //Opening the result page in the same tab
    MainSearch.openSearchInTheSameTab();




})

Then('The search button is enabled, page will be redirected and correct airport codes {string} and {string} are displayed', (depCode, arrCode)=>{
//Accept modals
MainSearch.acceptModals();
//Assertions
cy.url().should("contains", `https://www.kiwi.com/en/search/results/`);
cy.xpath("//div[@data-test ='ResultList-results']").should('be.visible').children().first().then((list)=>{
 cy.wrap(list).children('div[data-test]')
 .should('have.length', 10)
 .should('contain', depCode)
 .should('contain', arrCode)
 })
})


//Scenario 2

When("A user enters departure {string} {string}, the arrival {string} {string}, departure date {string} {string} {string} for today, arrival date {string} {string} {string} for next month and clicks on the search button", (departure, depName, arrival, arrName, depDay, depMonth, depYear, arrDay, arrMonth, arrYear) => {
//To set dates
  let today = new Date();
  depDay = today.getDate();
  depMonth = MainSearch.getCorrectMonth(today.getMonth()+1).name;
  depYear = today.getFullYear();
  
  arrDay =  today.getDate();
  arrMonth = MainSearch.getCorrectMonth(today.getMonth()+2).name;
  arrYear = today.getFullYear();

 //For departure
 MainSearch.clearDepartureInput();
 MainSearch.addDeparture(departure, depName);

 //Assertions
 cy.xpath(MainSearch.deaparturePicker).then((text)=>{
   expect(text).to.contain(departure)
    })
 
//For arrival
MainSearch.clearArrivalInput();
   MainSearch.addArrival(arrival, arrName);
   cy.xpath(MainSearch.outOfSearchScope).click();

//Open dates picker
MainSearch.openDatePicker();

//Add departure
MainSearch.addDepartureDate(depDay, depMonth, depYear)

//For arrival date
MainSearch.addArrivalDate(arrDay, arrMonth, arrYear)


//Confirm dates
cy.xpath('//button[@data-test="SearchFormDoneButton"]').should('be.visible').click();


//Click out of scope
cy.xpath(MainSearch.outOfSearchScope).click();
//Hitting search button
 cy.xpath(MainSearch.searchButton).scrollIntoView().should('be.visible');
 
 
 //Opening the result page in the same tab
 MainSearch.openSearchInTheSameTab();


 });
 
Then("The url will contain search subdirectory and have relevant results {string} and {string} for specific departure {string} {string} {string} and arrival {string} {string} {string}", (depCode, arrCode, depDay, depMonth, depYear, arrDay, arrMonth, arrYear) => {
  cy.on('window:confirm', ()=>{return true})
  MainSearch.acceptModals();

  let today = new Date();
depDay = today.getDate();
depMonth = MainSearch.getCorrectMonth(today.getMonth()+1).abbr;

arrDay =  today.getDate();
arrMonth = MainSearch.getCorrectMonth(today.getMonth()+2).abbr;


   //Assertions
   cy.url().should("contains", `https://www.kiwi.com/en/search/results/`);

   cy.xpath("//div[@data-test ='ResultList-results']").children().first().then((list)=>{
    cy.wrap(list).children('[data-test]')
    .should('be.visible')
    .should('have.length', 10)
    .should('contain', depCode)
    .should('contain', arrCode)
    })

 
  cy.xpath('//div[@data-test="QuickNavigationSection"]').first().children().then((list) => {
      cy.wrap(list).children()
          // .should('have.length', 10)
          .should('contain', `${depDay} ${depMonth}`)
          .should('contain', `${arrDay} ${arrMonth}`);
  });
   
   cy.xpath(`//div[text()="${depDay} ${depMonth}" and text()="${arrDay} ${arrMonth}"]`).then((child)=>{
    cy.wrap(child).parent().then((parent)=>{
      cy.wrap(parent).invoke('attr', 'class').then((classAttr)=>{
        expect(classAttr).to.include('border-2')
        expect(classAttr).to.include('border-solid')
        expect(classAttr).to.include('border-blue-normal')
      })
      })
      })
  });

   
   //Scenario 3
   

   When("A user enters no departure, the arrival {string} {string},  departure date {string} {string} {string} for today, arrival date {string} {string} {string} for next month and clicks on the search button", (arrival, arrName, depDay, depMonth, depYear, arrDay, arrMonth, arrYear) => {
    //To set dates
      let today = new Date();
      depDay = today.getDate();
      depMonth = MainSearch.getCorrectMonth(today.getMonth()+1).name;
      depYear = today.getFullYear();
      
      arrDay =  today.getDate();
      arrMonth = MainSearch.getCorrectMonth(today.getMonth()+2).name;
      arrYear = today.getFullYear();
    
     //For departure
     MainSearch.clearDepartureInput();
     
    //For arrival
    MainSearch.clearArrivalInput();
       MainSearch.addArrival(arrival, arrName);
       cy.xpath(MainSearch.outOfSearchScope).click();
    
    //Open dates picker
    MainSearch.openDatePicker();
    
    //Add departure
    MainSearch.addDepartureDate(depDay, depMonth, depYear)
    
    //For arrival date
    MainSearch.addArrivalDate(arrDay, arrMonth, arrYear)
    
    
    //Confirm dates
    cy.xpath('//button[@data-test="SearchFormDoneButton"]').should('be.visible').click();
    
    //Hitting search button
     cy.contains('Search').scrollIntoView().should('be.visible');
    
     });
    
Then("The search button is disabled and result page is not opened", () => {
     
    //Assertions
    cy.url().should("contains", `${Cypress.config('baseUrl')}/`);
      cy.xpath('//button[@data-test="LandingSearchButton"]').then((button)=>{
        cy.wrap(button).invoke('attr', 'class').then((classSearch)=>{
          expect(classSearch).to.include('cursor-not-allowed');
        })
      })
     });
   
     //Scenario 4
     When("A user enters a departure {string} {string}, departure date {string} {string} {string} for today, arrival date {string} {string} {string} for next month and clicks on the search button", (departure, depName, depDay, depMonth, depYear, arrDay, arrMonth, arrYear) => {
      //To set dates
        let today = new Date();
        depDay = today.getDate();
        depMonth = MainSearch.getCorrectMonth(today.getMonth()+1).name;
        depYear = today.getFullYear();
        
        arrDay =  today.getDate();
        arrMonth = MainSearch.getCorrectMonth(today.getMonth()+2).name;
        arrYear = today.getFullYear();
      
       //For departure
       MainSearch.clearDepartureInput();
       MainSearch.addDeparture(departure, depName);
       
      //For arrival
      MainSearch.clearArrivalInput();
      
      //Open dates picker
      MainSearch.openDatePicker();
      
      //Add departure
      MainSearch.addDepartureDate(depDay, depMonth, depYear)
      
      //For arrival date
      MainSearch.addArrivalDate(arrDay, arrMonth, arrYear)
      
      
      //Confirm dates
      cy.xpath('//button[@data-test="SearchFormDoneButton"]').should('be.visible').click();
      
      //Hitting search button
       cy.contains('Explore').scrollIntoView().should('be.visible').click();
      
       });
      
Then("The search button is enabled and pop up is shown as a reasult", () => {
       //Clear the modal
       MainSearch.acceptModals();

      //Assertions
      cy.url().should("contains", `${Cypress.config('baseUrl')}/`);
     cy.xpath("//h2[text()='Where do you want to go?']").should('be.visible');
       });
     

  //Scenation 5

  When("A user enters no departure destination and no arrival,departure date {string} {string} {string} for today, arrival date {string} {string} {string} for next month and clicks on the search button", (depDay, depMonth, depYear, arrDay, arrMonth, arrYear) => {
    //To set dates
      let today = new Date();
      depDay = today.getDate();
      depMonth = MainSearch.getCorrectMonth(today.getMonth()+1).name;
      depYear = today.getFullYear();
      
      arrDay =  today.getDate();
      arrMonth = MainSearch.getCorrectMonth(today.getMonth()+2).name;
      arrYear = today.getFullYear();
    
     //For departure
     MainSearch.clearDepartureInput();

    //For arrival
    MainSearch.clearArrivalInput();
    
    //Open dates picker
    MainSearch.openDatePicker();
    
    //Add departure
    MainSearch.addDepartureDate(depDay, depMonth, depYear)
    
    //For arrival date
    MainSearch.addArrivalDate(arrDay, arrMonth, arrYear)
    
    
    //Confirm dates
    cy.xpath('//button[@data-test="SearchFormDoneButton"]').should('be.visible').click();
    
    //Hitting search button
     cy.contains('Explore').scrollIntoView().should('be.visible');
    
     });

     Then("The search button is disabled and page stays on the same URL address", () => {
     
      //Assertions
      cy.url().should("contains", `${Cypress.config('baseUrl')}/`);
        cy.xpath('//button[@data-test="LandingSearchButton"]').then((button)=>{
          cy.wrap(button).invoke('attr', 'class').then((classSearch)=>{
            expect(classSearch).to.include('cursor-not-allowed');
          })
        })
       });



//Scenario 6

When("A user enters departure {string} {string}, the arrival {string} {string}, a departure date {string} {string} {string}, arrival date {string} {string} {string} and clicks on the search button", (departure, depName, arrival, arrName,depDay, depMonth, depYear, arrDay, arrMonth, arrYear) => {

 
  //For departure
  MainSearch.clearDepartureInput();
  MainSearch.addDeparture(departure, depName);
  
  //Assertions
  cy.xpath(MainSearch.deaparturePicker).then((text)=>{
    expect(text).to.contain(departure)
     })
  
 //For arrival
 MainSearch.clearArrivalInput();
    MainSearch.addArrival(arrival, arrName);
    cy.xpath(MainSearch.outOfSearchScope).click();

      //Assertions
  cy.xpath(MainSearch.arrivalPicker).then((text)=>{
    expect(text).to.contain(arrival)
     })
 
//Open date picker
MainSearch.openDatePicker()

 //Add departure date
 MainSearch.addDepartureDate (depDay, depMonth, depYear);


//Add arrival date
MainSearch.addArrivalDate (arrDay, arrMonth, arrYear);
 

 //Confirm dates
 cy.xpath('//button[@data-test="SearchFormDoneButton"]').should('be.visible').click();
 

 //Hitting search button
  cy.xpath(MainSearch.searchButton).scrollIntoView().should('be.visible');
  
  
  //Opening the result page in the same tab
  MainSearch.openSearchInTheSameTab();

  });
  
 Then("The url will contain search subdirectory and have relevant results {string} and {string} for specific date window {string} + {string} and {string} + {string}", (depCode, arrCode, depDay, depMonthAbbr, arrDay, arrMonthAbbr) => {
   cy.on('window:confirm', ()=>{return true})
   MainSearch.acceptModals()
 
    //Assertions
    cy.url().should("contains", `https://www.kiwi.com/en/search/results/`);
 
    cy.xpath("//div[@data-test ='ResultList-results']").children().first().then((list)=>{
     cy.wrap(list).children('[data-test]')
     .should('be.visible')
     .should('have.length', 10)
     .should('contain', depCode)
     .should('contain', arrCode)
     })
 

      cy.xpath('//div[@data-test="QuickNavigationSection"]').first().children().then((list) => {
          cy.wrap(list).children()
              // .should('have.length', 10)
              .should('contain', `${depDay} ${depMonthAbbr}`)
              .should('contain', `${arrDay} ${arrMonthAbbr}`);
      });
    
    cy.xpath(`//div[text()="${depDay} ${depMonthAbbr}" and text()="${arrDay} ${arrMonthAbbr}"]`).then((child)=>{
     cy.wrap(child).parent().then((parent)=>{
       cy.wrap(parent).invoke('attr', 'class').then((classAttr)=>{
         expect(classAttr).to.include('border-2')
         expect(classAttr).to.include('border-solid')
         expect(classAttr).to.include('border-blue-normal')
       })
       })
       })
   });
 
//Scenario 7


When('A user enters the same value for {string} airport with name {string}  and {string} airport with name {string}', (departure, depName, arrival, arrName)=>{
  MainSearch.acceptModals();    
  MainSearch.clearDepartureInput();

   //Add departure
   MainSearch.addDeparture(departure, depName);
   cy.xpath(MainSearch.outOfSearchScope).click();

  //Assertions for departure
    cy.xpath(MainSearch.deaparturePicker).then((text)=>{
     expect(text).to.contain(departure)
    })

    MainSearch.clearArrivalInput();

    //Add arrival
    MainSearch.clearArrivalInput()
    MainSearch.addArrival(arrival, arrName);
    cy.xpath(MainSearch.outOfSearchScope).click();

   //Add assertion for arrival
    cy.xpath(MainSearch.arrivalPicker).then((text)=>{
    expect(text).to.contain(arrival)
    })

   //Hitting search button
   cy.xpath('//div[text()="Search"]', {timeout:10000}).scrollIntoView().should('be.visible');

    //Opening the result page in the same tab
    MainSearch.openSearchInTheSameTab();
})

Then('The search button is enabled, page will be redirected and error message is displayed', ()=>{
//Accept modals
MainSearch.acceptModals();
//Assertions
cy.url().should("contains", `https://www.kiwi.com/en/search/results/`);
let errorMessage = 'Sorry, we couldn’t find your trip. Try different dates?';
cy.get('body').should('contain', errorMessage);
})


//Scenario 8

When('A user enters the invalid value for {string} airport with name {string}  and valid {string} airport with name {string}', (departure, depName, arrival, arrName)=>{
  MainSearch.acceptModals();    
  MainSearch.clearDepartureInput();

   //Add departure
   MainSearch.clearDepartureInput();
   cy.xpath(MainSearch.searchFieldDepInput).type(departure);

  //Add arrival
    MainSearch.clearArrivalInput()
    MainSearch.addArrival(arrival, arrName);
    cy.xpath(MainSearch.outOfSearchScope).click();

   //Add assertion for arrival
    cy.xpath(MainSearch.arrivalPicker).then((text)=>{
    expect(text).to.contain(arrival)
    })

   //Hitting search button
   cy.xpath('//div[text()="Search"]', {timeout:10000}).scrollIntoView().should('be.visible').click();

   
})

Then('Page will not be redirected, search button is disabled', ()=>{
//Accept modals
MainSearch.acceptModals();
//Assertions
cy.url().should("contains", `${Cypress.config('baseUrl')}/`);
cy.xpath('//button[@data-test="LandingSearchButton"]').then((button)=>{
  cy.wrap(button).invoke('attr', 'class').then((classSearch)=>{
    expect(classSearch).to.include('cursor-not-allowed');
  })
})
})


//Scenario 9

When('A user enters the valid value for {string} airport with name {string}  and invalid {string} airport with name {string}', (departure, depName, arrival, arrName)=>{
  MainSearch.acceptModals();    
  MainSearch.clearDepartureInput();

   //Add departure
   MainSearch.clearDepartureInput();
  MainSearch.addDeparture(departure, depName)

  //Add arrival
    MainSearch.clearArrivalInput();
    cy.xpath(MainSearch.searchFieldArrInput).type(arrival);

  //Click aout of scope
  cy.xpath (MainSearch.outOfSearchScope).click();

   //Hitting search button
   cy.xpath(MainSearch.landingSearchButton, {timeout:10000}).scrollIntoView().should('be.visible').click();

   
})

Then('Page is not redirected to results, search button is disabled', ()=>{
//Accept modals
MainSearch.acceptModals();
//Assertions
cy.url().should("contains", `${Cypress.config('baseUrl')}/`);
cy.xpath("//h2[text()='Where do you want to go?']").should('be.visible');
})



//Scenario 10

When('A user enters the empty value for {string} airport with name {string}  and valid value for  {string} airport with name {string}', (departure, depName, arrival, arrName)=>{
  MainSearch.acceptModals();    
  MainSearch.clearDepartureInput();

  if (departure === 'EMPTY' )
  {
    departure = '     ';
    //Add departure
   MainSearch.clearDepartureInput();
   cy.xpath(MainSearch.searchFieldDepInput).type(departure);
  }

  else {
    //Add departure
   MainSearch.clearDepartureInput();
   MainSearch.addDeparture(departure, depName);
  }
   

  //Add arrival
  if(arrival === 'EMPTY') {
    arrival = '       ';
    cy.xpath(MainSearch.searchFieldArrInput).type(arrival);
  } else {
    MainSearch.clearArrivalInput()
    MainSearch.addArrival(arrival, arrName);
  }

  //Click aout of scope
  cy.xpath (MainSearch.outOfSearchScope).click();

   //Hitting search button
   cy.xpath(MainSearch.landingSearchButton, {timeout:10000}).scrollIntoView().should('be.visible');

   
})

Then('Page is not redirected after adding empty input, search button is disabled', ()=>{
//Accept modals
MainSearch.acceptModals();
//Assertions
cy.url().should("contains", `${Cypress.config('baseUrl')}/`);
cy.xpath(MainSearch.landingSearchButton).then((button)=>{
  cy.wrap(button).invoke('attr', 'class').then((classSearch)=>{
    expect(classSearch).to.include('cursor-not-allowed');
  })
})
})


//Scenario 11

When('A user enters the valid value for {string} airport with name {string}  and  empty value for {string} airport with name {string}', (departure, depName, arrival, arrName)=>{
  MainSearch.acceptModals();    
  MainSearch.clearDepartureInput();
console.log(departure)
  if (departure === 'EMPTY' )
  {
    departure = '     ';
    //Add departure
   MainSearch.clearDepartureInput();
   cy.xpath(MainSearch.searchFieldDepInput).type(departure);
  }

  else {
    //Add departure
   MainSearch.clearDepartureInput();
   MainSearch.addDeparture(departure, depName);
  }
   

  //Add arrival
  if(arrival === 'EMPTY') {
    arrival = '       ';
    cy.xpath(MainSearch.searchFieldArrInput).type(arrival);
  } else {
    MainSearch.clearArrivalInput()
    MainSearch.addArrival(arrival, arrName);
  }
 
  //Click aout of scope
   cy.xpath (MainSearch.outOfSearchScope).click();

   //Hitting search button
   cy.xpath(MainSearch.landingSearchButton, {timeout:10000}).scrollIntoView().should('be.visible').click();

})

Then('Page is not redirected after adding empty input, pop up window with message is displayed', ()=>{
//Accept modals
MainSearch.acceptModals();
//Assertions
cy.url().should("contains", `${Cypress.config('baseUrl')}/`);
cy.xpath("//h2[text()='Where do you want to go?']").should('be.visible');
})
