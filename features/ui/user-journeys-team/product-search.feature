@products
Feature: Products — Search and Cart

  As a shopper
  I want to search and manage products
  So that I can find and purchase what I need

  # Test Case 9: Search Product
  Scenario: Search for a product by keyword
    Given I navigate to the home page
    And the home page is visible
    When I click on Products
    Then I should be on the All Products page
    When I search for "dress"
    Then I should see the searched products heading
    And I should see at least one product result

  # Test Case 12: Add Products in Cart
  Scenario: Add two products to the cart and verify
    Given I navigate to the home page
    And the home page is visible
    When I click on Products
    Then I should be on the All Products page
    When I hover over the first product and add it to cart
    And I click Continue Shopping
    And I hover over the second product and add it to cart
    And I click View Cart
    Then both products should be added to the cart
    And the cart should display correct prices quantity and total
