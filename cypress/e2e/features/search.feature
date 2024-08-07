Feature: Search functionality

  Functional testing for search functionality - kiwi.com webpage

  Background: 
  Given A web browser is at the main search page
  

  Scenario Outline: Valid search with valid arrival airport and valid departure airport, departure and arrival dates are not set (positive)
  # Given A web browser is at the main search page
    When A user enters valid "<departure>" airport with name "<depName>"  and "<arrival>" airport with name "<arrName>"
    Then The search button is enabled, page will be redirected and correct airport codes "<depCode>" and "<arrCode>" are displayed
    Examples:
        | departure     | arrival     | depName                          | arrName                            | depCode     | arrCode |
        | Vienna        | Porto       | VIE Vienna International Airport | OPO Porto                          | VIE         | OPO     |
        | Porto         | Bratislava  | OPO Porto                        | BTS Bratislava Airport             | OPO         | BTS     |
        | Bratislava    | Vienna      | BTS Bratislava Airport           | VIE Vienna International Airport   | BTS         | VIE     |
        | Bratislava    | London      | BTS Bratislava Airport           | LGW Gatwick                        | BTS         | LGW     |

 
  Scenario: Search with valid departure, arrival airports and valid departure and arrival dates (positive)
  #  Given A web browser is at the main search page
    When A user enters departure "Vienna" "VIE Vienna International Airport", the arrival "Porto" "OPO Porto", departure date "today" "thisMonth" "thisYear" for today, arrival date "dayInNextMonth" "nextMonth" "thisYear" for next month and clicks on the search button
    Then The url will contain search subdirectory and have relevant results "VIE" and "OPO" for specific departure "today" "thisMonth" "thisYear" and arrival "dayInNextMonth" "next_month" "thisYear"

 
  Scenario: Search with a missing departure airport (negative)
  # Given A web browser is at the main search page
    When A user enters no departure, the arrival "Porto" "OPO Porto",  departure date "today" "thisMonth" "thisYear" for today, arrival date "dayInNextMonth" "nextMonth" "thisYear" for next month and clicks on the search button
    Then The search button is disabled and result page is not opened


  Scenario: Search with a missing arrival airport (negative)
  # Given A web browser is at the main search page
    When A user enters a departure "Vienna" "VIE Vienna International Airport", departure date "today" "thisMonth" "thisYear" for today, arrival date "dayInNextMonth" "nextMonth" "thisYear" for next month and clicks on the search button
    Then The search button is enabled and pop up is shown as a reasult


  Scenario: Search with a missing arrival and missing departure airports (negative)
  # Given A web browser is at the main search page
    When A user enters no departure destination and no arrival,departure date "today" "thisMonth" "thisYear" for today, arrival date "dayInNextMonth" "nextMonth" "thisYear" for next month and clicks on the search button
    Then The search button is disabled and page stays on the same URL address


  Scenario Outline: Valid search with a specific sets of departure and arrival dates (positive)
  #  Given A web browser is at the main search page
    When A user enters departure "Vienna" "VIE Vienna International Airport", the arrival "Porto" "OPO Porto", a departure date "<depDay>" "<depMonth>" "<depYear>", arrival date "<arrDay>" "<arrMonth>" "<arrYear>" and clicks on the search button
    Then The url will contain search subdirectory and have relevant results "VIE" and "OPO" for specific date window "<depDay>" + "<depMonthAbbr>" and "<arrDay>" + "<arrMonthAbbr>"
  
      Examples:
        | depDay | depMonth    | arrDay  | arrMonth     | depMonthAbbr | arrMonthAbbr | depYear | arrYear |
        |   22   | August      | 27      |    August    |       Aug    |       Aug    |   2024  |  2024   |
        |   22   | September   | 27      |    October   |      Sept    |       Oct    |   2024  |  2024   |
        |   22   | September   | 27      |    November  |      Sept    |       Nov    |   2024  |  2024   |


  @runThis  
   Scenario Outline: Search with the same value for arrival airport and departure airport, departure and arrival dates are not set (negative)
  # Given A web browser is at the main search page
    When A user enters the same value for "<departure>" airport with name "<depName>"  and "<arrival>" airport with name "<arrName>"
    Then The search button is enabled, page will be redirected and error message is displayed  
    Examples:
        | departure     | arrival     | depName                          | arrName                            | depCode     | arrCode |
        | Vienna        | Vienna      | VIE Vienna International Airport |VIE Vienna International Airport    | VIE         | VIE     |
        | Porto         | Porto       | OPO Porto                        | OPO Porto                          | OPO         | OPO     |

   Scenario Outline: Search with the invalid value for arrival airport and valid value for departure airport, departure and arrival dates are not set (negative)
  # Given A web browser is at the main search page
    When A user enters the invalid value for "<departure>" airport with name "<depName>"  and valid "<arrival>" airport with name "<arrName>"
    Then Page will not be redirected, search button is disabled
    Examples:
        | departure        | arrival        | depName                          | arrName                            | depCode     | arrCode |
        | Vienna%          | Porto          | VIE Vienna International Airport | OPO Porto                          | VIE         | OPO     |
        | Porto123         | Bratislava     | OPO Porto                        | BTS Bratislava Airport             | OPO         | BTS     |
        | Brat   islava    | Vienna         | BTS Bratislava Airport           | VIE Vienna International Airport   | BTS         | VIE     |
   
   Scenario Outline: Search with the valid value for arrival airport and invalid value for departure airport, departure and arrival dates are not set (negative)
  # Given A web browser is at the main search page
    When A user enters the valid value for "<departure>" airport with name "<depName>"  and invalid "<arrival>" airport with name "<arrName>"
    Then Page is not redirected to results, search button is disabled
    Examples:
        | departure        | arrival        | depName                          | arrName                            | depCode     | arrCode |
        | Vienna           | Porto%         | VIE Vienna International Airport | OPO Porto                          | VIE         | OPO     |
        | Porto            | Bratislava123  | OPO Porto                        | BTS Bratislava Airport             | OPO         | BTS     |
        | Bratislava       | V    ienna     | BTS Bratislava Airport           | VIE Vienna International Airport   | BTS         | VIE     |  
        


       Scenario Outline: Search with the empty value for departure airport and valid value for departure airport, departure and arrival dates are not set (negative)
  # Given A web browser is at the main search page
    When A user enters the empty value for "<departure>" airport with name "<depName>"  and valid value for  "<arrival>" airport with name "<arrName>"
    Then Page is not redirected after adding empty input, search button is disabled
    Examples:
         | departure        | arrival        | depName                          | arrName                            | depCode     | arrCode |
         |   EMPTY          | Vienna         | EMPTY                            | VIE Vienna International Airport   | EMPTY       | VIE     |
         |   EMPTY          | EMPTY          | EMPTY                            | EMPTY                              | EMPTY       | EMPTY   |

   Scenario Outline: Search with the valid value for arrival airport and empty value for departure airport, departure and arrival dates are not set (negative)
  # Given A web browser is at the main search page
    When A user enters the valid value for "<departure>" airport with name "<depName>"  and  empty value for "<arrival>" airport with name "<arrName>"
    Then Page is not redirected after adding empty input, pop up window with message is displayed
    Examples:
         | departure        | arrival        | depName                          | arrName                            | depCode     | arrCode |
         |   Vienna         | EMPTY          | VIE Vienna International Airport | EMPTY                              | BTS         | EMPTY   |
      