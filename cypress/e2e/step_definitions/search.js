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

When('A user valid departure {string}, the arrival {string}, and clicks on the search button', (departure,arrival) => {

//For departure
MainSearch.clearDepartureInput();
MainSearch.addDeparture(departure);

//Assertions
cy.xpath(MainSearch.deaparturePicker).then((text)=>{
  expect(text).to.contain('Vienna')
   })

  //For arrival
  MainSearch.clearArrivalInput();
  MainSearch.addArrival(arrival);
  cy.xpath(MainSearch.outOfSearchScope).click();

//Check if dates are set to "Anytime"
  cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]').invoke('attr', 'value').then((value)=>{
    expect(value).to.include('Anytime')
   })
   cy.xpath('(//input[@data-test="SearchFieldDateInput"])[2]').invoke('attr', 'value').then((value)=>{
    expect(value).to.include('Anytime')
   })

//Hitting search button
cy.xpath(MainSearch.searchButton).should('be.visible');

//Opening the result page in the same tab
MainSearch.openSearchInTheSameTab();
});

Then("The url will contain valid search subdirectory and have relevant results", () => {
 cy.on('window:confirm', ()=>{return true})
  MainSearch.acceptModals();

  //Assertions
  cy.url().should("contains", `https://www.kiwi.com/en/search/results/vienna-international-vienna-austria/porto-porto-portugal`);
  cy.xpath("//div[@data-test ='ResultList-results']").should('be.visible').children().first().then((list)=>{
   cy.wrap(list).children('div[data-test]')
   .should('have.length', 10)
   .should('contain', 'VIE')
   .should('contain', 'OPO')
   })
 });

//Scenario 2

When("A user enters departure {string}, the arrival {string}, a departure date {string}, arrival date {string} and clicks on the search button", (departure,arrival, departure_date, arrival_date) => {

 
 //For departure
 MainSearch.clearDepartureInput();
 MainSearch.addDeparture(departure);
 
 //Assertions
 cy.xpath(MainSearch.deaparturePicker).then((text)=>{
   expect(text).to.contain('Vienna')
    })
 
//For arrival
MainSearch.clearArrivalInput();
   MainSearch.addArrival(arrival);
   cy.xpath(MainSearch.outOfSearchScope).click();

//For departure date

cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]').scrollIntoView() // Scrolls the element into view
cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]').should('be.visible');
cy.contains('Book cheap flights other sites simply can’t find')
  .should('be.visible'); // for checking that page is stable ...because on this poit it fails !!!!!!!!

cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]', { timeout: 10000 }).should('exist');
cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]', { timeout: 10000 }).click({ force: true });
cy.xpath('//div[@data-test="NewDatePickerOpen"]').should('be.visible');


cy.xpath(`(//div[@data-test="CalendarContainer"])[1] //div[@data-test="DayDateTypography"][text()='${departure_date}']`).should('be.visible').click();

//For arrival date
//cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]').click();
cy.xpath(`(//div[@data-test="CalendarContainer"])[1] //div[@data-test="DayDateTypography"][text()='${arrival_date}']`).should('be.visible').click();

//Confirm dates
cy.xpath('//button[@data-test="SearchFormDoneButton"]').should('be.visible').click();

//Hitting search button
 cy.xpath(MainSearch.searchButton).scrollIntoView().should('be.visible');
 
 
 //Opening the result page in the same tab
 MainSearch.openSearchInTheSameTab();

 //For sharing variables to other blocks
 cy.wrap(departure_date).as('departure_date');
 cy.wrap(arrival_date).as('arrival_date');
 });
 
Then("The url will contain search subdirectory and have relevant results for specific date window", () => {
  cy.on('window:confirm', ()=>{return true})
  MainSearch.acceptModals()

   //Assertions
   cy.url().should("contains", `https://www.kiwi.com/en/search/results/vienna-international-vienna-austria/porto-porto-portugal`);

   cy.xpath("//div[@data-test ='ResultList-results']").children().first().then((list)=>{
    cy.wrap(list).children('[data-test]')
    .should('be.visible')
    .should('have.length', 10)
    .should('contain', 'VIE')
    .should('contain', 'OPO')
    })

    cy.get('@departure_date').then((departure_date) => {
      cy.get('@arrival_date').then((arrival_date) => {
          cy.xpath('//div[@data-test="QuickNavigationSection"]').first().children().then((list) => {
              cy.wrap(list).children()
                  // .should('have.length', 10)
                  .should('contain', `${departure_date} Aug`)
                  .should('contain', `${arrival_date} Aug`);
          });
      });
  });

  cy.get('@departure_date').then((departure_date) => {
    cy.get('@arrival_date').then((arrival_date) => {
   cy.xpath(`//div[text()="${departure_date} Aug" and text()="${arrival_date} Aug"]`).then((child)=>{
    cy.wrap(child).parent().then((parent)=>{
      cy.wrap(parent).invoke('attr', 'class').then((classAttr)=>{
        expect(classAttr).to.include('border-2')
        expect(classAttr).to.include('border-solid')
        expect(classAttr).to.include('border-blue-normal')
      })
      })
      })
  })
  })

  });

   
   //Scenario 3
   
When('A user enters no departure, the arrival {string}, a departure date {string}, arrival date {string} and clicks on the search button', (arrival, departure_date, arrival_date) => {
  
    //Add departure   - clear any departure for empty input
    MainSearch.clearDepartureInput();
    
    
   //Add arrival
   MainSearch.clearArrivalInput()
      MainSearch.addArrival(arrival);
      cy.xpath(MainSearch.outOfSearchScope).click();
   //Add assertion for arrival
      cy.xpath(MainSearch.arrivalPicker).then((text)=>{
        expect(text).to.contain(arrival)
         })
   
   //Add departure date
   
   cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]').scrollIntoView() // Scrolls the element into view
   cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]').should('be.visible');
   cy.contains('Book cheap flights other sites simply can’t find')
     .should('be.visible'); // for checking that page is stable ...because on this poit it fails !!!!!!!!
   
   cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]', { timeout: 10000 }).should('exist');
   cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]', { timeout: 10000 }).click({ force: true });
   cy.xpath('//div[@data-test="NewDatePickerOpen"]').should('be.visible');
   
   
   cy.xpath(`(//div[@data-test="CalendarContainer"])[1] //div[@data-test="DayDateTypography"][text()='${departure_date}']`).should('be.visible').click();
   
   //Add arrival date
   //cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]').click();
   cy.xpath(`(//div[@data-test="CalendarContainer"])[1] //div[@data-test="DayDateTypography"][text()='${arrival_date}']`).should('be.visible').click();
   
   //Confirm dates
   cy.xpath('//button[@data-test="SearchFormDoneButton"]').should('be.visible').click();
  
   // Scroll to the top of the page
  cy.scrollTo('top');

    });
    
Then("The search button is disabled and result page is not opened", () => {
     
    //Assertions
    cy.url().should("contains", `${Cypress.config('baseUrl')}/`);
  //  cy.xpath(MainSearch.searchButton).should('be.enabled');
      cy.xpath('//button[@data-test="LandingSearchButton"]').then((button)=>{
        cy.wrap(button).invoke('attr', 'class').then((classSearch)=>{
          expect(classSearch).to.include('cursor-not-allowed');
        })
      })
     });
   
     //Scenario 4
When('A user enters a departure {string}, no arrival destination, departure date {string}, arrival date {string} and clicks the search button', (departure, departure_date, arrival_date) => {
      MainSearch.clearDepartureInput();

     //Add departure
     MainSearch.addDeparture(departure);
     cy.xpath(MainSearch.outOfSearchScope).click();

    //Assertions for departure
     cy.xpath(MainSearch.deaparturePicker).then((text)=>{
       expect(text).to.contain(departure)
        })
     
     //Add arrival   - clear any arrival destination for empty input
     MainSearch.clearArrivalInput();


     //Add departure date
     cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]').scrollIntoView() // Scrolls the element into view
     cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]').should('be.visible');
     cy.contains('Book cheap flights other sites simply can’t find')
       .should('be.visible'); // for checking that page is stable ...because on this poit it fails !!!!!!!!
     
     cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]', { timeout: 10000 }).should('exist');
     cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]', { timeout: 10000 }).click({ force: true });
     cy.xpath('//div[@data-test="NewDatePickerOpen"]').should('be.visible');
     
     
     cy.xpath(`(//div[@data-test="CalendarContainer"])[1] //div[@data-test="DayDateTypography"][text()='${departure_date}']`).should('be.visible').click();
     
     //Add arrival date
     //cy.xpath('(//input[@data-test="SearchFieldDateInput"])[1]').click();
     cy.xpath(`(//div[@data-test="CalendarContainer"])[1] //div[@data-test="DayDateTypography"][text()='${arrival_date}']`).should('be.visible').click();
     
     //Confirm dates
     cy.xpath('//button[@data-test="SearchFormDoneButton"]').should('be.visible').click();

   // Scroll to the top of the page
  //   cy.scrollTo('top');

     //Hitting search button
     cy.xpath('//div[text()="Explore"]', {timeout:10000}).scrollIntoView().should('be.visible').click();
  
      });
      
Then("The search button is enabled and pop up is shown as a reasult", () => {
       
      //Assertions
      cy.url().should("contains", `${Cypress.config('baseUrl')}/`);
     cy.xpath("//h2[text()='Where do you want to go?']").should('be.visible');
       });
     