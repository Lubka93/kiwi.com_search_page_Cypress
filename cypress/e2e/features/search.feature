Feature: Search functionality

  Search functionality for kiwi.com webpage

  Background: 
  Given A web browser is at the main search page
  

 @runThis
   Scenario Outline: Default valid search with a valid arrival airport and valid departure airport, departure and arrival dates are not set
   # Given A web browser is at the main search page
    When A user enters valid "<departure>" airport with name "<depName>"  and "<arrival>" airport with name "<arrName>"
    Then The search button is enabled, page will be redirected and correct airport codes "<depCode>" and "<arrCode>" are diplayed
    Examples:
        | departure | arrival | depName  | arrName | depCode | arrCode |
        | Vienna  | Porto  | VIE Vienna International Airport | OPO Porto | VIE | OPO |
        | Porto  | Bratislava  | OPO Porto | BTS Bratislava Airport | OPO | BTS |
        | Bratislava  | Vienna  | BTS Bratislava Airport | VIE Vienna International Airport | BTS | VIE |

  Scenario: Default valid search with a specific date
 #  Given A web browser is at the main search page
    When A user enters departure "Vienna", the arrival "Porto", a departure date "22", arrival date "27" and clicks on the search button
    Then The url will contain search subdirectory and have relevant results for specific date window

   Scenario: Invalid search with a missing departure
   # Given A web browser is at the main search page
    When A user enters no departure, the arrival "Porto", a departure date "22", arrival date "27" and clicks on the search button
    Then The search button is disabled and result page is not opened


   Scenario: Invalid search with a missing arrival
   # Given A web browser is at the main search page
    When A user enters a departure "Vienna", no arrival destination, departure date "22", arrival date "27" and clicks the search button
    Then The search button is enabled and pop up is shown as a reasult



    Scenario: Invalid search with a missing arrival and missing departure
   # Given A web browser is at the main search page
    When A user enters no departure destination and no arrival, departure date "22", arrival date "27" and clicks the search button
    Then The search button is disabled and page stays on the same URL address

 