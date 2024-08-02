Feature: Search functionality

  Search functionality for kiwi.com webpage

  Background: 
  Given A web browser is at the main search page
  

  Scenario: Default valid search
   # Given A web browser is at the main search page
    When A user valid departure "Vienna", the arrival "Porto", and clicks on the search button
    Then The url will contain valid search subdirectory and have relevant results

  Scenario: Default valid search with a specific date
 #  Given A web browser is at the main search page
    When A user enters departure "Vienna", the arrival "Porto", a departure date "22", arrival date "27" and clicks on the search button
    Then The url will contain search subdirectory and have relevant results for specific date window

   Scenario: Invalid search with a missing departure
   # Given A web browser is at the main search page
    When A user enters no departure, the arrival "Porto", a departure date "22", arrival date "27" and clicks on the search button
    Then The search button is disabled and result page is not opened

  @runThis
   Scenario: Invalid search with a missing arrival
   # Given A web browser is at the main search page
    When A user enters a departure "Vienna", no arrival destination, departure date "22", arrival date "27" and clicks the search button
    Then The search button is disabled, result page is not opened