@api
Feature: Products API

  As a developer
  I want to verify the Products API endpoints
  So that I can ensure the backend is functioning correctly

  Scenario: Get all products returns a successful response
    When I send a GET request to "/api/productsList"
    Then the response status should be 200
    And the response should contain a products array

  Scenario: Get all brands returns a successful response
    When I send a GET request to "/api/brandsList"
    Then the response status should be 200
    And the response should contain a brands array

  Scenario: Search for a product via POST API
    When I send a POST search request to "/api/searchProduct" with term "top"
    Then the response status should be 200
    And the response should contain products matching "top"
